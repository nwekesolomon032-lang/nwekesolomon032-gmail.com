export type PageRoute =
  | '/'
  | '/about'
  | '/services'
  | '/projects'
  | '/showcase'
  | '/brand-identity'
  | '/start-a-project'
  | '/track'
  | '/contact'
  | '/admin';

export type AdminSection =
  | 'overview'
  | 'portfolio'
  | 'project-form'
  | 'applications'
  | 'accepted'
  | 'rejected'
  | 'knowledge'
  | 'settings';

export type ProjectCategory =
  | 'Brand Identity Design'
  | 'Graphic Design'
  | 'Website Design'
  | 'Website Development'
  | 'Social Media Design';

export type ProjectFilter = 'All Projects' | ProjectCategory;

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  deliverables: string[];
  benefits: string[];
  idealFor: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory | string;
  shortDescription: string;
  fullOverview: string;
  clientName: string;
  completionDate: string;
  coverImageUrl: string;
  galleryImages: string[];
  websiteScreenshots: string[];
  mediaLinks: string[];
  challenge: string;
  creativeApproach: string;
  designProcess: string;
  finalSolution: string;
  tools: string[];
  liveWebsiteUrl: string;
  externalProjectUrl: string;
  status: 'draft' | 'published';
  isFeatured: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAttachment {
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
export type ProjectProgressStatus =
  | 'Awaiting Start'
  | 'In Progress'
  | 'Awaiting Client Feedback'
  | 'Completed';

export interface ClientApplication {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  companyName: string;
  websiteOrSocial: string;
  serviceInterested: string;
  businessAbout: string;
  projectDescription: string;
  problemToSolve: string;
  expectations: string;
  budgetRange: string;
  timeline: string;
  additionalDetails: string;
  attachments: ApplicationAttachment[];
  status: ApplicationStatus;
  internalNotes: string;
  rejectionReason: string;
  projectProgress: ProjectProgressStatus | string;
  decisionDate: string;
  emailNotifiedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  clientName: string;
  roleAndCompany: string;
  projectCategory: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  quote: string;
}

export interface ContactChannels {
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
}

export interface StudioSettings {
  budgetRanges: string[];
  contact: ContactChannels;
  founder: FounderProfile;
  testimonials: TestimonialItem[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AdminOverviewStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedClients: number;
  rejectedApplications: number;
}

export interface ActivityLogItem {
  id: number;
  eventType: string;
  entityType: string;
  entityId: string;
  summary: string;
  actor: string;
  createdAt: string;
}

export interface EmailConfigStatus {
  configured: boolean;
  provider: 'resend' | 'webhook' | 'none';
  details: string;
}

export type KnowledgeCategory =
  | 'About the Agency'
  | 'Services'
  | 'Portfolio'
  | 'Pricing and Packages'
  | 'Frequently Asked Questions'
  | 'Contact Information'
  | 'Policies and Processes';

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory | string;
  title: string;
  content: string;
  tags: string;
  sourceFilename: string;
  status: 'draft' | 'published';
  isSystemSeed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AiActionType =
  | 'start_project'
  | 'explore_services'
  | 'view_portfolio'
  | 'contact_agency'
  | 'whatsapp_agency';

export interface AiProjectCard {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  coverImageUrl: string;
  liveWebsiteUrl: string;
}

export interface AiResponseMeta {
  projects: AiProjectCard[];
  actions: AiActionType[];
  suggestedService?: string;
  whatsappHref?: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  meta?: AiResponseMeta;
  isError?: boolean;
}
