import {
  Document, Packer, Paragraph, TextRun, BorderStyle, convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from '../types/cv';

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: '7A5C44', font: 'Calibri' })],
    spacing: { before: 300, after: 80 },
    border: { bottom: { color: 'C4956A', style: BorderStyle.SINGLE, size: 6, space: 4 } },
  });
}

function bulletItem(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: 'Calibri' })],
    bullet: { level: 0 },
    spacing: { before: 40 },
  });
}

export async function exportToDocx(cvData: CVData): Promise<void> {
  const children: any[] = [];

  children.push(new Paragraph({
    children: [new TextRun({ text: cvData.fullName, bold: true, size: 44, font: 'Palatino Linotype', color: '2C2C2C' })],
    spacing: { after: 60 },
  }));
  if (cvData.professionalTitle) {
    children.push(new Paragraph({
      children: [new TextRun({ text: cvData.professionalTitle, size: 24, color: 'C4956A', font: 'Calibri' })],
      spacing: { after: 80 },
    }));
  }
  const contactParts = [cvData.contact.email, cvData.contact.phone, cvData.contact.linkedin, cvData.contact.location].filter(Boolean) as string[];
  if (contactParts.length) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join('  |  '), size: 18, color: '6B6B6B', font: 'Calibri' })],
      spacing: { after: 200 },
    }));
  }

  if (cvData.summary) {
    children.push(sectionHeading('Professional Summary'));
    children.push(new Paragraph({ children: [new TextRun({ text: cvData.summary, size: 20, font: 'Calibri' })], spacing: { after: 200 } }));
  }

  if (cvData.projectExperience.length) {
    children.push(sectionHeading('Project Experience'));
    for (const p of cvData.projectExperience) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: p.role, bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: `  |  ${p.fromMonth} – ${p.toMonth}`, size: 20, color: '6B6B6B', font: 'Calibri' }),
        ],
        spacing: { before: 160, after: 40 },
      }));
      if (p.projectDescription) {
        children.push(new Paragraph({ children: [new TextRun({ text: p.projectDescription, size: 20, italics: true, font: 'Calibri', color: '4A4A4A' })], spacing: { after: 60 } }));
      }
      for (const t of p.tasksAndResponsibilities) children.push(bulletItem(t));
      if (p.technologiesAndTools.length) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'Technologies: ', bold: true, size: 18, font: 'Calibri', color: '7A5C44' }),
            new TextRun({ text: p.technologiesAndTools.join(' · '), size: 18, font: 'Calibri', color: '6B6B6B' }),
          ],
          spacing: { before: 60, after: 80 },
        }));
      }
    }
  }

  if (cvData.positionsHeld.length) {
    children.push(sectionHeading('Positions Held'));
    for (const p of cvData.positionsHeld) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: p.role, bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: `  ·  ${p.company}`, size: 20, color: '6B6B6B', font: 'Calibri' }),
          new TextRun({ text: `  |  ${p.fromMonth} – ${p.toMonth}`, size: 20, color: '9B9B9B', font: 'Calibri' }),
        ],
        spacing: { before: 100, after: 40 },
      }));
    }
  }

  if (cvData.certifications.length) {
    children.push(sectionHeading('Certifications & Courses'));
    for (const c of cvData.certifications) {
      children.push(bulletItem([c.name, c.issuer, c.date].filter(Boolean).join(' · ')));
    }
  }

  if (cvData.education.length) {
    children.push(sectionHeading('Education'));
    for (const e of cvData.education) {
      children.push(bulletItem([e.degree, e.institution, e.year].filter(Boolean).join(' · ')));
    }
  }

  if (cvData.languages.length) {
    children.push(sectionHeading('Languages'));
    for (const l of cvData.languages) children.push(bulletItem(`${l.language}: ${l.proficiency}`));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: convertInchesToTwip(0.75), right: convertInchesToTwip(0.85), bottom: convertInchesToTwip(0.75), left: convertInchesToTwip(0.85) } },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${cvData.fullName || 'CV'}.docx`.replace(/[^a-zA-Z0-9. _-]/g, '_');
  saveAs(blob, filename);
}
