import { Router, Request, Response } from 'express';
import { exportToPdf } from '../services/pdfExport';
import { exportToDocx } from '../services/docxExport';
import { CVData } from '../types/cv';

const router = Router();

router.post('/pdf', async (req: Request, res: Response) => {
  try {
    const cvData: CVData = req.body;
    const pdfBuffer = await exportToPdf(cvData);
    const filename = `${cvData.fullName || 'CV'}.pdf`.replace(/[^a-zA-Z0-9. _-]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error('PDF export error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/docx', async (req: Request, res: Response) => {
  try {
    const cvData: CVData = req.body;
    const docxBuffer = await exportToDocx(cvData);
    const filename = `${cvData.fullName || 'CV'}.docx`.replace(/[^a-zA-Z0-9. _-]/g, '_');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(docxBuffer);
  } catch (err: any) {
    console.error('DOCX export error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
