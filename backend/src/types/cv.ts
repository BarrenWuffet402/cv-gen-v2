export interface CVContact {
  email?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
  website?: string;
}

export interface CVProjectExperience {
  id: string;
  role: string;
  fromMonth: string; // e.g. "Jan 2022"
  toMonth: string;   // e.g. "Mar 2024" or "Present"
  projectDescription: string;
  tasksAndResponsibilities: string[];
  technologiesAndTools: string[];
}

export interface CVPosition {
  id: string;
  role: string;
  company: string;
  fromMonth: string;
  toMonth: string;
}

export interface CVCertification {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
}

export interface CVEducation {
  id: string;
  degree: string;
  institution: string;
  year?: string;
}

export interface CVLanguage {
  id: string;
  language: string;
  proficiency: string; // e.g. "Native", "Fluent", "Professional", "Intermediate"
}

export interface CVData {
  fullName: string;
  professionalTitle: string;
  contact: CVContact;
  summary: string;
  projectExperience: CVProjectExperience[];
  positionsHeld: CVPosition[];
  certifications: CVCertification[];
  education: CVEducation[];
  languages: CVLanguage[];
}
