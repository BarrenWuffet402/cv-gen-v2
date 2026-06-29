import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseTextToCV } from '../services/parser';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let text = '';

    if (req.file) {
      const mime = req.file.mimetype;
      if (mime === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } else if (
        mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        req.file.originalname.endsWith('.docx')
      ) {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = result.value;
      } else {
        text = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.text) {
      text = req.body.text;
    } else {
      return res.status(400).json({ error: 'No text or file provided' });
    }

    const cvData = parseTextToCV(text);
    res.json(cvData);
  } catch (err: any) {
    console.error('Parse error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
