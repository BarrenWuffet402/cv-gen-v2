import React from 'react';
import { CVData, CVProjectExperience, CVPosition, CVCertification, CVEducation, CVLanguage } from '../types/cv';

interface Props {
  cv: CVData;
  onChange: (cv: CVData) => void;
}

const genId = () => Math.random().toString(36).substr(2, 9);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#7A5C44' }}>{label}</label>
    {children}
  </div>
);

const inputCls = "w-full border border-warm-border rounded-lg px-3 py-2 text-sm text-warm-text bg-white focus:outline-none focus:ring-2 focus:ring-sand focus:border-transparent";
const textareaCls = inputCls + " resize-none";

const SectionHeader: React.FC<{ title: string; onAdd: () => void }> = ({ title, onAdd }) => (
  <div className="flex items-center justify-between mb-3 mt-6">
    <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#7A5C44' }}>{title}</h3>
    <button onClick={onAdd} className="text-xs text-sand hover:text-sand-dark font-medium">+ Add</button>
  </div>
);

const EditForm: React.FC<Props> = ({ cv, onChange }) => {
  const set = (patch: Partial<CVData>) => onChange({ ...cv, ...patch });
  const setContact = (patch: Partial<CVData['contact']>) => set({ contact: { ...cv.contact, ...patch } });

  // Projects
  const updateProject = (id: string, patch: Partial<CVProjectExperience>) =>
    set({ projectExperience: cv.projectExperience.map(p => p.id === id ? { ...p, ...patch } : p) });
  const removeProject = (id: string) => set({ projectExperience: cv.projectExperience.filter(p => p.id !== id) });
  const addProject = () => set({
    projectExperience: [...cv.projectExperience, { id: genId(), role: '', fromMonth: '', toMonth: 'Present', projectDescription: '', tasksAndResponsibilities: [], technologiesAndTools: [] }]
  });

  // Positions
  const updatePosition = (id: string, patch: Partial<CVPosition>) =>
    set({ positionsHeld: cv.positionsHeld.map(p => p.id === id ? { ...p, ...patch } : p) });
  const removePosition = (id: string) => set({ positionsHeld: cv.positionsHeld.filter(p => p.id !== id) });
  const addPosition = () => set({ positionsHeld: [...cv.positionsHeld, { id: genId(), role: '', company: '', fromMonth: '', toMonth: 'Present' }] });

  // Certs
  const updateCert = (id: string, patch: Partial<CVCertification>) =>
    set({ certifications: cv.certifications.map(c => c.id === id ? { ...c, ...patch } : c) });
  const removeCert = (id: string) => set({ certifications: cv.certifications.filter(c => c.id !== id) });
  const addCert = () => set({ certifications: [...cv.certifications, { id: genId(), name: '', issuer: '', date: '' }] });

  // Education
  const updateEdu = (id: string, patch: Partial<CVEducation>) =>
    set({ education: cv.education.map(e => e.id === id ? { ...e, ...patch } : e) });
  const removeEdu = (id: string) => set({ education: cv.education.filter(e => e.id !== id) });
  const addEdu = () => set({ education: [...cv.education, { id: genId(), degree: '', institution: '', year: '' }] });

  // Languages
  const updateLang = (id: string, patch: Partial<CVLanguage>) =>
    set({ languages: cv.languages.map(l => l.id === id ? { ...l, ...patch } : l) });
  const removeLang = (id: string) => set({ languages: cv.languages.filter(l => l.id !== id) });
  const addLang = () => set({ languages: [...cv.languages, { id: genId(), language: '', proficiency: '' }] });

  const listToText = (arr: string[]) => arr.join('\n');
  const textToList = (t: string) => t.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div>
      {/* Basic info */}
      <h2 className="font-serif text-lg text-warm-text mb-4">Edit CV</h2>

      <Field label="Full Name">
        <input className={inputCls} value={cv.fullName} onChange={e => set({ fullName: e.target.value })} />
      </Field>
      <Field label="Professional Title">
        <input className={inputCls} value={cv.professionalTitle} onChange={e => set({ professionalTitle: e.target.value })} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Email"><input className={inputCls} value={cv.contact.email || ''} onChange={e => setContact({ email: e.target.value })} /></Field>
        <Field label="Phone"><input className={inputCls} value={cv.contact.phone || ''} onChange={e => setContact({ phone: e.target.value })} /></Field>
        <Field label="LinkedIn"><input className={inputCls} value={cv.contact.linkedin || ''} onChange={e => setContact({ linkedin: e.target.value })} /></Field>
        <Field label="Location"><input className={inputCls} value={cv.contact.location || ''} onChange={e => setContact({ location: e.target.value })} /></Field>
      </div>

      <Field label="Summary">
        <textarea className={textareaCls} rows={4} value={cv.summary} onChange={e => set({ summary: e.target.value })} />
      </Field>

      {/* Project Experience */}
      <SectionHeader title="Project Experience" onAdd={addProject} />
      {cv.projectExperience.map(p => (
        <div key={p.id} className="border border-warm-border rounded-xl p-4 mb-3 bg-white">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-warm-muted">Project</span>
            <button onClick={() => removeProject(p.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
          </div>
          <Field label="Role"><input className={inputCls} value={p.role} onChange={e => updateProject(p.id, { role: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From (e.g. Jan 2022)"><input className={inputCls} value={p.fromMonth} onChange={e => updateProject(p.id, { fromMonth: e.target.value })} /></Field>
            <Field label="To (e.g. Present)"><input className={inputCls} value={p.toMonth} onChange={e => updateProject(p.id, { toMonth: e.target.value })} /></Field>
          </div>
          <Field label="Project Description"><textarea className={textareaCls} rows={2} value={p.projectDescription} onChange={e => updateProject(p.id, { projectDescription: e.target.value })} /></Field>
          <Field label="Tasks & Responsibilities (one per line)"><textarea className={textareaCls} rows={4} value={listToText(p.tasksAndResponsibilities)} onChange={e => updateProject(p.id, { tasksAndResponsibilities: textToList(e.target.value) })} /></Field>
          <Field label="Technologies & Tools (one per line)"><textarea className={textareaCls} rows={2} value={listToText(p.technologiesAndTools)} onChange={e => updateProject(p.id, { technologiesAndTools: textToList(e.target.value) })} /></Field>
        </div>
      ))}

      {/* Positions */}
      <SectionHeader title="Positions Held" onAdd={addPosition} />
      {cv.positionsHeld.map(p => (
        <div key={p.id} className="border border-warm-border rounded-xl p-4 mb-3 bg-white">
          <div className="flex justify-end mb-2"><button onClick={() => removePosition(p.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button></div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role"><input className={inputCls} value={p.role} onChange={e => updatePosition(p.id, { role: e.target.value })} /></Field>
            <Field label="Company"><input className={inputCls} value={p.company} onChange={e => updatePosition(p.id, { company: e.target.value })} /></Field>
            <Field label="From"><input className={inputCls} value={p.fromMonth} onChange={e => updatePosition(p.id, { fromMonth: e.target.value })} /></Field>
            <Field label="To"><input className={inputCls} value={p.toMonth} onChange={e => updatePosition(p.id, { toMonth: e.target.value })} /></Field>
          </div>
        </div>
      ))}

      {/* Certifications */}
      <SectionHeader title="Certifications & Courses" onAdd={addCert} />
      {cv.certifications.map(c => (
        <div key={c.id} className="border border-warm-border rounded-xl p-4 mb-3 bg-white">
          <div className="flex justify-end mb-2"><button onClick={() => removeCert(c.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><Field label="Name"><input className={inputCls} value={c.name} onChange={e => updateCert(c.id, { name: e.target.value })} /></Field></div>
            <Field label="Year"><input className={inputCls} value={c.date || ''} onChange={e => updateCert(c.id, { date: e.target.value })} /></Field>
            <div className="col-span-3"><Field label="Issuer"><input className={inputCls} value={c.issuer || ''} onChange={e => updateCert(c.id, { issuer: e.target.value })} /></Field></div>
          </div>
        </div>
      ))}

      {/* Education */}
      <SectionHeader title="Education" onAdd={addEdu} />
      {cv.education.map(e => (
        <div key={e.id} className="border border-warm-border rounded-xl p-4 mb-3 bg-white">
          <div className="flex justify-end mb-2"><button onClick={() => removeEdu(e.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><Field label="Degree"><input className={inputCls} value={e.degree} onChange={e2 => updateEdu(e.id, { degree: e2.target.value })} /></Field></div>
            <Field label="Year"><input className={inputCls} value={e.year || ''} onChange={e2 => updateEdu(e.id, { year: e2.target.value })} /></Field>
            <div className="col-span-3"><Field label="Institution"><input className={inputCls} value={e.institution} onChange={e2 => updateEdu(e.id, { institution: e2.target.value })} /></Field></div>
          </div>
        </div>
      ))}

      {/* Languages */}
      <SectionHeader title="Languages" onAdd={addLang} />
      {cv.languages.map(l => (
        <div key={l.id} className="border border-warm-border rounded-xl p-4 mb-3 bg-white">
          <div className="flex justify-end mb-2"><button onClick={() => removeLang(l.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button></div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Language"><input className={inputCls} value={l.language} onChange={e => updateLang(l.id, { language: e.target.value })} /></Field>
            <Field label="Proficiency"><input className={inputCls} value={l.proficiency} onChange={e => updateLang(l.id, { proficiency: e.target.value })} /></Field>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditForm;
