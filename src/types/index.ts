export type ThemeMode = 'light' | 'dark';

export interface TechCategory {
  title: string;
  skills: string[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  meta: string;
  year: string;
  technologies: string[];
  format: string;
  challenge: string;
  summary: string;
  liveUrl: string;
  sourceUrl?: string;
  visualType: 'dataviz' | 'design-system' | 'audio-engine';
  metrics?: { label: string; value: string }[];
}

export type ProjectFilterCategory = 'all' | 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai';

export interface CatalogProject {
  id: string;
  code: string;
  title: string;
  category: ProjectFilterCategory;
  categoryLabel: string;
  stack: string[];
  challenge: string;
  impact: string;
  badge?: string;
  year?: string;
}

export interface LabExperiment {
  id: string;
  number: string;
  title: string;
  description: string;
  approach?: string;
  category: string;
  url?: string;
  status?: string;
  tech?: string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  impact: string;
  tag: string;
  stack: string[];
}

export interface MilestoneItem {
  year: string;
  title: string;
  issuer: string;
  description: string;
  badge: string;
}

export interface TechnicalPillar {
  title: string;
  detail: string;
}

export interface AuthorProfile {
  name: string;
  tagline: string;
  discipline: string;
  status: string;
  isAvailable: boolean;
  email: string;
  github: string;
  linkedin: string;
  dossierUrl: string;
  location: string;
  timezone: string;
}
