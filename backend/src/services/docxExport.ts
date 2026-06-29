import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, ShadingType, Table, TableRow, TableCell, WidthType,
  convertInchesToTwip, UnderlineType
} from 'docx';
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

export async function exportToDocx(cvData: CVData): Promise<Buffer> {
  const children: any[] = [];

  // Header
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

  // Contact
  const contactParts = [];
  if (cvData.contact.email) contactParts.push(cvData.contact.email);
  if (cvData.contact.phone) contactParts.push(cvData.contact.phone);
  if (cvData.contact.linkedin) contactParts.push(cvData.contact.linkedin);
  if (cvData.contact.location) contactParts.push(cvData.contact.location);

  if (contactParts.length) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join('  |  '), size: 18, color: '6B6B6B', font: 'Calibri' })],
      spacing: { after: 200 },
    }));
  }

  // Summary
  if (cvData.summary) {
    children.push(sectionHeading('Professional Summary'));
    children.push(new Paragraph({
      children: [new TextRun({ text: cvData.summary, size: 20, font: 'Calibri', color: '2C2C2C' })],
      spacing: { after: 200 },
    }));
  }

  // Project Experience
  if (cvData.projectExperience.length > 0) {
    children.push(sectionHeading('Project Experience'));
    for (const proj of cvData.projectExperience) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: proj.role, bold: true, size: 22, font: 'Calibri', color: '2C2C2C' }),
          new TextRun({ text: `  |  ${proj.fromMonth} – ${proj.toMonth}`, size: 20, color: '6B6B6B', font: 'Calibri' }),
        ],
        spacing: { before: 160, after: 40 },
      }));
      if (proj.projectDescription) {
        children.push(new Paragraph({
          children: [new TextRun({ text: proj.projectDescription, size: 20, font: 'Calibri', italics: true, color: '4A4A4A' })],
          spacing: { after: 60 },
        }));
      }
      for (const task of proj.tasksAndResponsibilities) {
        children.push(bulletItem(task));
      }
      if (proj.technologiesAndTools.length > 0) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'Technologies: ', bold: true, size: 18, font: 'Calibri', color: '7A5C44' }),
            new TextRun({ text: proj.technologiesAndTools.join(' · '), size: 18, font: 'Calibri', color: '6B6B6B' }),
          ],
          spacing: { before: 60, after: 80 },
        }));
      }
    }
  }

  // Positions Held
  if (cvData.positionsHeld.length > 0) {
    children.push(sectionHeading('Positions Held'));
    for (const pos of cvData.positionsHeld) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: pos.role, bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: `  ·  ${pos.company}`, size: 20, font: 'Calibri', color: '6B6B6B' }),
          new TextRun({ text: `  |  ${pos.fromMonth} – ${pos.toMonth}`, size: 20, font: 'Calibri', color: '9B9B9B' }),
        ],
        spacing: { before: 100, after: 40 },
      }));
    }
  }

  // Certifications
  if (cvData.certifications.length > 0) {
    children.push(sectionHeading('Certifications & Courses'));
    for (const cert of cvData.certifications) {
      const parts = [cert.name];
      if (cert.issuer) parts.push(cert.issuer);
      if (cert.date) parts.push(cert.date);
      children.push(bulletItem(parts.join(' · ')));
    }
  }

  // Education
  if (cvData.education.length > 0) {
    children.push(sectionHeading('Education'));
    for (const edu of cvData.education) {
      const parts = [edu.degree];
      if (edu.institution) parts.push(edu.institution);
      if (edu.year) parts.push(edu.year);
      children.push(bulletItem(parts.join(' · ')));
    }
  }

  // Languages
  if (cvData.languages.length > 0) {
    children.push(sectionHeading('Languages'));
    for (const lang of cvData.languages) {
      children.push(bulletItem(`${lang.language}: ${lang.proficiency}`));
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: convertInchesToTwip(0.75), right: convertInchesToTwip(0.85), bottom: convertInchesToTwip(0.75), left: convertInchesToTwip(0.85) },
        },
      },
      children,
    }],
  });

  return Packer.toBuffer(doc);
}
