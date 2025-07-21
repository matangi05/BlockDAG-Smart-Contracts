import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the project root (one level up from backend)
app.use(express.static(path.join(__dirname, '../')));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Now loaded from .env

app.post('/extract', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  // Gemini prompt1 for structured extraction
  const prompt11 = `
Extract the following details from this contract description:
- From (the party offering the contract)
- To (the party receiving the contract)
- Deliverables
- Deadline
- Payment terms
- Milestones
- Penalties or refund clauses

Return the result as a JSON object with keys: description, from, to, deliverables, deadline, payment, milestones, penalties.

Description: """${text}"""
`;


  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt11 }] }]
      }
    );
    // Parse Gemini's response
    const aiText = response.data.candidates[0].content.parts[0].text;
    // Try to extract JSON from the response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extracted = JSON.parse(jsonMatch[0]);
      // Format deadline to dd-mm-yyyy if possible
      if (extracted.deadline) {
        let date = new Date(extracted.deadline);
        if (isNaN(date.getTime())) {
          // Try to parse formats like '28th of July' or '28 July' and assume year 2025
          const match = extracted.deadline.match(/(\d{1,2})(?:st|nd|rd|th)?(?: of)? ([A-Za-z]+)/);
          if (match) {
            const day = match[1];
            const monthName = match[2];
            const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
            const monthIndex = months.findIndex(m => m.startsWith(monthName.toLowerCase()));
            if (monthIndex !== -1) {
              date = new Date(2025, monthIndex, parseInt(day));
            }
          }
        }
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          extracted.deadline = `${day}-${month}-${year}`; // for display
          extracted.deadline_iso = `${year}-${month}-${day}`; // for input[type=date]
        }
      }
      res.json(extracted);
    } else {
      res.status(500).json({ error: 'AI did not return valid JSON', raw: aiText });
    }
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

app.post('/generate-pdf', async (req, res) => {
  const { contractDetails } = req.body;
  if (!contractDetails) return res.status(400).json({ error: 'No contract details provided' });

  // Compose a prompt for Gemini to generate a legal-style contract
  const prompt = `
Write a formal legal-style freelancer contract agreement (MoU) between the client and freelancer using the following details. Include amount, deadlines, deliverables, and penalties clearly. Use a professional legal tone and format for a contract document. Output only the contract text, no explanations.

Details:
${JSON.stringify(contractDetails, null, 2)}
`;

  let contractText = '';
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    contractText = response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Gemini API failed', details: err.response?.data || err.message });
  }

  // Generate PDF using pdfkit
  try {
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="contract.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text('Freelancer Contract Agreement', { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(12).text(contractText, { align: 'left' });
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed', details: err.message });
  }
});


const PORT = 3001;
app.listen(PORT, () => console.log(`AI backend running on http://localhost:${PORT}`)); 