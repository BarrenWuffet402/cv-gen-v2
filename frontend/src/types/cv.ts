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
  fromMonth: string;
  toMonth: string;
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
  proficiency: string;
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
