import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CVPreview from '../components/CVPreview';
import EditForm from '../components/EditForm';
import { CVData } from '../types/cv';
import { exportToDocx } from '../utils/docxExport';

interface Props {
  cv: CVData;
  onUpdate: (cv: CVData) => void;
}

type Tab = 'preview' | 'edit';

const PreviewPage: React.FC<Props> = ({ cv, onUpdate }) => {
  const [tab, setTab] = useState<Tab>('preview');
  const [exporting, setExporting] = useState<string | null>(null);
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const previewScale = Math.min(1, (window.innerWidth * 0.52) / 794);

  const handlePrint = () => {
    window.print();
  };

  const handleDocx = async () => {
    setExporting('docx');
    try {
      await exportToDocx(cv);
    } catch (e: any) {
      alert('DOCX export failed: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      {/* Print styles — hides everything except the CV */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-cv { display: block !important; }
          @page { size: A4; margin: 0; }
        }
        #print-cv { display: none; }
      `}</style>

      {/* Hidden print target — always A4, never scaled */}
      <div id="print-cv">
        <CVPreview cv={cv} scale={1} />
      </div>

      <div className="min-h-screen bg-warm-bg flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Toolbar */}
        <header className="border-b border-warm-border bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-warm-muted hover:text-warm-text text-sm">← Back</button>
            <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: '#F0EAE2' }}>
              {(['preview', 'edit'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white text-sand-dark shadow-sm' : 'text-warm-muted hover:text-warm-text'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sand text-white text-sm font-medium hover:bg-sand-dark transition-colors"
            >
              ↓ PDF
            </button>
            <button
              onClick={handleDocx}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sand text-sand-dark text-sm font-medium hover:bg-sand-lighter transition-colors disabled:opacity-50"
            >
              {exporting === 'docx' ? '⏳' : '↓'} Word
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {tab === 'edit' ? (
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/2 overflow-y-auto p-6 border-r border-warm-border bg-white">
                <EditForm cv={cv} onChange={onUpdate} />
              </div>
              <div className="flex-1 overflow-auto flex justify-center p-8" style={{ background: '#F0EDE8' }}>
                <div style={{ width: 794 * previewScale }}>
                  <CVPreview cv={cv} scale={previewScale} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto flex justify-center py-10 px-4" style={{ background: '#F0EDE8' }}>
              <div>
                <p className="text-center mb-4" style={{ fontSize: 11, color: '#9B7B5E', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  A4 Preview — identical to PDF export
                </p>
                <div style={{ width: 794 * previewScale }}>
                  <CVPreview cv={cv} scale={previewScale} />
                </div>
                <p className="text-center mt-4 text-warm-muted text-xs">
                  Click <strong>↓ PDF</strong> to open the browser print dialog — choose "Save as PDF" for A4 export
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PreviewPage;
