import { CVData, CVProjectExperience, CVPosition, CVCertification, CVEducation, CVLanguage } from '../types/cv';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function extractEmail(text: string): string {
  const match = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  return match ? match[0] : '';
}

function extractPhone(text: string): string {
  const match = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  return match ? match[0].trim() : '';
}

function extractLinkedIn(text: string): string {
  const match = text.match(/linkedin\.com\/in\/[\w-]+/i);
  return match ? match[0] : '';
}

function extractName(lines: string[]): string {
  // Usually the first non-empty line that looks like a name (2-4 words, no special chars)
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 3 && trimmed.length < 60 && /^[A-ZÆØÅ][a-zA-ZÆØÅæøå\s-]+$/.test(trimmed)) {
      return trimmed;
    }
  }
  return lines[0]?.trim() || '';
}

function splitIntoSections(text: string): Record<string, string> {
  const sectionKeywords: Record<string, RegExp> = {
    summary: /^(summary|profile|professional summary|about|about me|overview)/i,
    projectExperience: /^(project experience|projects|project history|assignments|engagements)/i,
    positionsHeld: /^(positions held|work experience|experience|employment|work history|career history)/i,
    certifications: /^(certifications?|courses?|certificates?|training|professional development)/i,
    education: /^(education|academic|qualifications?)/i,
    languages: /^(languages?|language skills)/i,
  };

  const lines = text.split('\n');
  const sections: Record<string, string[]> = {};
  let currentSection = 'header';
  sections['header'] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    let matched = false;
    for (const [key, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(trimmed)) {
        currentSection = key;
        sections[currentSection] = sections[currentSection] || [];
        matched = true;
        break;
      }
    }
    if (!matched) {
      sections[currentSection] = sections[currentSection] || [];
      sections[currentSection].push(line);
    }
  }

  const result: Record<string, string> = {};
  for (const [key, lines] of Object.entries(sections)) {
    result[key] = lines.join('\n').trim();
  }
  return result;
}

function parseProjectExperience(text: string): CVProjectExperience[] {
  if (!text) return [];
  const projects: CVProjectExperience[] = [];
  
  // Split on date patterns or role-like headers
  const blocks = text.split(/\n(?=[A-Z][^\n]{5,60}\n|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/);
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) continue;

    const datePattern = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|Present|Current|Now)/gi;
    
    let role = '';
    let fromMonth = '';
    let toMonth = '';
    let projectDescription = '';
    const tasks: string[] = [];
    const techs: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const dateMatch = datePattern.exec(line);
      datePattern.lastIndex = 0;

      if (dateMatch) {
        fromMonth = dateMatch[1];
        toMonth = dateMatch[2];
        if (!role) role = line.replace(dateMatch[0], '').trim();
      } else if (!role && i === 0) {
        role = line;
      } else if (!projectDescription && line.length > 30 && !line.startsWith('-') && !line.startsWith('•')) {
        projectDescription = line;
      } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        const task = line.replace(/^[-•*]\s*/, '').trim();
        // Heuristic: tech items are shorter, tasks are longer
        if (task.length < 40 && !task.includes(' because ') && !task.includes(' to ')) {
          techs.push(task);
        } else {
          tasks.push(task);
        }
      } else if (i > 0 && line.length > 0) {
        if (!projectDescription) projectDescription = line;
        else tasks.push(line);
      }
    }

    if (role || projectDescription) {
      projects.push({
        id: generateId(),
        role: role || 'Project Role',
        fromMonth: fromMonth || '',
        toMonth: toMonth || 'Present',
        projectDescription,
        tasksAndResponsibilities: tasks,
        technologiesAndTools: techs,
      });
    }
  }

  return projects;
}

function parsePositions(text: string): CVPosition[] {
  if (!text) return [];
  const positions: CVPosition[] = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  const datePattern = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)/gi;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    datePattern.lastIndex = 0;
    const dateMatch = datePattern.exec(line);
    
    if (dateMatch || (lines[i + 1] && datePattern.test(lines[i + 1]))) {
      datePattern.lastIndex = 0;
      const nextLine = lines[i + 1] || '';
      const nextDateMatch = datePattern.exec(nextLine);
      datePattern.lastIndex = 0;
      
      const actualDateMatch = dateMatch || nextDateMatch;
      const sourceLine = dateMatch ? line : nextLine;
      const roleLine = dateMatch ? line : lines[i];
      
      // Try to split "Role | Company" or "Role at Company" or "Role, Company"
      const roleCompanySplit = roleLine.match(/^(.+?)\s*(?:\||at|@|,)\s*(.+?)(?:\s*[-–—]|$)/i);
      
      positions.push({
        id: generateId(),
        role: roleCompanySplit ? roleCompanySplit[1].trim() : roleLine.replace(actualDateMatch?.[0] || '', '').trim(),
        company: roleCompanySplit ? roleCompanySplit[2].trim() : '',
        fromMonth: actualDateMatch ? actualDateMatch[1] : '',
        toMonth: actualDateMatch ? actualDateMatch[2] : 'Present',
      });
      if (nextDateMatch) i++; // skip next line since we consumed it
    }
  }

  return positions;
}

function parseCertifications(text: string): CVCertification[] {
  if (!text) return [];
  const certs: CVCertification[] = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    const trimmed = line.replace(/^[-•*]\s*/, '').trim();
    if (!trimmed || trimmed.length < 3) continue;
    
    // "Cert Name — Issuer — 2023" or "Cert Name (Issuer, 2023)"
    const parts = trimmed.split(/\s*[-–—|,]\s*/);
    const dateMatch = trimmed.match(/\b(20\d{2}|19\d{2})\b/);
    
    certs.push({
      id: generateId(),
      name: parts[0].trim(),
      issuer: parts[1]?.replace(/\d{4}/, '').trim() || '',
      date: dateMatch ? dateMatch[0] : '',
    });
  }
  return certs;
}

function parseEducation(text: string): CVEducation[] {
  if (!text) return [];
  const edu: CVEducation[] = [];
  const lines = text.split('\n').filter(l => l.trim());

  for (const line of lines) {
    const trimmed = line.replace(/^[-•*]\s*/, '').trim();
    if (!trimmed || trimmed.length < 3) continue;
    
    const parts = trimmed.split(/\s*[-–—|,]\s*/);
    const yearMatch = trimmed.match(/\b(20\d{2}|19\d{2})\b/);
    
    edu.push({
      id: generateId(),
      degree: parts[0].trim(),
      institution: parts[1]?.replace(/\d{4}/, '').trim() || '',
      year: yearMatch ? yearMatch[0] : '',
    });
  }
  return edu;
}

function parseLanguages(text: string): CVLanguage[] {
  if (!text) return [];
  const langs: CVLanguage[] = [];
  const lines = text.split('\n').filter(l => l.trim());
  const proficiencies = ['native', 'fluent', 'professional', 'advanced', 'intermediate', 'basic', 'beginner', 'c2', 'c1', 'b2', 'b1', 'a2', 'a1'];

  for (const line of lines) {
    const trimmed = line.replace(/^[-•*]\s*/, '').trim();
    if (!trimmed || trimmed.length < 2) continue;
    
    const parts = trimmed.split(/\s*[-–—:|,]\s*/);
    let proficiency = '';
    
    for (const p of proficiencies) {
      if (trimmed.toLowerCase().includes(p)) {
        proficiency = p.charAt(0).toUpperCase() + p.slice(1);
        break;
      }
    }
    
    langs.push({
      id: generateId(),
      language: parts[0].trim(),
      proficiency: proficiency || (parts[1]?.trim() || 'Proficient'),
    });
  }
  return langs;
}

export function parseTextToCV(text: string): CVData {
  const sections = splitIntoSections(text);
  const headerText = sections['header'] || '';
  const headerLines = headerText.split('\n').filter(l => l.trim());

  const fullName = extractName(headerLines);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const linkedin = extractLinkedIn(text);

  // Guess professional title (second non-empty line after name)
  let professionalTitle = '';
  for (let i = 1; i < Math.min(headerLines.length, 5); i++) {
    const l = headerLines[i].trim();
    if (l && l !== email && l !== phone && !l.includes('@') && l.length > 3 && l.length < 80) {
      professionalTitle = l;
      break;
    }
  }

  return {
    fullName,
    professionalTitle,
    contact: { email, phone, linkedin },
    summary: sections['summary'] || '',
    projectExperience: parseProjectExperience(sections['projectExperience'] || ''),
    positionsHeld: parsePositions(sections['positionsHeld'] || ''),
    certifications: parseCertifications(sections['certifications'] || ''),
    education: parseEducation(sections['education'] || ''),
    languages: parseLanguages(sections['languages'] || ''),
  };
}
