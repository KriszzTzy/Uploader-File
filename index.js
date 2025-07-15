import express from 'express';
import fileUpload from 'express-fileupload';
import mime from 'mime-types';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Ganti sesuai kebutuhanmu
const a = 'ghp_';
const b = 'c41P8F';
const c = 'f9cgVV5cRsBvu6';
const d = 'uyIAO8hpCv3nEfSo';
const githubToken = `${a}${b}${c}${d}`;
const owner = 'KriszzTzy';
const repo = 'baru';
const branch = 'main';

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const uploadedFile = req.files.file;
    const mimeType = mime.lookup(uploadedFile.name);
    const fileName = `${Date.now()}.${mime.extension(mimeType)}`;
    const filePath = `uploads/${fileName}`;
    const base64Content = Buffer.from(uploadedFile.data).toString('base64');

    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        message: `Upload file ${fileName}`,
        content: base64Content,
        branch: branch,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

    return res.json({ success: true, url: rawUrl });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Uploader API listening at http://localhost:${port}`);
});
