export type ThemeMode = 'light' | 'dark';

export interface TechCategory {
  title: string;
  skills: string[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  role: string;
  meta: string;
  year: string;
  technologies: string[];
  methodologies: string[];
  format: string;
  challenge: string;
  summary: string;
  liveUrl?: string;
  sourceUrl?: string;
  visualType: 'dataviz' | 'design-system' | 'audio-engine' | 'image';
  imageSrc?: string;
  metrics?: { label: string; value: string }[];
}

export type ProjectFilterCategory = 'all' | 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai';

export interface CatalogProject {
  id: string;
  code: string;
  title: string;
  role?: string;
  category: ProjectFilterCategory;
  categoryLabel: string;
  stack: string[];
  methodologies?: string[];
  challenge: string;
  impact: string;
  badge?: string;
  year?: string;
  studyCaseId?: string;
  githubUrl?: string;
  imageSrc?: string;
}

export interface StudyCaseCallout {
  type: 'note' | 'tip' | 'important' | 'warning';
  title?: string;
  content: string;
}

export interface StudyCaseCodeSnippet {
  filename: string;
  language: string;
  code: string;
}

export interface StudyCase {
  id: string;
  title: string;
  vaultPath: string;
  frontmatter: {
    type: string;
    role: string;
    status: string;
    created: string;
    tags: string[];
    technologies: string[];
    methodologies: string[];
    stack: string[];
    complexity: string;
    impact: string;
  };
  contextAndProblem: string;
  architectureDecision: {
    adrSummary: string;
    diagramAscii?: string;
    keyPoints: string[];
  };
  technicalSolution: {
    overview: string;
    snippets: StudyCaseCodeSnippet[];
  };
  challengesAndFixes: {
    challenge: string;
    solution: string;
  }[];
  resultsAndSecondBrainLinks: {
    metrics: { label: string; value: string }[];
    backlinks: string[];
    conclusion: string;
  };
  callouts?: StudyCaseCallout[];
}

export interface LabExperiment {
  id: string;
  number: string;
  title: string;
  description: string;
  approach?: string;
  category: string;
  tagCategory?: 'all' | 'ui-ux' | '3d-webgl' | 'ai-llm' | 'audio-dsp' | 'cli-systems';
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
  shortName?: string;
  tagline: string;
  discipline: string;
  status: string;
  isAvailable: boolean;
  email: string;
  phone?: string;
  whatsapp?: string;
  github: string;
  linkedin: string;
  dossierUrl: string;
  location: string;
  timezone: string;
}

