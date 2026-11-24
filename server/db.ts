import fs from 'fs';
import os from 'os';
import path from 'path';
import {DatabaseSync} from 'node:sqlite';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveDataDir(): string {
  if (process.env.DATA_DIR?.trim()) {
    return path.resolve(process.env.DATA_DIR.trim());
  }
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'solmonix-data');
  }
  const localDir = path.resolve(__dirname, '..', 'data');
  try {
    fs.mkdirSync(localDir, {recursive: true});
    return localDir;
  } catch {
    return path.join(os.tmpdir(), 'solmonix-data');
  }
}

export const DATA_DIR = resolveDataDir();
export const PUBLIC_UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
export const PRIVATE_ATTACHMENTS_DIR = path.join(DATA_DIR, 'private-attachments');
export const DB_PATH = path.join(DATA_DIR, 'solmonix.db');

fs.mkdirSync(DATA_DIR, {recursive: true});
fs.mkdirSync(PUBLIC_UPLOADS_DIR, {recursive: true});
fs.mkdirSync(PRIVATE_ATTACHMENTS_DIR, {recursive: true});

export const db = new DatabaseSync(DB_PATH);

try {
  db.exec('PRAGMA journal_mode = WAL;');
} catch {
  // Ignore WAL pragma errors on ephemeral filesystems
}

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'administrator',
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS portfolio_projects (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_overview TEXT NOT NULL,
    client_name TEXT NOT NULL DEFAULT '',
    completion_date TEXT NOT NULL DEFAULT '',
    cover_image_url TEXT NOT NULL DEFAULT '',
    gallery_images_json TEXT NOT NULL DEFAULT '[]',
    website_screenshots_json TEXT NOT NULL DEFAULT '[]',
    media_links_json TEXT NOT NULL DEFAULT '[]',
    challenge TEXT NOT NULL DEFAULT '',
    creative_approach TEXT NOT NULL DEFAULT '',
    design_process TEXT NOT NULL DEFAULT '',
    final_solution TEXT NOT NULL DEFAULT '',
    tools_json TEXT NOT NULL DEFAULT '[]',
    live_website_url TEXT NOT NULL DEFAULT '',
    external_project_url TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft',
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_completed INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS client_applications (
    id TEXT PRIMARY KEY,
    reference_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    whatsapp TEXT NOT NULL DEFAULT '',
    company_name TEXT NOT NULL DEFAULT '',
    website_or_social TEXT NOT NULL DEFAULT '',
    service_interested TEXT NOT NULL,
    business_about TEXT NOT NULL DEFAULT '',
    project_description TEXT NOT NULL,
    problem_to_solve TEXT NOT NULL DEFAULT '',
    expectations TEXT NOT NULL DEFAULT '',
    budget_range TEXT NOT NULL,
    timeline TEXT NOT NULL,
    additional_details TEXT NOT NULL DEFAULT '',
    attachments_json TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'Submitted',
    internal_notes TEXT NOT NULL DEFAULT '',
    rejection_reason TEXT NOT NULL DEFAULT '',
    project_progress TEXT NOT NULL DEFAULT 'Awaiting Start',
    decision_date TEXT NOT NULL DEFAULT '',
    email_notified_at TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS studio_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    actor TEXT NOT NULL DEFAULT 'System',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS knowledge_entries (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '',
    source_filename TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'published',
    is_system_seed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

export interface DefaultStudioSettings {
  budgetRanges: string[];
  contact: {
    whatsappNumber: string;
    email: string;
    secondaryEmail?: string;
    phone: string;
    instagramHandle: string;
    instagramUrl: string;
    facebookLabel: string;
    facebookUrl: string;
    tiktokLabel?: string;
    tiktokUrl?: string;
    linkedinLabel: string;
    linkedinUrl: string;
    xLabel?: string;
    xUrl?: string;
    behanceLabel?: string;
    behanceUrl?: string;
    dribbbleLabel?: string;
    dribbbleUrl?: string;
    location: string;
    workingHours: string;
    preferredContactMethod: string;
    tagline: string;
  };
  founder: {
    name: string;
    role: string;
    photoUrl: string;
    bio: string;
    quote: string;
  };
  testimonials: Array<{
    id: string;
    quote: string;
    clientName: string;
    roleAndCompany: string;
    projectCategory: string;
  }>;
}

export const INITIAL_STUDIO_SETTINGS: DefaultStudioSettings = {
  budgetRanges: [
    '$1,500 – $3,000',
    '$3,000 – $7,500',
    '$7,500 – $15,000',
    '$15,000 – $30,000',
    '$30,000+',
    'Custom / To Be Discussed',
  ],
  contact: {
    whatsappNumber: '+234 916 140 7826',
    email: 'nwekesolosmart135@gmail.com',
    secondaryEmail: 'nwekesolomon032@gmail.com',
    phone: '09161407826 / 09068653628',
    instagramHandle: '@nwekesolosmart135',
    instagramUrl: 'https://www.instagram.com/nwekesolosmart135',
    facebookLabel: 'Nweke Solomon',
    facebookUrl: '',
    tiktokLabel: '',
    tiktokUrl: '',
    linkedinLabel: '',
    linkedinUrl: '',
    xLabel: '',
    xUrl: '',
    behanceLabel: '',
    behanceUrl: '',
    dribbbleLabel: '',
    dribbbleUrl: '',
    location: '',
    workingHours: 'Always Open',
    preferredContactMethod: 'WhatsApp',
    tagline: 'Designing Brands. Building Digital Experiences.',
  },
  founder: {
    name: 'Solomon [Update in Admin Settings]',
    role: 'Founder & Creative Director, SOLMONIX STUDIO',
    photoUrl: '',
    bio: 'SOLMONIX STUDIO was founded on a simple conviction: ambitious businesses deserve brand identities and digital platforms that reflect their true calibre. Update this founder biography and upload a portrait from the Admin Settings workspace.',
    quote:
      'Clarity is the highest form of sophistication. When a brand knows exactly what it stands for, every pixel and typographic decision becomes effortless to trust.',
  },
  testimonials: [],
};

const existingSettings = db
  .prepare('SELECT setting_value FROM studio_settings WHERE setting_key = ?')
  .get('studio_config') as {setting_value: string} | undefined;

if (!existingSettings) {
  db.prepare(
    'INSERT INTO studio_settings (setting_key, setting_value, updated_at) VALUES (?, ?, ?)'
  ).run('studio_config', JSON.stringify(INITIAL_STUDIO_SETTINGS), new Date().toISOString());
} else {
  try {
    const parsedExisting = JSON.parse(existingSettings.setting_value) as Partial<DefaultStudioSettings>;
    const existingContact = parsedExisting.contact as Partial<DefaultStudioSettings['contact']> | undefined;
    const isUnconfiguredPlaceholder =
      existingContact?.email === 'hello@solmonixstudio.com' &&
      !existingContact?.whatsappNumber &&
      existingContact?.instagramHandle === '@solmonixstudio';

    if (isUnconfiguredPlaceholder) {
      const migrated: DefaultStudioSettings = {
        budgetRanges:
          Array.isArray(parsedExisting.budgetRanges) && parsedExisting.budgetRanges.length > 0
            ? parsedExisting.budgetRanges
            : INITIAL_STUDIO_SETTINGS.budgetRanges,
        contact: INITIAL_STUDIO_SETTINGS.contact,
        founder: {...INITIAL_STUDIO_SETTINGS.founder, ...(parsedExisting.founder || {})},
        testimonials: Array.isArray(parsedExisting.testimonials) ? parsedExisting.testimonials : [],
      };
      db.prepare(
        'UPDATE studio_settings SET setting_value = ?, updated_at = ? WHERE setting_key = ?'
      ).run(JSON.stringify(migrated), new Date().toISOString(), 'studio_config');
    }
  } catch {
    // Ignore malformed existing JSON and let getStudioSettings handle fallback
  }
}

export function getStudioSettings(): DefaultStudioSettings {
  const row = db
    .prepare('SELECT setting_value FROM studio_settings WHERE setting_key = ?')
    .get('studio_config') as {setting_value: string} | undefined;
  if (!row) return INITIAL_STUDIO_SETTINGS;
  try {
    const parsed = JSON.parse(row.setting_value) as Partial<DefaultStudioSettings>;
    return {
      budgetRanges:
        Array.isArray(parsed.budgetRanges) && parsed.budgetRanges.length > 0
          ? parsed.budgetRanges
          : INITIAL_STUDIO_SETTINGS.budgetRanges,
      contact: {...INITIAL_STUDIO_SETTINGS.contact, ...(parsed.contact || {})},
      founder: {...INITIAL_STUDIO_SETTINGS.founder, ...(parsed.founder || {})},
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
    };
  } catch {
    return INITIAL_STUDIO_SETTINGS;
  }
}

export function saveStudioSettings(next: DefaultStudioSettings) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO studio_settings (setting_key, setting_value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = excluded.updated_at`
  ).run('studio_config', JSON.stringify(next), now);
}

export function logActivity(
  eventType: string,
  entityType: string,
  entityId: string,
  summary: string,
  actor = 'Administrator'
) {
  db.prepare(
    `INSERT INTO activity_logs (event_type, entity_type, entity_id, summary, actor, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(eventType, entityType, entityId, summary, actor, new Date().toISOString());
}

export const KNOWLEDGE_CATEGORIES = [
  'About the Agency',
  'Services',
  'Portfolio',
  'Pricing and Packages',
  'Frequently Asked Questions',
  'Contact Information',
  'Policies and Processes',
] as const;

const INITIAL_KNOWLEDGE_ENTRIES: Array<{
  id: string;
  category: (typeof KNOWLEDGE_CATEGORIES)[number];
  title: string;
  content: string;
  tags: string;
}> = [
  {
    id: 'kb-about-identity',
    category: 'About the Agency',
    title: 'SOLMONIX STUDIO Overview, Mission & Vision',
    tags: 'agency, mission, vision, philosophy, positioning, about',
    content: [
      'Brand Name: SOLMONIX STUDIO',
      'Tagline: Designing Brands. Building Digital Experiences.',
      'Positioning: Premium creative and digital agency transforming ambitious ideas into distinctive brand identities and powerful digital experiences.',
      'Core Purpose: Eliminate the compromise between boutique visual craft and commercial performance by unifying brand identity, graphic communication, website design, and custom web engineering under one roof.',
      'Mission: Elevate ambitious brands into undeniable market leaders through cohesive visual systems, high-impact collateral, and bespoke digital platforms that deepen trust and support commercial growth.',
      'Vision: Set the benchmark for modern creative and digital direction—defined by architectural restraint, technical excellence, and lasting brand equity.',
      'Creative Philosophy: Restraint gives bold ideas their power. Clarity over decorative noise, precision craftsmanship, honest senior collaboration, and durable brand foundations.',
    ].join('\n'),
  },
  {
    id: 'kb-service-brand-identity',
    category: 'Services',
    title: 'Brand Identity Design',
    tags: 'branding, logo, visual identity, guidelines, startup, rebrand',
    content: [
      'What it means: Strategic visual systems, distinctive marks (wordmarks, monograms, responsive logo suites), colour architecture, typographic hierarchy, custom iconography, and comprehensive Brand Guidelines built to scale across print and digital touchpoints.',
      'Problems it solves: Eliminates generic or forgettable visual presentation, inconsistent branding across channels, and low perceived authority in competitive markets.',
      'Key benefits: Immediate differentiation, consistent presentation across every client touchpoint, higher perceived enterprise value, and clear internal brand rules.',
      'Ideal businesses: Founders launching category-defining startups or established organizations ready for a decisive rebrand.',
      'Information needed to start: Business overview, target audience, competitive landscape, brand personality goals, and any existing materials or visual references.',
    ].join('\n'),
  },
  {
    id: 'kb-service-graphic-design',
    category: 'Services',
    title: 'Graphic Design',
    tags: 'graphic design, posters, pitch decks, packaging, collateral, print',
    content: [
      'What it means: High-impact editorial collateral, investor pitch decks, sales presentation systems, print publications, lookbooks, packaging direction, event signage, and launch campaign artwork crafted with typographic discipline.',
      'Problems it solves: Replaces cluttered slides, disjointed marketing handouts, and weak promotional artwork with cohesive, persuasive visual communication.',
      'Key benefits: Persuasive visual storytelling for fundraising or sales, tactile collateral that reinforces brand prestige, reusable marketing templates, and print-ready production specifications.',
      'Ideal businesses: Organizations preparing for product launches, investor rounds, exhibitions, retail packaging, or refreshed promotional collateral.',
      'Information needed to start: Specific deliverable formats needed, campaign objective, copy or content outline, target dimensions, and brand assets if already available.',
    ].join('\n'),
  },
  {
    id: 'kb-service-website-design',
    category: 'Services',
    title: 'Website Design',
    tags: 'website design, ui, ux, redesign, company website, landing page',
    content: [
      'What it means: Bespoke UI/UX architecture, sitemap planning, conversion user flows, high-fidelity desktop and mobile design systems, interactive prototypes, and motion specifications—never off-the-shelf templates.',
      'Problems it solves: Fixes confusing visitor journeys, dated or template-looking company websites, poor mobile layouts, and low enquiry conversion.',
      'Key benefits: Stronger first-impression credibility within seconds, structured buyer journeys toward qualified enquiries, visual parity across desktop and mobile, and effortless engineering handoff.',
      'Ideal businesses: Companies needing a flagship website, service showcase, portfolio platform, or conversion-focused product site.',
      'Information needed to start: Website goals (company overview, portfolio, lead generation, product showcase), target pages/sections, reference inspiration, and timeline.',
    ].join('\n'),
  },
  {
    id: 'kb-service-website-development',
    category: 'Services',
    title: 'Website Development',
    tags: 'website development, frontend, full-stack, react, typescript, seo, performance',
    content: [
      'What it means: Fast, accessible, production-grade frontend and full-stack web engineering (React, TypeScript, modern web standards) featuring crisp motion choreography, technical SEO, OpenGraph/Schema.org metadata, interactive forms, and backend/API integration.',
      'Problems it solves: Eliminates slow bloated page builders, unresponsive mobile pages, broken forms, and weak technical SEO foundations.',
      'Key benefits: Rapid load speeds protecting retention and search visibility, clean maintainable codebase, WCAG-conscious accessibility and keyboard ergonomics, and cross-browser QA.',
      'Ideal businesses: Brands ready to translate approved custom designs or refreshed architecture into live, dependable, high-performing digital products.',
      'Information needed to start: Existing designs (or whether Website Design is also needed), required pages and integrations, form/backend workflows, and target launch window.',
    ].join('\n'),
  },
  {
    id: 'kb-service-social-media-design',
    category: 'Services',
    title: 'Social Media Design',
    tags: 'social media, instagram, linkedin, carousels, templates, campaign graphics',
    content: [
      'What it means: Cohesive social visual identity, feed grid art direction, modular campaign and carousel template systems, launch announcement graphics, motion-ready story frames, and profile assets (covers, avatars, highlight icons).',
      'Problems it solves: Fixes fragmented, inconsistent social feeds and slow daily content production without clear brand rules.',
      'Key benefits: Instant feed recognition, consistent visual quality, higher scannability and clarity, and unified alignment with your website and core brand.',
      'Ideal businesses: Growing brands, founders, and executive teams building visual authority on Instagram, LinkedIn, and launch channels.',
      'Information needed to start: Active social platforms, brand guidelines/assets, campaign focus or recurring content formats, and publishing cadence.',
    ].join('\n'),
  },
  {
    id: 'kb-process-workflow',
    category: 'Policies and Processes',
    title: 'How Working With SOLMONIX STUDIO Works (5-Stage Process & Application Policy)',
    tags: 'process, workflow, discovery, strategy, creative development, review, delivery, apply',
    content: [
      'Structured Agency Workflow:',
      '1. Discovery: Audit business goals, competitive landscape, and audience expectations to align on a clear strategic brief.',
      '2. Strategy: Define brand positioning, sitemap/information architecture, and creative territory before visual execution begins.',
      '3. Creative Development: Design bespoke identity assets, layouts, collateral, or full-stack web engineering with precision.',
      '4. Review & Refinement: Collaborative review checkpoints to polish details, verify responsiveness, and ensure alignment with objectives.',
      '5. Final Delivery: Organized production files, brand guidelines, or live web deployment supported by thorough QA.',
      'Project Application Policy: Prospective clients submit project requirements via the Start a Project application form (/start-a-project) and receive a unique SMX reference code to track status (/track). All applications are personally reviewed and decided by the SOLMONIX STUDIO team—never auto-approved.',
    ].join('\n'),
  },
  {
    id: 'kb-pricing-policy',
    category: 'Pricing and Packages',
    title: 'Pricing, Quotations & Engagement Scope',
    tags: 'pricing, cost, quote, budget, packages, estimate',
    content: [
      'SOLMONIX STUDIO crafts tailored proposals scoped around each project’s deliverables, complexity, and timeline rather than publishing one-size-fits-all flat prices.',
      'Visitors can select an estimated budget bracket when submitting a Start a Project application (/start-a-project) so the team can prepare an accurate quotation and scope recommendation.',
      'If a visitor asks for exact pricing not listed here, explain honestly that exact quotations depend on scope and invite them to submit a brief on the Start a Project page for a tailored quote.',
    ].join('\n'),
  },
  {
    id: 'kb-faq-general',
    category: 'Frequently Asked Questions',
    title: 'Common Client Questions',
    tags: 'faq, questions, remote, startup, timeline, multiple services',
    content: [
      'Q: Do you work with clients internationally / remotely? A: Yes, SOLMONIX STUDIO operates globally and collaborates remotely with founders and organizations worldwide.',
      'Q: Can I combine multiple services (e.g., Brand Identity + Website Design & Development)? A: Yes—the Start a Project form supports selecting Multiple Services for a unified brand-to-web engagement.',
      'Q: What happens after I submit a project application? A: You receive a tracking reference number (SMX-XXXXXX) immediately, and the SOLMONIX STUDIO team reviews your brief and responds via your preferred contact method.',
    ].join('\n'),
  },
];

const kbCountRow = db.prepare('SELECT COUNT(*) as count FROM knowledge_entries').get() as {
  count: number;
};

if (kbCountRow.count === 0) {
  const now = new Date().toISOString();
  const insertKb = db.prepare(
    `INSERT INTO knowledge_entries (
      id, category, title, content, tags, source_filename, status, is_system_seed, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, '', 'published', 1, ?, ?)`
  );
  for (const item of INITIAL_KNOWLEDGE_ENTRIES) {
    insertKb.run(item.id, item.category, item.title, item.content, item.tags, now, now);
  }
}

const EXISTING_CALIFORNIA_SLUG = 'california-custom-landscape';
const existingCaliforniaProject = db
  .prepare('SELECT id, live_website_url FROM portfolio_projects WHERE slug = ?')
  .get(EXISTING_CALIFORNIA_SLUG) as {id: string; live_website_url: string} | undefined;

if (!existingCaliforniaProject) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO portfolio_projects (
      id, slug, title, category, short_description, full_overview, client_name,
      completion_date, cover_image_url, gallery_images_json, website_screenshots_json,
      media_links_json, challenge, creative_approach, design_process, final_solution,
      tools_json, live_website_url, external_project_url, status, is_featured,
      is_completed, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    'proj-california-custom-landscape',
    EXISTING_CALIFORNIA_SLUG,
    'California Custom Landscape, Inc.',
    'Website Design',
    'Full-service landscaping, hardscaping, concrete, and artificial turf contractor website featuring organic curved wave transitions, service showcases, regional coverage, and direct free-estimate conversion paths.',
    'Designed and engineered a flagship regional service website for California Custom Landscape, Inc.—a Southern California landscaping and hardscaping contractor operating since 2001. Built to turn residential property owners into qualified estimate calls through high-contrast visual proof, clear trade segmentation, and effortless navigation.',
    'California Custom Landscape, Inc.',
    'November 2026',
    '/assets/aistudio/screencapture-cclandscapeinc-2026-11-23-12_55_16_266c3e76.png',
    JSON.stringify([
      '/assets/aistudio/screencapture-cclandscapeinc-2026-11-23-12_55_16_266c3e76.png',
    ]),
    JSON.stringify([
      '/assets/aistudio/screencapture-cclandscapeinc-2026-11-23-12_55_16_266c3e76.png',
    ]),
    JSON.stringify([]),
    'Local residential contractors often rely on cluttered template websites that hide real project photography and bury telephone estimate actions below the fold.',
    'Paired an organic curved-wave section rhythm with a crisp white and deep architectural charcoal palette accented by high-intent sky-blue CTAs, positioning outdoor living photography front and center.',
    'Mapped homeowner decision journeys from hero contractor trust signals (since 2001, CL# 791956) into three core service pillars—Landscape, Concrete, and Artificial Turf—followed by Southern California city coverage and verified client testimonials.',
    'Delivered a responsive, conversion-driven website experience complete with interactive trade filtering, estimate request capture, lightbox gallery inspection, and one-click call routing.',
    JSON.stringify([
      'Website Design',
      'React & TypeScript',
      'Tailwind CSS',
      'Curved SVG Grid',
      'Lead Conversion UI',
    ]),
    '/showcase/california-custom-landscape',
    '',
    'published',
    1,
    1,
    now,
    now
  );
}

