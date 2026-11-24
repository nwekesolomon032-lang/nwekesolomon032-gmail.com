import crypto from 'crypto';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import {
  type AuthenticatedRequest,
  clearSessionCookie,
  getAuthenticatedAdmin,
  hashPassword,
  requireAdmin,
  setSessionCookie,
  signSessionToken,
  verifyPassword,
} from './auth.ts';
import {
  db,
  getStudioSettings,
  KNOWLEDGE_CATEGORIES,
  logActivity,
  PRIVATE_ATTACHMENTS_DIR,
  PUBLIC_UPLOADS_DIR,
  saveStudioSettings,
} from './db.ts';
import {
  checkAiRateLimit,
  type ChatTurnInput,
  formatGeminiError,
  generateSolmonixAiReply,
  invalidateAiKnowledgeCache,
  streamSolmonixAiReply,
} from './ai.ts';
import {getEmailConfigStatus, sendClientDecisionEmail} from './email.ts';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const ALLOWED_ATTACHMENT_TYPES: Record<string, string> = {
  ...ALLOWED_IMAGE_TYPES,
  'application/pdf': '.pdf',
  'application/zip': '.zip',
  'application/x-zip-compressed': '.zip',
  'text/plain': '.txt',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

interface DbProjectRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  full_overview: string;
  client_name: string;
  completion_date: string;
  cover_image_url: string;
  gallery_images_json: string;
  website_screenshots_json: string;
  media_links_json: string;
  challenge: string;
  creative_approach: string;
  design_process: string;
  final_solution: string;
  tools_json: string;
  live_website_url: string;
  external_project_url: string;
  status: 'draft' | 'published';
  is_featured: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
}

interface DbApplicationRow {
  id: string;
  reference_number: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company_name: string;
  website_or_social: string;
  service_interested: string;
  business_about: string;
  project_description: string;
  problem_to_solve: string;
  expectations: string;
  budget_range: string;
  timeline: string;
  additional_details: string;
  attachments_json: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  internal_notes: string;
  rejection_reason: string;
  project_progress: string;
  decision_date: string;
  email_notified_at: string;
  created_at: string;
  updated_at: string;
}

interface DbKnowledgeRow {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string;
  source_filename: string;
  status: 'draft' | 'published';
  is_system_seed: number;
  created_at: string;
  updated_at: string;
}

function safeParseArray<T>(raw: string): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function serializeProject(row: DbProjectRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    shortDescription: row.short_description,
    fullOverview: row.full_overview,
    clientName: row.client_name,
    completionDate: row.completion_date,
    coverImageUrl: row.cover_image_url,
    galleryImages: safeParseArray<string>(row.gallery_images_json),
    websiteScreenshots: safeParseArray<string>(row.website_screenshots_json),
    mediaLinks: safeParseArray<string>(row.media_links_json),
    challenge: row.challenge,
    creativeApproach: row.creative_approach,
    designProcess: row.design_process,
    finalSolution: row.final_solution,
    tools: safeParseArray<string>(row.tools_json),
    liveWebsiteUrl: row.live_website_url,
    externalProjectUrl: row.external_project_url,
    status: row.status,
    isFeatured: Boolean(row.is_featured),
    isCompleted: Boolean(row.is_completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeApplication(row: DbApplicationRow) {
  return {
    id: row.id,
    referenceNumber: row.reference_number,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    companyName: row.company_name,
    websiteOrSocial: row.website_or_social,
    serviceInterested: row.service_interested,
    businessAbout: row.business_about,
    projectDescription: row.project_description,
    problemToSolve: row.problem_to_solve,
    expectations: row.expectations,
    budgetRange: row.budget_range,
    timeline: row.timeline,
    additionalDetails: row.additional_details,
    attachments: safeParseArray<{name: string; url: string; size: number; mimeType: string}>(
      row.attachments_json
    ),
    status: row.status,
    internalNotes: row.internal_notes,
    rejectionReason: row.rejection_reason,
    projectProgress: row.project_progress,
    decisionDate: row.decision_date,
    emailNotifiedAt: row.email_notified_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeKnowledgeEntry(row: DbKnowledgeRow) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    content: row.content,
    tags: row.tags,
    sourceFilename: row.source_filename,
    status: row.status,
    isSystemSeed: Boolean(row.is_system_seed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'project'
  );
}

function ensureUniqueSlug(baseTitle: string, excludeId?: string): string {
  const base = slugify(baseTitle);
  let candidate = base;
  let counter = 2;
  while (true) {
    const existing = db
      .prepare('SELECT id FROM portfolio_projects WHERE slug = ?')
      .get(candidate) as {id: string} | undefined;
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

function generateReferenceNumber(): string {
  const token = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SMX-${token}`;
}

export function createServerApp() {
  const app = express();

  // Security headers for uploaded assets and responses
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  // Publicly serve portfolio uploaded images
  app.use(
    '/uploads',
    express.static(PUBLIC_UPLOADS_DIR, {
      fallthrough: false,
      maxAge: '7d',
    })
  );
  app.use(
    '/uploads',
    (_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(404).json({ok: false, message: 'File not found.'});
    }
  );

  // Binary upload endpoints MUST come before express.json() or use dedicated raw parser
  app.post(
    '/api/admin/upload',
    requireAdmin,
    express.raw({type: '*/*', limit: '10mb'}),
    (req: AuthenticatedRequest, res) => {
      const contentType = String(req.headers['content-type'] || '')
        .split(';')[0]
        .trim()
        .toLowerCase();
      const ext = ALLOWED_IMAGE_TYPES[contentType];
      if (!ext) {
        res.status(400).json({
          ok: false,
          message: 'Unsupported image format. Please upload JPG, PNG, WebP, or GIF.',
        });
        return;
      }

      const body = req.body as Buffer;
      if (!Buffer.isBuffer(body) || body.length === 0) {
        res.status(400).json({ok: false, message: 'Uploaded file is empty.'});
        return;
      }
      if (body.length > 8 * 1024 * 1024) {
        res.status(400).json({
          ok: false,
          message: 'Image exceeds the 8MB maximum file size limit.',
        });
        return;
      }

      const filename = `${crypto.randomUUID()}${ext}`;
      const destination = path.join(PUBLIC_UPLOADS_DIR, filename);
      fs.writeFileSync(destination, body);

      const originalName = decodeURIComponent(
        String(req.headers['x-file-name'] || `image${ext}`)
      ).replace(/[^a-zA-Z0-9._-]/g, '_');

      res.status(201).json({
        ok: true,
        url: `/uploads/${filename}`,
        filename,
        originalName,
        size: body.length,
        mimeType: contentType,
      });
    }
  );

  app.post('/api/applications/upload', express.raw({type: '*/*', limit: '10mb'}), (req, res) => {
    const contentType = String(req.headers['content-type'] || '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    const ext = ALLOWED_ATTACHMENT_TYPES[contentType];
    if (!ext) {
      res.status(400).json({
        ok: false,
        message:
          'Unsupported file type. Allowed formats: PDF, PNG, JPG, WebP, DOC, DOCX, TXT, or ZIP.',
      });
      return;
    }

    const body = req.body as Buffer;
    if (!Buffer.isBuffer(body) || body.length === 0) {
      res.status(400).json({ok: false, message: 'Uploaded file is empty.'});
      return;
    }
    if (body.length > 8 * 1024 * 1024) {
      res.status(400).json({
        ok: false,
        message: 'Attachment exceeds the 8MB maximum file size limit.',
      });
      return;
    }

    const filename = `${crypto.randomUUID()}${ext}`;
    const destination = path.join(PRIVATE_ATTACHMENTS_DIR, filename);
    fs.writeFileSync(destination, body);

    const originalName = decodeURIComponent(
      String(req.headers['x-file-name'] || `attachment${ext}`)
    ).replace(/[^a-zA-Z0-9._ -]/g, '_');

    res.status(201).json({
      ok: true,
      url: `/api/admin/attachments/${filename}`,
      filename,
      name: originalName,
      size: body.length,
      mimeType: contentType,
    });
  });

  // Binary/text document extraction upload for Admin AI Knowledge Base
  app.post(
    '/api/admin/knowledge/upload-doc',
    requireAdmin,
    express.raw({type: '*/*', limit: '2mb'}),
    (req, res) => {
      const body = req.body as Buffer;
      if (!Buffer.isBuffer(body) || body.length === 0) {
        res.status(400).json({ok: false, message: 'Uploaded document is empty.'});
        return;
      }

      const rawFileName = decodeURIComponent(
        String(req.headers['x-file-name'] || 'document.txt')
      ).replace(/[^a-zA-Z0-9._ -]/g, '_');
      const ext = path.extname(rawFileName).toLowerCase();
      const allowedExts = new Set(['.txt', '.md', '.markdown', '.csv', '.json']);

      if (!allowedExts.has(ext)) {
        res.status(400).json({
          ok: false,
          message:
            'Please upload a plain-text or structured document (.txt, .md, .csv, or .json) up to 2MB.',
        });
        return;
      }

      const decodedText = body.toString('utf8').replace(/\0/g, '').trim();
      if (!decodedText) {
        res.status(400).json({ok: false, message: 'No readable text found inside the document.'});
        return;
      }

      const suggestedTitle = path
        .basename(rawFileName, ext)
        .replace(/[-_]+/g, ' ')
        .trim();

      res.status(200).json({
        ok: true,
        filename: rawFileName,
        suggestedTitle: suggestedTitle || 'Uploaded Document',
        extractedContent: decodedText.slice(0, 18000),
      });
    }
  );

  app.use(express.json({limit: '2mb'}));

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({status: 'ok', service: 'solmonix-studio'});
  });

  // ---------- PUBLIC SOLMONIX AI ASSISTANT ROUTES ----------
  app.post('/api/ai/chat/stream', async (req, res) => {
    const ipKey = String(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'visitor'
    )
      .split(',')[0]
      .trim();
    const limit = checkAiRateLimit(ipKey);
    if (!limit.allowed) {
      res.status(429).json({
        ok: false,
        message: `You've sent several messages quickly. Please wait ${limit.retryAfterSeconds}s and try again.`,
      });
      return;
    }

    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const history = Array.isArray(req.body?.history)
      ? (req.body.history as ChatTurnInput[])
      : [];

    if (!message) {
      res.status(400).json({ok: false, message: 'Please enter a message for SOLMONIX AI.'});
      return;
    }
    if (message.length > 1500) {
      res.status(400).json({
        ok: false,
        message: 'Message is too long. Please keep questions under 1,500 characters.',
      });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const heartbeat = setInterval(() => {
      if (!res.writableEnded) {
        res.write(': keepalive\n\n');
      }
    }, 4000);

    const sendEvent = (event: string, payload: unknown) => {
      if (!res.writableEnded) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
      }
    };

    try {
      const result = await streamSolmonixAiReply({
        message,
        history,
        onDelta: (text) => {
          sendEvent('chunk', {text});
        },
      });
      sendEvent('meta', result.meta);
      sendEvent('done', {ok: true});
    } catch (error) {
      const formatted = formatGeminiError(error);
      sendEvent('error', {status: formatted.status, message: formatted.message});
    } finally {
      clearInterval(heartbeat);
      if (!res.writableEnded) {
        res.end();
      }
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    const ipKey = String(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'visitor'
    )
      .split(',')[0]
      .trim();
    const limit = checkAiRateLimit(ipKey);
    if (!limit.allowed) {
      res.status(429).json({
        ok: false,
        message: `Rate limit reached. Please wait ${limit.retryAfterSeconds}s and try again.`,
      });
      return;
    }

    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const history = Array.isArray(req.body?.history)
      ? (req.body.history as ChatTurnInput[])
      : [];

    if (!message || message.length > 1500) {
      res.status(400).json({
        ok: false,
        message: 'Please provide a message between 1 and 1,500 characters.',
      });
      return;
    }

    try {
      const result = await generateSolmonixAiReply({message, history});
      res.json({ok: true, reply: result.reply, meta: result.meta});
    } catch (error) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ok: false, message: formatted.message});
    }
  });

  // ---------- AUTHENTICATION ROUTES ----------
  app.get('/api/auth/status', (req, res) => {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM admins').get() as {count: number};
    const admin = getAuthenticatedAdmin(req);
    res.json({
      ok: true,
      hasAdmin: countRow.count > 0,
      authenticated: Boolean(admin),
      admin,
    });
  });

  app.post('/api/auth/setup', (req, res) => {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM admins').get() as {count: number};
    if (countRow.count > 0) {
      res.status(409).json({
        ok: false,
        message: 'An administrator account already exists. Please sign in.',
      });
      return;
    }

    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (name.length < 2) {
      res.status(400).json({ok: false, message: 'Please enter the administrator name.'});
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      res.status(400).json({ok: false, message: 'Please enter a valid email address.'});
      return;
    }
    if (password.length < 8) {
      res.status(400).json({
        ok: false,
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    const {hash, salt} = hashPassword(password);
    const now = new Date().toISOString();
    const info = db
      .prepare(
        `INSERT INTO admins (name, email, role, password_hash, password_salt, created_at)
         VALUES (?, ?, 'administrator', ?, ?, ?)`
      )
      .run(name, email, hash, salt, now);

    const admin = {
      id: Number(info.lastInsertRowid),
      name,
      email,
      role: 'administrator',
    };

    const token = signSessionToken(admin);
    setSessionCookie(res, token);
    logActivity(
      'admin_initialized',
      'admin',
      String(admin.id),
      `Administrator account initialized for ${email}`,
      name
    );

    res.status(201).json({ok: true, admin});
  });

  app.post('/api/auth/login', (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!EMAIL_PATTERN.test(email) || !password) {
      res.status(400).json({ok: false, message: 'Email and password are required.'});
      return;
    }

    const row = db
      .prepare(
        'SELECT id, name, email, role, password_hash, password_salt FROM admins WHERE email = ?'
      )
      .get(email) as
      | {
          id: number;
          name: string;
          email: string;
          role: string;
          password_hash: string;
          password_salt: string;
        }
      | undefined;

    if (!row || !verifyPassword(password, row.password_hash, row.password_salt)) {
      res.status(401).json({ok: false, message: 'Invalid email address or password.'});
      return;
    }

    const admin = {id: row.id, name: row.name, email: row.email, role: row.role};
    const token = signSessionToken(admin);
    setSessionCookie(res, token);

    res.json({ok: true, admin});
  });

  app.post('/api/auth/logout', (_req, res) => {
    clearSessionCookie(res);
    res.json({ok: true});
  });

  app.post('/api/auth/change-password', requireAdmin, (req: AuthenticatedRequest, res) => {
    const currentPassword =
      typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (newPassword.length < 8) {
      res.status(400).json({ok: false, message: 'New password must be at least 8 characters.'});
      return;
    }

    const row = db
      .prepare('SELECT id, password_hash, password_salt FROM admins WHERE id = ?')
      .get(req.admin!.id) as {id: number; password_hash: string; password_salt: string} | undefined;

    if (!row || !verifyPassword(currentPassword, row.password_hash, row.password_salt)) {
      res.status(401).json({ok: false, message: 'Current password is incorrect.'});
      return;
    }

    const {hash, salt} = hashPassword(newPassword);
    db.prepare('UPDATE admins SET password_hash = ?, password_salt = ? WHERE id = ?').run(
      hash,
      salt,
      req.admin!.id
    );
    logActivity(
      'password_changed',
      'admin',
      String(req.admin!.id),
      'Administrator password updated',
      req.admin!.name
    );
    res.json({ok: true, message: 'Administrator password updated.'});
  });

  // ---------- PUBLIC STUDIO ROUTES ----------
  app.get('/api/settings/public', (_req, res) => {
    res.json({ok: true, settings: getStudioSettings()});
  });

  app.get('/api/projects', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const featuredOnly = req.query.featured === 'true';

    let sql = "SELECT * FROM portfolio_projects WHERE status = 'published'";
    const params: string[] = [];

    if (category && category !== 'All Projects') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (featuredOnly) {
      sql += ' AND is_featured = 1';
    }
    sql += ' ORDER BY is_featured DESC, updated_at DESC';

    const rows = db.prepare(sql).all(...params) as unknown as DbProjectRow[];
    res.json({ok: true, projects: rows.map(serializeProject)});
  });

  app.get('/api/projects/:slug', (req, res) => {
    const row = db
      .prepare("SELECT * FROM portfolio_projects WHERE slug = ? AND status = 'published'")
      .get(req.params.slug) as DbProjectRow | undefined;

    if (!row) {
      res.status(404).json({ok: false, message: 'Published project not found.'});
      return;
    }
    res.json({ok: true, project: serializeProject(row)});
  });

  // ---------- PUBLIC CLIENT APPLICATION SUBMISSION & TRACKING ----------
  app.post('/api/applications', async (req, res) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : '';
    const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : '';
    const websiteOrSocial =
      typeof body.websiteOrSocial === 'string' ? body.websiteOrSocial.trim() : '';
    const serviceInterested =
      typeof body.serviceInterested === 'string' ? body.serviceInterested.trim() : '';
    const businessAbout = typeof body.businessAbout === 'string' ? body.businessAbout.trim() : '';
    const projectDescription =
      typeof body.projectDescription === 'string' ? body.projectDescription.trim() : '';
    const problemToSolve =
      typeof body.problemToSolve === 'string' ? body.problemToSolve.trim() : '';
    const expectations = typeof body.expectations === 'string' ? body.expectations.trim() : '';
    const budgetRange = typeof body.budgetRange === 'string' ? body.budgetRange.trim() : '';
    const timeline = typeof body.timeline === 'string' ? body.timeline.trim() : '';
    const additionalDetails =
      typeof body.additionalDetails === 'string' ? body.additionalDetails.trim() : '';
    const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : [];

    const errors: Record<string, string> = {};
    if (fullName.length < 2) errors.fullName = 'Please provide your full name.';
    if (!EMAIL_PATTERN.test(email)) errors.email = 'Please provide a valid email address.';
    if (!serviceInterested) errors.serviceInterested = 'Please select a service.';
    if (projectDescription.length < 15) {
      errors.projectDescription = 'Please describe your project (at least 15 characters).';
    }
    if (!budgetRange) errors.budgetRange = 'Please select an estimated budget range.';
    if (!timeline) errors.timeline = 'Please choose your target start timeline.';

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        ok: false,
        message: 'Please review the highlighted fields before submitting.',
        errors,
      });
      return;
    }

    const id = crypto.randomUUID();
    let referenceNumber = generateReferenceNumber();
    while (
      db
        .prepare('SELECT id FROM client_applications WHERE reference_number = ?')
        .get(referenceNumber)
    ) {
      referenceNumber = generateReferenceNumber();
    }

    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO client_applications (
        id, reference_number, full_name, email, phone, whatsapp, company_name,
        website_or_social, service_interested, business_about, project_description,
        problem_to_solve, expectations, budget_range, timeline, additional_details,
        attachments_json, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?)`
    ).run(
      id,
      referenceNumber,
      fullName,
      email,
      phone,
      whatsapp,
      companyName,
      websiteOrSocial,
      serviceInterested,
      businessAbout,
      projectDescription,
      problemToSolve,
      expectations,
      budgetRange,
      timeline,
      additionalDetails,
      JSON.stringify(attachments),
      now,
      now
    );

    logActivity(
      'application_submitted',
      'application',
      id,
      `New application ${referenceNumber} from ${fullName}${companyName ? ` (${companyName})` : ''} for ${serviceInterested}`,
      fullName
    );

    const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            event: 'new_client_application',
            referenceNumber,
            fullName,
            email,
            companyName,
            serviceInterested,
            budgetRange,
            timeline,
            submittedAt: now,
          }),
        });
      } catch {
        // Non-blocking webhook error; database record is safely stored
      }
    }

    res.status(201).json({
      ok: true,
      referenceNumber,
      message: 'Application received and stored securely.',
    });
  });

  app.post('/api/applications/track', (req, res) => {
    const ref =
      typeof req.body?.referenceNumber === 'string'
        ? req.body.referenceNumber.trim().toUpperCase()
        : '';
    const email =
      typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';

    if (!ref || !EMAIL_PATTERN.test(email)) {
      res.status(400).json({
        ok: false,
        message: 'Please provide both your application reference number and verified email address.',
      });
      return;
    }

    const row = db
      .prepare(
        `SELECT reference_number, full_name, company_name, service_interested,
                budget_range, timeline, status, project_progress, decision_date,
                created_at, updated_at
         FROM client_applications
         WHERE UPPER(reference_number) = ? AND LOWER(email) = ?`
      )
      .get(ref, email) as
      | {
          reference_number: string;
          full_name: string;
          company_name: string;
          service_interested: string;
          budget_range: string;
          timeline: string;
          status: string;
          project_progress: string;
          decision_date: string;
          created_at: string;
          updated_at: string;
        }
      | undefined;

    if (!row) {
      res.status(404).json({
        ok: false,
        message:
          'No application matched that reference number and email address. Please verify both fields.',
      });
      return;
    }

    res.json({
      ok: true,
      application: {
        referenceNumber: row.reference_number,
        fullName: row.full_name,
        companyName: row.company_name,
        serviceInterested: row.service_interested,
        budgetRange: row.budget_range,
        timeline: row.timeline,
        status: row.status,
        projectProgress: row.status === 'Accepted' ? row.project_progress : null,
        decisionDate: row.decision_date || null,
        submittedAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  });

  // ---------- PROTECTED ADMIN ROUTES ----------
  app.get('/api/admin/overview', requireAdmin, (_req, res) => {
    const projectStats = db
      .prepare(
        `SELECT
          COUNT(*) as totalProjects,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as publishedProjects,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draftProjects
         FROM portfolio_projects`
      )
      .get() as {totalProjects: number; publishedProjects: number | null; draftProjects: number | null};

    const appStats = db
      .prepare(
        `SELECT
          COUNT(*) as totalApplications,
          SUM(CASE WHEN status IN ('Submitted', 'Under Review') THEN 1 ELSE 0 END) as pendingApplications,
          SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) as acceptedClients,
          SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejectedApplications
         FROM client_applications`
      )
      .get() as {
      totalApplications: number;
      pendingApplications: number | null;
      acceptedClients: number | null;
      rejectedApplications: number | null;
    };

    const recentActivity = db
      .prepare('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 12')
      .all() as Array<{
      id: number;
      event_type: string;
      entity_type: string;
      entity_id: string;
      summary: string;
      actor: string;
      created_at: string;
    }>;

    const recentProjects = (
      db
        .prepare('SELECT * FROM portfolio_projects ORDER BY updated_at DESC LIMIT 4')
        .all() as unknown as DbProjectRow[]
    ).map(serializeProject);

    const recentApplications = (
      db
        .prepare('SELECT * FROM client_applications ORDER BY created_at DESC LIMIT 5')
        .all() as unknown as DbApplicationRow[]
    ).map(serializeApplication);

    res.json({
      ok: true,
      stats: {
        totalProjects: projectStats.totalProjects || 0,
        publishedProjects: projectStats.publishedProjects || 0,
        draftProjects: projectStats.draftProjects || 0,
        totalApplications: appStats.totalApplications || 0,
        pendingApplications: appStats.pendingApplications || 0,
        acceptedClients: appStats.acceptedClients || 0,
        rejectedApplications: appStats.rejectedApplications || 0,
      },
      recentActivity: recentActivity.map((item) => ({
        id: item.id,
        eventType: item.event_type,
        entityType: item.entity_type,
        entityId: item.entity_id,
        summary: item.summary,
        actor: item.actor,
        createdAt: item.created_at,
      })),
      recentProjects,
      recentApplications,
    });
  });

  // Admin Portfolio CRUD
  app.get('/api/admin/projects', requireAdmin, (_req, res) => {
    const rows = db
      .prepare('SELECT * FROM portfolio_projects ORDER BY updated_at DESC')
      .all() as unknown as DbProjectRow[];
    res.json({ok: true, projects: rows.map(serializeProject)});
  });

  app.post('/api/admin/projects', requireAdmin, (req: AuthenticatedRequest, res) => {
    const b = (req.body || {}) as Record<string, unknown>;
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    const category = typeof b.category === 'string' ? b.category.trim() : '';
    const shortDescription =
      typeof b.shortDescription === 'string' ? b.shortDescription.trim() : '';
    const fullOverview = typeof b.fullOverview === 'string' ? b.fullOverview.trim() : '';

    if (title.length < 2 || !category || shortDescription.length < 10) {
      res.status(400).json({
        ok: false,
        message: 'Project title, category, and short description (min 10 chars) are required.',
      });
      return;
    }

    const id = crypto.randomUUID();
    const slug = ensureUniqueSlug(title);
    const now = new Date().toISOString();
    const status = b.status === 'published' ? 'published' : 'draft';
    const isFeatured = b.isFeatured ? 1 : 0;
    const isCompleted = b.isCompleted === false ? 0 : 1;

    db.prepare(
      `INSERT INTO portfolio_projects (
        id, slug, title, category, short_description, full_overview, client_name,
        completion_date, cover_image_url, gallery_images_json, website_screenshots_json,
        media_links_json, challenge, creative_approach, design_process, final_solution,
        tools_json, live_website_url, external_project_url, status, is_featured,
        is_completed, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      slug,
      title,
      category,
      shortDescription,
      fullOverview || shortDescription,
      typeof b.clientName === 'string' ? b.clientName.trim() : '',
      typeof b.completionDate === 'string' ? b.completionDate.trim() : '',
      typeof b.coverImageUrl === 'string' ? b.coverImageUrl.trim() : '',
      JSON.stringify(Array.isArray(b.galleryImages) ? b.galleryImages : []),
      JSON.stringify(Array.isArray(b.websiteScreenshots) ? b.websiteScreenshots : []),
      JSON.stringify(Array.isArray(b.mediaLinks) ? b.mediaLinks : []),
      typeof b.challenge === 'string' ? b.challenge.trim() : '',
      typeof b.creativeApproach === 'string' ? b.creativeApproach.trim() : '',
      typeof b.designProcess === 'string' ? b.designProcess.trim() : '',
      typeof b.finalSolution === 'string' ? b.finalSolution.trim() : '',
      JSON.stringify(Array.isArray(b.tools) ? b.tools : []),
      typeof b.liveWebsiteUrl === 'string' ? b.liveWebsiteUrl.trim() : '',
      typeof b.externalProjectUrl === 'string' ? b.externalProjectUrl.trim() : '',
      status,
      isFeatured,
      isCompleted,
      now,
      now
    );

    logActivity(
      status === 'published' ? 'project_published' : 'project_created',
      'project',
      id,
      `${status === 'published' ? 'Published' : 'Saved draft'} project "${title}" (${category})`,
      req.admin!.name
    );

    invalidateAiKnowledgeCache();

    const created = db
      .prepare('SELECT * FROM portfolio_projects WHERE id = ?')
      .get(id) as unknown as DbProjectRow;
    res.status(201).json({ok: true, project: serializeProject(created)});
  });

  app.put('/api/admin/projects/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
    const existing = db
      .prepare('SELECT * FROM portfolio_projects WHERE id = ?')
      .get(req.params.id) as DbProjectRow | undefined;

    if (!existing) {
      res.status(404).json({ok: false, message: 'Project not found.'});
      return;
    }

    const b = (req.body || {}) as Record<string, unknown>;
    const title = typeof b.title === 'string' ? b.title.trim() : existing.title;
    const category = typeof b.category === 'string' ? b.category.trim() : existing.category;
    const shortDescription =
      typeof b.shortDescription === 'string'
        ? b.shortDescription.trim()
        : existing.short_description;

    if (title.length < 2 || !category || shortDescription.length < 10) {
      res.status(400).json({
        ok: false,
        message: 'Project title, category, and short description (min 10 chars) are required.',
      });
      return;
    }

    const slug = title !== existing.title ? ensureUniqueSlug(title, existing.id) : existing.slug;
    const status =
      b.status === 'published' ? 'published' : b.status === 'draft' ? 'draft' : existing.status;
    const isFeatured =
      typeof b.isFeatured === 'boolean' ? (b.isFeatured ? 1 : 0) : existing.is_featured;
    const isCompleted =
      typeof b.isCompleted === 'boolean' ? (b.isCompleted ? 1 : 0) : existing.is_completed;
    const now = new Date().toISOString();

    db.prepare(
      `UPDATE portfolio_projects SET
        slug = ?, title = ?, category = ?, short_description = ?, full_overview = ?,
        client_name = ?, completion_date = ?, cover_image_url = ?, gallery_images_json = ?,
        website_screenshots_json = ?, media_links_json = ?, challenge = ?,
        creative_approach = ?, design_process = ?, final_solution = ?, tools_json = ?,
        live_website_url = ?, external_project_url = ?, status = ?, is_featured = ?,
        is_completed = ?, updated_at = ?
       WHERE id = ?`
    ).run(
      slug,
      title,
      category,
      shortDescription,
      typeof b.fullOverview === 'string' ? b.fullOverview.trim() : existing.full_overview,
      typeof b.clientName === 'string' ? b.clientName.trim() : existing.client_name,
      typeof b.completionDate === 'string' ? b.completionDate.trim() : existing.completion_date,
      typeof b.coverImageUrl === 'string' ? b.coverImageUrl.trim() : existing.cover_image_url,
      Array.isArray(b.galleryImages)
        ? JSON.stringify(b.galleryImages)
        : existing.gallery_images_json,
      Array.isArray(b.websiteScreenshots)
        ? JSON.stringify(b.websiteScreenshots)
        : existing.website_screenshots_json,
      Array.isArray(b.mediaLinks) ? JSON.stringify(b.mediaLinks) : existing.media_links_json,
      typeof b.challenge === 'string' ? b.challenge.trim() : existing.challenge,
      typeof b.creativeApproach === 'string'
        ? b.creativeApproach.trim()
        : existing.creative_approach,
      typeof b.designProcess === 'string' ? b.designProcess.trim() : existing.design_process,
      typeof b.finalSolution === 'string' ? b.finalSolution.trim() : existing.final_solution,
      Array.isArray(b.tools) ? JSON.stringify(b.tools) : existing.tools_json,
      typeof b.liveWebsiteUrl === 'string' ? b.liveWebsiteUrl.trim() : existing.live_website_url,
      typeof b.externalProjectUrl === 'string'
        ? b.externalProjectUrl.trim()
        : existing.external_project_url,
      status,
      isFeatured,
      isCompleted,
      now,
      existing.id
    );

    logActivity(
      status !== existing.status
        ? status === 'published'
          ? 'project_published'
          : 'project_unpublished'
        : 'project_updated',
      'project',
      existing.id,
      `Updated project "${title}" (${status})`,
      req.admin!.name
    );

    invalidateAiKnowledgeCache();

    const updated = db
      .prepare('SELECT * FROM portfolio_projects WHERE id = ?')
      .get(existing.id) as unknown as DbProjectRow;
    res.json({ok: true, project: serializeProject(updated)});
  });

  app.delete('/api/admin/projects/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
    const existing = db
      .prepare('SELECT id, title FROM portfolio_projects WHERE id = ?')
      .get(req.params.id) as {id: string; title: string} | undefined;
    if (!existing) {
      res.status(404).json({ok: false, message: 'Project not found.'});
      return;
    }

    db.prepare('DELETE FROM portfolio_projects WHERE id = ?').run(existing.id);
    invalidateAiKnowledgeCache();
    logActivity(
      'project_deleted',
      'project',
      existing.id,
      `Deleted project "${existing.title}"`,
      req.admin!.name
    );
    res.json({ok: true});
  });

  // Admin Applications & Accepted Clients
  app.get('/api/admin/applications', requireAdmin, (_req, res) => {
    const rows = db
      .prepare('SELECT * FROM client_applications ORDER BY created_at DESC')
      .all() as unknown as DbApplicationRow[];
    res.json({ok: true, applications: rows.map(serializeApplication)});
  });

  app.patch(
    '/api/admin/applications/:id/decision',
    requireAdmin,
    async (req: AuthenticatedRequest, res) => {
      const existing = db
        .prepare('SELECT * FROM client_applications WHERE id = ?')
        .get(req.params.id) as DbApplicationRow | undefined;

      if (!existing) {
        res.status(404).json({ok: false, message: 'Application not found.'});
        return;
      }

      const decision = req.body?.decision as 'Accepted' | 'Rejected' | 'Under Review' | 'Submitted';
      if (!['Accepted', 'Rejected', 'Under Review', 'Submitted'].includes(decision)) {
        res.status(400).json({ok: false, message: 'Invalid application status decision.'});
        return;
      }

      const internalNotes =
        typeof req.body?.internalNotes === 'string'
          ? req.body.internalNotes.trim()
          : existing.internal_notes;
      const rejectionReason =
        typeof req.body?.rejectionReason === 'string'
          ? req.body.rejectionReason.trim()
          : existing.rejection_reason;
      const notifyClient = Boolean(req.body?.notifyClient);
      const customMessage =
        typeof req.body?.customMessage === 'string' ? req.body.customMessage : undefined;

      const now = new Date().toISOString();
      const decisionDate =
        decision === 'Accepted' || decision === 'Rejected' ? now : existing.decision_date;

      let emailResult: {sent: boolean; provider: string; error?: string} | null = null;
      let emailNotifiedAt = existing.email_notified_at;

      if (notifyClient && (decision === 'Accepted' || decision === 'Rejected')) {
        emailResult = await sendClientDecisionEmail({
          to: existing.email,
          clientName: existing.full_name,
          referenceNumber: existing.reference_number,
          decision,
          service: existing.service_interested,
          customMessage,
        });
        if (emailResult.sent) {
          emailNotifiedAt = now;
        }
      }

      db.prepare(
        `UPDATE client_applications SET
          status = ?, internal_notes = ?, rejection_reason = ?,
          decision_date = ?, email_notified_at = ?, updated_at = ?
         WHERE id = ?`
      ).run(
        decision,
        internalNotes,
        rejectionReason,
        decisionDate,
        emailNotifiedAt,
        now,
        existing.id
      );

      logActivity(
        decision === 'Accepted'
          ? 'application_accepted'
          : decision === 'Rejected'
            ? 'application_rejected'
            : 'application_updated',
        'application',
        existing.id,
        `Marked application ${existing.reference_number} (${existing.full_name}) as ${decision}`,
        req.admin!.name
      );

      const updated = db
        .prepare('SELECT * FROM client_applications WHERE id = ?')
        .get(existing.id) as unknown as DbApplicationRow;

      res.json({
        ok: true,
        application: serializeApplication(updated),
        emailResult,
      });
    }
  );

  app.patch(
    '/api/admin/applications/:id/progress',
    requireAdmin,
    (req: AuthenticatedRequest, res) => {
      const existing = db
        .prepare('SELECT * FROM client_applications WHERE id = ?')
        .get(req.params.id) as DbApplicationRow | undefined;

      if (!existing) {
        res.status(404).json({ok: false, message: 'Client record not found.'});
        return;
      }

      const progress =
        typeof req.body?.projectProgress === 'string'
          ? req.body.projectProgress.trim()
          : existing.project_progress;
      const internalNotes =
        typeof req.body?.internalNotes === 'string'
          ? req.body.internalNotes.trim()
          : existing.internal_notes;

      const allowedProgress = [
        'Awaiting Start',
        'In Progress',
        'Awaiting Client Feedback',
        'Completed',
      ];
      if (!allowedProgress.includes(progress)) {
        res.status(400).json({ok: false, message: 'Invalid project progress status.'});
        return;
      }

      const now = new Date().toISOString();
      db.prepare(
        `UPDATE client_applications SET project_progress = ?, internal_notes = ?, updated_at = ? WHERE id = ?`
      ).run(progress, internalNotes, now, existing.id);

      logActivity(
        'client_progress_updated',
        'application',
        existing.id,
        `Updated ${existing.full_name} (${existing.reference_number}) progress to "${progress}"`,
        req.admin!.name
      );

      const updated = db
        .prepare('SELECT * FROM client_applications WHERE id = ?')
        .get(existing.id) as unknown as DbApplicationRow;
      res.json({ok: true, application: serializeApplication(updated)});
    }
  );

  // Protected private client attachment download
  app.get('/api/admin/attachments/:filename', requireAdmin, (req, res) => {
    const safeName = path.basename(String(req.params.filename || ''));
    const fullPath = path.join(PRIVATE_ATTACHMENTS_DIR, safeName);
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ok: false, message: 'Attachment not found.'});
      return;
    }
    res.sendFile(fullPath);
  });

  // Admin Settings
  app.get('/api/admin/settings', requireAdmin, (_req, res) => {
    res.json({
      ok: true,
      settings: getStudioSettings(),
      emailConfig: getEmailConfigStatus(),
    });
  });

  app.put('/api/admin/settings', requireAdmin, (req: AuthenticatedRequest, res) => {
    const current = getStudioSettings();
    const b = (req.body || {}) as Record<string, unknown>;

    const next = {
      budgetRanges: Array.isArray(b.budgetRanges)
        ? b.budgetRanges.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
        : current.budgetRanges,
      contact:
        b.contact && typeof b.contact === 'object'
          ? {...current.contact, ...(b.contact as typeof current.contact)}
          : current.contact,
      founder:
        b.founder && typeof b.founder === 'object'
          ? {...current.founder, ...(b.founder as typeof current.founder)}
          : current.founder,
      testimonials: Array.isArray(b.testimonials) ? b.testimonials : current.testimonials,
    };

    saveStudioSettings(next);
    invalidateAiKnowledgeCache();
    logActivity(
      'settings_updated',
      'settings',
      'studio_config',
      'Updated studio settings & configuration',
      req.admin!.name
    );

    res.json({
      ok: true,
      settings: getStudioSettings(),
      emailConfig: getEmailConfigStatus(),
    });
  });

  // ---------- ADMIN AI KNOWLEDGE BASE ROUTES ----------
  app.get('/api/admin/knowledge', requireAdmin, (_req, res) => {
    const rows = db
      .prepare('SELECT * FROM knowledge_entries ORDER BY is_system_seed ASC, updated_at DESC')
      .all() as unknown as DbKnowledgeRow[];
    res.json({
      ok: true,
      categories: KNOWLEDGE_CATEGORIES,
      entries: rows.map(serializeKnowledgeEntry),
    });
  });

  app.post('/api/admin/knowledge', requireAdmin, (req: AuthenticatedRequest, res) => {
    const b = (req.body || {}) as Record<string, unknown>;
    const category = typeof b.category === 'string' ? b.category.trim() : '';
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    const content = typeof b.content === 'string' ? b.content.trim() : '';
    const tags = typeof b.tags === 'string' ? b.tags.trim() : '';
    const sourceFilename = typeof b.sourceFilename === 'string' ? b.sourceFilename.trim() : '';
    const status = b.status === 'draft' ? 'draft' : 'published';

    if (!KNOWLEDGE_CATEGORIES.includes(category as (typeof KNOWLEDGE_CATEGORIES)[number])) {
      res.status(400).json({ok: false, message: 'Please choose a valid knowledge category.'});
      return;
    }
    if (title.length < 3 || content.length < 10) {
      res.status(400).json({
        ok: false,
        message: 'Title (min 3 characters) and content (min 10 characters) are required.',
      });
      return;
    }

    const id = `kb-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO knowledge_entries (
        id, category, title, content, tags, source_filename, status, is_system_seed, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    ).run(id, category, title, content, tags, sourceFilename, status, now, now);

    invalidateAiKnowledgeCache();
    logActivity(
      'knowledge_created',
      'knowledge',
      id,
      `Added AI knowledge entry "${title}" [${category}] (${status})`,
      req.admin!.name
    );

    const created = db
      .prepare('SELECT * FROM knowledge_entries WHERE id = ?')
      .get(id) as unknown as DbKnowledgeRow;
    res.status(201).json({ok: true, entry: serializeKnowledgeEntry(created)});
  });

  app.put('/api/admin/knowledge/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
    const existing = db
      .prepare('SELECT * FROM knowledge_entries WHERE id = ?')
      .get(req.params.id) as DbKnowledgeRow | undefined;

    if (!existing) {
      res.status(404).json({ok: false, message: 'Knowledge entry not found.'});
      return;
    }

    const b = (req.body || {}) as Record<string, unknown>;
    const category =
      typeof b.category === 'string' && b.category.trim() ? b.category.trim() : existing.category;
    const title = typeof b.title === 'string' ? b.title.trim() : existing.title;
    const content = typeof b.content === 'string' ? b.content.trim() : existing.content;
    const tags = typeof b.tags === 'string' ? b.tags.trim() : existing.tags;
    const status =
      b.status === 'draft' ? 'draft' : b.status === 'published' ? 'published' : existing.status;

    if (!KNOWLEDGE_CATEGORIES.includes(category as (typeof KNOWLEDGE_CATEGORIES)[number])) {
      res.status(400).json({ok: false, message: 'Invalid knowledge category.'});
      return;
    }
    if (title.length < 3 || content.length < 10) {
      res.status(400).json({
        ok: false,
        message: 'Title (min 3 characters) and content (min 10 characters) are required.',
      });
      return;
    }

    const now = new Date().toISOString();
    db.prepare(
      `UPDATE knowledge_entries SET category = ?, title = ?, content = ?, tags = ?, status = ?, updated_at = ?
       WHERE id = ?`
    ).run(category, title, content, tags, status, now, existing.id);

    invalidateAiKnowledgeCache();
    logActivity(
      'knowledge_updated',
      'knowledge',
      existing.id,
      `Updated AI knowledge entry "${title}" (${status})`,
      req.admin!.name
    );

    const updated = db
      .prepare('SELECT * FROM knowledge_entries WHERE id = ?')
      .get(existing.id) as unknown as DbKnowledgeRow;
    res.json({ok: true, entry: serializeKnowledgeEntry(updated)});
  });

  app.delete('/api/admin/knowledge/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
    const existing = db
      .prepare('SELECT id, title FROM knowledge_entries WHERE id = ?')
      .get(req.params.id) as {id: string; title: string} | undefined;
    if (!existing) {
      res.status(404).json({ok: false, message: 'Knowledge entry not found.'});
      return;
    }

    db.prepare('DELETE FROM knowledge_entries WHERE id = ?').run(existing.id);
    invalidateAiKnowledgeCache();
    logActivity(
      'knowledge_deleted',
      'knowledge',
      existing.id,
      `Removed AI knowledge entry "${existing.title}"`,
      req.admin!.name
    );
    res.json({ok: true});
  });

  app.post('/api/admin/ai/preview', requireAdmin, async (req, res) => {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const history = Array.isArray(req.body?.history)
      ? (req.body.history as ChatTurnInput[])
      : [];

    if (!message || message.length > 1500) {
      res.status(400).json({
        ok: false,
        message: 'Please enter a preview question between 1 and 1,500 characters.',
      });
      return;
    }

    try {
      invalidateAiKnowledgeCache();
      const result = await generateSolmonixAiReply({message, history});
      res.json({
        ok: true,
        reply: result.reply,
        meta: result.meta,
        groundingSummary: result.groundingSummary,
      });
    } catch (error) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ok: false, message: formatted.message});
    }
  });

  return app;
}
