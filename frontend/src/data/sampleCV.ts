import { CVData } from '../types/cv';

export const sampleCV: CVData = {
  fullName: 'Anna Bergström',
  professionalTitle: 'Senior Business Analyst & Digital Transformation Consultant',
  contact: {
    email: 'anna.bergstrom@email.com',
    phone: '+47 91 234 567',
    linkedin: 'linkedin.com/in/annabergstrom',
    location: 'Oslo, Norway',
  },
  summary:
    'Results-driven Senior Business Analyst with 9+ years of experience leading digital transformation initiatives across financial services, insurance, and public sector. Skilled at bridging the gap between business needs and technical delivery, with a proven track record of managing cross-functional teams and delivering complex projects on time and within budget. Fluent stakeholder communicator with deep expertise in agile methodologies and process optimisation.',
  projectExperience: [
    {
      id: '1',
      role: 'Lead Business Analyst — Digital Banking Transformation',
      fromMonth: 'Mar 2022',
      toMonth: 'Present',
      projectDescription:
        'Full-scale digital transformation of retail banking operations for a Nordic tier-1 bank, migrating 1.2M customers from legacy core banking to a modern cloud-native platform.',
      tasksAndResponsibilities: [
        'Led requirements gathering and gap analysis across 12 business domains',
        'Facilitated 80+ workshops with business and IT stakeholders',
        'Authored 200+ user stories and maintained the product backlog',
        'Coordinated UAT phases and managed defect resolution with 15+ vendors',
        'Delivered executive-level progress reporting to C-suite stakeholders',
      ],
      technologiesAndTools: ['Jira', 'Confluence', 'Miro', 'SAFe Agile', 'SQL', 'Figma', 'ServiceNow'],
    },
    {
      id: '2',
      role: 'Business Analyst — Insurance Claims Automation',
      fromMonth: 'Sep 2020',
      toMonth: 'Feb 2022',
      projectDescription:
        'Automation of end-to-end insurance claims processing, reducing manual handling from 72h to under 4h per claim through intelligent workflow and RPA implementation.',
      tasksAndResponsibilities: [
        'Mapped and documented 35 claims handling processes (as-is / to-be)',
        'Defined functional specifications for RPA bot implementation',
        'Collaborated with UiPath developers and QA on bot testing cycles',
        'Trained and supported business users through go-live transition',
      ],
      technologiesAndTools: ['UiPath', 'Visio', 'BPMN', 'Excel', 'Power BI', 'Scrum'],
    },
    {
      id: '3',
      role: 'Business Analyst — Public Sector Data Platform',
      fromMonth: 'Jan 2019',
      toMonth: 'Aug 2020',
      projectDescription:
        'Development of a national data-sharing platform enabling secure exchange of citizen data across 14 government ministries, in compliance with GDPR and eIDAS regulations.',
      tasksAndResponsibilities: [
        'Conducted stakeholder analysis and created requirements traceability matrix',
        'Defined API integration contracts with 6 external agency systems',
        'Ensured regulatory compliance throughout design and delivery phases',
        'Produced data flow diagrams and privacy impact assessments',
      ],
      technologiesAndTools: ['REST APIs', 'GDPR', 'eIDAS', 'Enterprise Architect', 'Azure DevOps', 'Kanban'],
    },
  ],
  positionsHeld: [
    {
      id: '1',
      role: 'Senior Business Analyst',
      company: 'Capgemini Norway',
      fromMonth: 'Sep 2020',
      toMonth: 'Present',
    },
    {
      id: '2',
      role: 'Business Analyst',
      company: 'Accenture Nordic',
      fromMonth: 'Mar 2017',
      toMonth: 'Aug 2020',
    },
    {
      id: '3',
      role: 'Junior Analyst',
      company: 'SpareBank 1',
      fromMonth: 'Jun 2015',
      toMonth: 'Feb 2017',
    },
  ],
  certifications: [
    { id: '1', name: 'Certified Business Analysis Professional (CBAP)', issuer: 'IIBA', date: '2021' },
    { id: '2', name: 'SAFe 5 Agilist', issuer: 'Scaled Agile', date: '2022' },
    { id: '3', name: 'ITIL 4 Foundation', issuer: 'PeopleCert', date: '2020' },
    { id: '4', name: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft', date: '2023' },
  ],
  education: [
    { id: '1', degree: 'MSc Information Systems', institution: 'BI Norwegian Business School', year: '2015' },
    { id: '2', degree: 'BSc Business Administration', institution: 'University of Oslo', year: '2013' },
  ],
  languages: [
    { id: '1', language: 'Norwegian', proficiency: 'Native' },
    { id: '2', language: 'English', proficiency: 'Fluent' },
    { id: '3', language: 'Swedish', proficiency: 'Professional' },
    { id: '4', language: 'German', proficiency: 'Intermediate' },
  ],
};
