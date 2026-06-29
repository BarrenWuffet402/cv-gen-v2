import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CVPreview from '../components/CVPreview';
import EditForm from '../components/EditForm';
import { CVData } from '../types/cv';

interface Props {
  cv: CVData;
  onUpdate: (cv: CVData) => void;
}

type Tab = 'preview' | 'edit';

const PreviewPage: React.FC<Props> = ({ cv, onUpdate }) => {
  const [tab, setTab] = useState<Tab>('preview');
  const [exporting, setExporting] = useState<string | null>(null);
  const navigate = useNavigate();

  // Scale A4 (794px) to fit the preview panel
  const previewScale = Math.min(1, (window.innerWidth * 0.55) / 794);

  const exportFile = async (type: 'pdf' | 'docx') => {
    setExporting(type);
    try {
      const res = await fetch(`/api/export/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cv),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.fullName || 'CV'}.${type}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('Export failed: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Toolbar */}
      <header className="border-b border-warm-border bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-warm-muted hover:text-warm-text text-sm">← Back</button>
          <div className="flex items-center gap-1 bg-sand-lighter rounded-lg p-1">
            <button
              onClick={() => setTab('preview')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'preview' ? 'bg-white text-sand-dark shadow-sm' : 'text-warm-muted hover:text-warm-text'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setTab('edit')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'edit' ? 'bg-white text-sand-dark shadow-sm' : 'text-warm-muted hover:text-warm-text'}`}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportFile('pdf')}
            disabled={!!exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sand text-white text-sm font-medium hover:bg-sand-dark transition-colors disabled:opacity-50"
          >
            {exporting === 'pdf' ? '⏳' : '↓'} PDF
          </button>
          <button
            onClick={() => exportFile('docx')}
            disabled={!!exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-sand text-sand-dark text-sm font-medium hover:bg-sand-lighter transition-colors disabled:opacity-50"
          >
            {exporting === 'docx' ? '⏳' : '↓'} Word
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {tab === 'edit' ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Edit form */}
            <div className="w-1/2 overflow-y-auto p-6 border-r border-warm-border bg-white">
              <EditForm cv={cv} onChange={onUpdate} />
            </div>
            {/* Live preview */}
            <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-8">
              <div style={{ width: 794 * previewScale, height: 'fit-content' }}>
                <CVPreview cv={cv} scale={previewScale} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto bg-gray-100 flex justify-center py-10 px-4">
            <div style={{ width: 794 * previewScale + 32 }}>
              <p className="text-xs text-warm-muted text-center mb-4 uppercase tracking-widest">A4 Preview — identical to export</p>
              <div style={{ width: 794 * previewScale }}>
                <CVPreview cv={cv} scale={previewScale} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
