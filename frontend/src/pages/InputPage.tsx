import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CVData } from '../types/cv';
import { sampleCV } from '../data/sampleCV';
import { parseTextToCV } from '../utils/parser';

interface Props {
  onCVLoad: (cv: CVData) => void;
}

const InputPage: React.FC<Props> = ({ onCVLoad }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const parseAndGo = (raw: string) => {
    setLoading(true);
    setError('');
    try {
      const cv = parseTextToCV(raw);
      onCVLoad(cv);
      navigate('/preview');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError('');
    try {
      let text = '';
      if (file.name.endsWith('.pdf')) {
        // PDF.js is heavy; for static deploy we just read as text best-effort
        // or ask user to paste. Show a friendly message.
        setError('PDF upload requires the server. Please paste the CV text instead, or upload a .txt or .docx file.');
        setLoading(false);
        return;
      } else {
        text = await file.text();
      }
      const cv = parseTextToCV(text);
      onCVLoad(cv);
      navigate('/preview');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const loadSample = () => {
    onCVLoad(sampleCV);
    navigate('/preview');
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <header className="border-b border-warm-border bg-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center text-white font-bold text-sm font-sans">CV</div>
          <span className="font-semibold text-warm-text font-serif text-lg">CV Gen v2</span>
        </div>
        <button onClick={loadSample} className="text-sm text-sand-dark hover:text-sand underline">
          Load sample CV →
        </button>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="font-serif text-4xl text-warm-text mb-2">Generate a CV</h1>
          <p className="text-warm-muted mb-10 text-base">Paste CV text or upload a .txt / .docx file. We'll parse it into a professional formatted CV.</p>

          <div className="mb-6">
            <label className="block mb-2" style={{ fontSize: 11, fontWeight: 600, color: '#7A5C44', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Paste CV text
            </label>
            <textarea
              className="w-full h-52 rounded-xl border border-warm-border bg-white px-4 py-3 text-sm text-warm-text resize-none focus:outline-none focus:ring-2 focus:ring-sand focus:border-transparent placeholder-warm-muted"
              placeholder="Paste any CV content here — structured or unstructured, from LinkedIn, email, Word..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button
              onClick={() => { if (!text.trim()) return setError('Please paste some text first.'); parseAndGo(text); }}
              disabled={loading || !text.trim()}
              className="mt-3 w-full py-3 rounded-xl font-semibold text-white bg-sand hover:bg-sand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Parsing...' : 'Parse & Preview →'}
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-warm-border" />
            <span style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or upload a file</span>
            <div className="flex-1 h-px bg-warm-border" />
          </div>

          <div
            className={`rounded-xl border-2 border-dashed transition-colors p-10 text-center cursor-pointer ${dragOver ? 'border-sand bg-sand-lighter' : 'border-warm-border hover:border-sand bg-white'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".txt,.docx" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="text-3xl mb-3">📄</div>
            <p className="text-warm-text font-medium">Drop a file here or <span className="text-sand underline">browse</span></p>
            <p className="text-warm-muted text-sm mt-1">TXT or DOCX supported</p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InputPage;
