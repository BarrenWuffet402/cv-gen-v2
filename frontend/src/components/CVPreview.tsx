import React from 'react';
import { CVData } from '../types/cv';

interface Props {
  cv: CVData;
  scale?: number;
}

const CVPreview: React.FC<Props> = ({ cv, scale = 1 }) => {
  const c = cv.contact;

  const contactItems = [
    c.email && <span key="email">✉ {c.email}</span>,
    c.phone && <span key="phone">☏ {c.phone}</span>,
    c.linkedin && <span key="li">in {c.linkedin}</span>,
    c.location && <span key="loc">⌖ {c.location}</span>,
  ].filter(Boolean);

  return (
    <div
      style={{
        width: 794,
        minHeight: 1123,
        fontFamily: "'Inter', sans-serif",
        background: '#FAFAF8',
        color: '#2C2C2C',
        display: 'flex',
        flexDirection: 'column',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
      }}
    >
      {/* Header */}
      <div style={{ background: '#C4956A', padding: '36px 40px 28px', flexShrink: 0 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
          {cv.fullName || 'Your Name'}
        </div>
        {cv.professionalTitle && (
          <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.8px', textTransform: 'uppercase', marginTop: 6 }}>
            {cv.professionalTitle}
          </div>
        )}
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 4px', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.80)' }}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ opacity: 0.5, margin: '0 8px' }}>|</span>}
                {item}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0, background: '#EDE5DA', padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {cv.languages.length > 0 && (
            <section>
              <SectionTitle>Languages</SectionTitle>
              {cv.languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #DDD4CA' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{l.language}</span>
                  <span style={{ fontSize: 11, color: '#9B7B5E' }}>{l.proficiency}</span>
                </div>
              ))}
            </section>
          )}

          {cv.education.length > 0 && (
            <section>
              <SectionTitle>Education</SectionTitle>
              {cv.education.map(e => (
                <div key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{e.degree}</div>
                  <div style={{ fontSize: 11, color: '#7A6A5A' }}>{e.institution}{e.year ? ` · ${e.year}` : ''}</div>
                </div>
              ))}
            </section>
          )}

          {cv.certifications.length > 0 && (
            <section>
              <SectionTitle>Certifications & Courses</SectionTitle>
              {cv.certifications.map(c => (
                <div key={c.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{c.name}</div>
                  {(c.issuer || c.date) && (
                    <div style={{ fontSize: 11, color: '#7A6A5A' }}>{[c.issuer, c.date].filter(Boolean).join(' · ')}</div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {cv.summary && (
            <section>
              <SectionTitle main>Professional Summary</SectionTitle>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: '#3A3A3A' }}>{cv.summary}</p>
            </section>
          )}

          {cv.projectExperience.length > 0 && (
            <section>
              <SectionTitle main>Project Experience</SectionTitle>
              {cv.projectExperience.map((p, i) => (
                <div key={p.id} style={{ paddingBottom: 16, borderBottom: i < cv.projectExperience.length - 1 ? '1px solid #E8E0D8' : 'none', marginBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600 }}>{p.role}</span>
                    <span style={{ fontSize: 11.5, color: '#9B7B5E', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 12 }}>
                      {p.fromMonth} – {p.toMonth}
                    </span>
                  </div>
                  {p.projectDescription && (
                    <p style={{ fontSize: 13, color: '#5A5A5A', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.55 }}>{p.projectDescription}</p>
                  )}
                  {p.tasksAndResponsibilities.length > 0 && (
                    <ul style={{ paddingLeft: 16, marginBottom: 8 }}>
                      {p.tasksAndResponsibilities.map((t, ti) => (
                        <li key={ti} style={{ fontSize: 12.5, lineHeight: 1.55, color: '#3A3A3A', marginBottom: 3 }}>{t}</li>
                      ))}
                    </ul>
                  )}
                  {p.technologiesAndTools.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                      {p.technologiesAndTools.map((t, ti) => (
                        <span key={ti} style={{ background: '#F0EAE2', color: '#7A5C44', fontSize: 11, fontWeight: 500, padding: '2px 9px', borderRadius: 20, border: '1px solid #DCCFBF' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {cv.positionsHeld.length > 0 && (
            <section>
              <SectionTitle main>Positions Held</SectionTitle>
              {cv.positionsHeld.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: i < cv.positionsHeld.length - 1 ? '1px solid #E8E0D8' : 'none' }}>
                  <div>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.role}</span>
                    {p.company && <span style={{ fontSize: 12.5, color: '#6B6B6B', marginLeft: 6 }}>{p.company}</span>}
                  </div>
                  <span style={{ fontSize: 11.5, color: '#9B7B5E', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 12 }}>{p.fromMonth} – {p.toMonth}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode; main?: boolean }> = ({ children, main }) => (
  <div style={{
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: '1.6px',
    textTransform: 'uppercase',
    color: '#7A5C44',
    paddingBottom: 6,
    borderBottom: '1.5px solid #C4956A',
    marginBottom: 12,
  }}>
    {children}
  </div>
);

export default CVPreview;
