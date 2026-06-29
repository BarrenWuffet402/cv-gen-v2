import { CVData } from '../types/cv';

export function generateCVHtml(cvData: CVData): string {
  const contact = cvData.contact;

  const contactItems = [
    contact.email && `<span>✉ ${contact.email}</span>`,
    contact.phone && `<span>☏ ${contact.phone}</span>`,
    contact.linkedin && `<span>in ${contact.linkedin}</span>`,
    contact.location && `<span>⌖ ${contact.location}</span>`,
  ].filter(Boolean).join('<span class="sep">|</span>');

  const projectsHtml = cvData.projectExperience.map(p => `
    <div class="project-block">
      <div class="project-header">
        <span class="project-role">${esc(p.role)}</span>
        <span class="project-dates">${esc(p.fromMonth)} – ${esc(p.toMonth)}</span>
      </div>
      ${p.projectDescription ? `<p class="project-desc">${esc(p.projectDescription)}</p>` : ''}
      ${p.tasksAndResponsibilities.length ? `<ul class="task-list">${p.tasksAndResponsibilities.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${p.technologiesAndTools.length ? `<div class="tech-tags">${p.technologiesAndTools.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');

  const positionsHtml = cvData.positionsHeld.map(p => `
    <div class="position-row">
      <div>
        <span class="pos-role">${esc(p.role)}</span>
        <span class="pos-company">${esc(p.company)}</span>
      </div>
      <span class="pos-dates">${esc(p.fromMonth)} – ${esc(p.toMonth)}</span>
    </div>
  `).join('');

  const certsHtml = cvData.certifications.map(c => `
    <div class="sidebar-item">
      <div class="sidebar-item-name">${esc(c.name)}</div>
      ${c.issuer ? `<div class="sidebar-item-sub">${esc(c.issuer)}${c.date ? ` · ${esc(c.date)}` : ''}</div>` : ''}
    </div>
  `).join('');

  const eduHtml = cvData.education.map(e => `
    <div class="sidebar-item">
      <div class="sidebar-item-name">${esc(e.degree)}</div>
      <div class="sidebar-item-sub">${esc(e.institution)}${e.year ? ` · ${esc(e.year)}` : ''}</div>
    </div>
  `).join('');

  const langsHtml = cvData.languages.map(l => `
    <div class="lang-row">
      <span class="lang-name">${esc(l.language)}</span>
      <span class="lang-level">${esc(l.proficiency)}</span>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(cvData.fullName)} — CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: #FAFAF8;
    color: #2C2C2C;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-page {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background: #FAFAF8;
    box-shadow: 0 4px 32px rgba(0,0,0,0.10);
  }

  /* ── Header band ── */
  .cv-header {
    background: #C4956A;
    padding: 36px 40px 28px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cv-name {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  .cv-title {
    font-size: 15px;
    font-weight: 400;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .cv-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 0;
    margin-top: 10px;
    font-size: 12.5px;
    color: rgba(255,255,255,0.80);
  }

  .cv-contact .sep { margin: 0 10px; opacity: 0.5; }

  /* ── Body (sidebar + main) ── */
  .cv-body {
    display: flex;
    flex: 1;
  }

  .cv-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: #EDE5DA;
    padding: 28px 22px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .cv-main {
    flex: 1;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ── Section titles ── */
  .section-title {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #7A5C44;
    padding-bottom: 6px;
    border-bottom: 1.5px solid #C4956A;
    margin-bottom: 12px;
  }

  /* ── Summary ── */
  .summary-text {
    font-size: 13.5px;
    line-height: 1.65;
    color: #3A3A3A;
  }

  /* ── Projects ── */
  .project-block {
    padding-bottom: 16px;
    border-bottom: 1px solid #E8E0D8;
    margin-bottom: 4px;
  }
  .project-block:last-child { border-bottom: none; }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 5px;
  }

  .project-role {
    font-size: 14px;
    font-weight: 600;
    color: #2C2C2C;
    font-family: 'Playfair Display', serif;
  }

  .project-dates {
    font-size: 11.5px;
    color: #9B7B5E;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .project-desc {
    font-size: 13px;
    color: #5A5A5A;
    font-style: italic;
    margin-bottom: 8px;
    line-height: 1.55;
  }

  .task-list {
    padding-left: 16px;
    margin-bottom: 8px;
  }
  .task-list li {
    font-size: 12.5px;
    line-height: 1.55;
    color: #3A3A3A;
    margin-bottom: 3px;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 6px;
  }
  .tag {
    background: #F0EAE2;
    color: #7A5C44;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 9px;
    border-radius: 20px;
    border: 1px solid #DCCFBF;
  }

  /* ── Positions ── */
  .position-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px solid #E8E0D8;
    gap: 8px;
  }
  .position-row:last-child { border-bottom: none; }

  .pos-role {
    font-size: 13.5px;
    font-weight: 600;
    color: #2C2C2C;
  }
  .pos-company {
    font-size: 12.5px;
    color: #6B6B6B;
    margin-left: 6px;
  }
  .pos-dates {
    font-size: 11.5px;
    color: #9B7B5E;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Sidebar items ── */
  .sidebar-item {
    margin-bottom: 10px;
  }
  .sidebar-item-name {
    font-size: 12.5px;
    font-weight: 500;
    color: #2C2C2C;
    line-height: 1.4;
  }
  .sidebar-item-sub {
    font-size: 11px;
    color: #7A6A5A;
    margin-top: 1px;
  }

  /* ── Languages ── */
  .lang-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #DDD4CA;
  }
  .lang-row:last-child { border-bottom: none; }
  .lang-name { font-size: 12.5px; font-weight: 500; color: #2C2C2C; }
  .lang-level { font-size: 11px; color: #9B7B5E; }

  @media print {
    body { background: white; }
    .cv-page { box-shadow: none; }
  }
</style>
</head>
<body>
<div class="cv-page">
  <div class="cv-header">
    <div class="cv-name">${esc(cvData.fullName)}</div>
    ${cvData.professionalTitle ? `<div class="cv-title">${esc(cvData.professionalTitle)}</div>` : ''}
    ${contactItems ? `<div class="cv-contact">${contactItems}</div>` : ''}
  </div>

  <div class="cv-body">
    <!-- Sidebar -->
    <div class="cv-sidebar">
      ${cvData.languages.length ? `
      <div>
        <div class="section-title">Languages</div>
        ${langsHtml}
      </div>` : ''}

      ${cvData.education.length ? `
      <div>
        <div class="section-title">Education</div>
        ${eduHtml}
      </div>` : ''}

      ${cvData.certifications.length ? `
      <div>
        <div class="section-title">Certifications & Courses</div>
        ${certsHtml}
      </div>` : ''}
    </div>

    <!-- Main content -->
    <div class="cv-main">
      ${cvData.summary ? `
      <div>
        <div class="section-title">Professional Summary</div>
        <p class="summary-text">${esc(cvData.summary)}</p>
      </div>` : ''}

      ${cvData.projectExperience.length ? `
      <div>
        <div class="section-title">Project Experience</div>
        ${projectsHtml}
      </div>` : ''}

      ${cvData.positionsHeld.length ? `
      <div>
        <div class="section-title">Positions Held</div>
        ${positionsHtml}
      </div>` : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}

function esc(str: string = ''): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
