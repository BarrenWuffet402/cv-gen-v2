import express from 'express';
import cors from 'cors';
import { generateCVHtml } from './services/htmlTemplate';
import parseRouter from './routes/parse';
import exportRouter from './routes/export';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/parse', parseRouter);
app.use('/api/export', exportRouter);

// Bare HTML render route for Puppeteer PDF generation
app.get('/cv-render', (req, res) => {
  try {
    const raw = req.query.data as string;
    if (!raw) return res.status(400).send('No data');
    const cvData = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
    const html = generateCVHtml(cvData);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e: any) {
    res.status(400).send('Invalid data: ' + e.message);
  }
});

app.listen(PORT, () => {
  console.log(`✅ CV Gen v2 backend running on http://localhost:${PORT}`);
});
