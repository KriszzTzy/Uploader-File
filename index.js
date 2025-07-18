//.
const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const port = 3000;
const a = 'gh'
const b = 'p_JOsyqug'
const c = 'VuizRYU2e4'
const d = 'GA8jZbpoinQcE1RBfCQ'
const githubToken = `${a}${b}${c}${d}`; // https://github.com/settings/tokens
const owner = 'KriszzTzy'; // GitHub username
const repo = 'baru'; // Repository name
const branch = 'main';

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFile = req.files.file;
  let mimeType = mime.lookup(uploadedFile.name);
  let fileName = `${Date.now()}.${mime.extension(mimeType)}`;
  let filePath = `uploads/${fileName}`;
  let base64Content = Buffer.from(uploadedFile.data).toString('base64');

  try {
    let response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      message: `Upload file ${fileName}`,
      content: base64Content,
      branch: branch,
    }, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
    });

    let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    // YAYAYAYYAYAYAYAYAYAYYAYAYYAYYAYAYAYAA
    res.send(`
    <!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Upload Successful!</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-800 via-indigo-900 to-black min-h-screen flex items-center justify-center">

    <div class="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-md w-full text-center">

        <!-- Foto Profil -->
        <img id="profileImage" src="" alt="Foto Profil" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20 object-cover">

        <h1 class="text-white text-xl font-bold mb-4">Salin Url File Kamu</h1>

        <div class="flex items-center bg-white/10 rounded-lg overflow-hidden mb-4">
            <input
                type="text"
                id="urlInput"
                readonly
                class="flex-1 px-4 py-3 bg-transparent text-white placeholder-white focus:outline-none"
            />
            <button
                onclick="copyUrl()"
                id="copyButton"
                class="px-4 py-3 bg-purple-600 hover:bg-purple-700 transition-all text-white font-semibold"
            >
                Salin
            </button>
        </div>

        <p id="notif" class="text-sm text-green-400 opacity-0 transition-opacity duration-300 mb-4">URL berhasil disalin!</p>

        <!-- Tombol Kunjungi -->
        <a
            id="visitButton"
            href="#"
            target="_blank"
            class="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg hover:scale-105 transition-all"
        >Kunjungi</a>
    </div>

    <script>
        const fallbackImage = "https://i.imgur.com/placeholder.png"; // Ganti dengan gambar default Anda

        const urlInput = document.getElementById("urlInput");
        const notif = document.getElementById("notif");
        const copyButton = document.getElementById("copyButton");
        const visitButton = document.getElementById("visitButton");
        const profileImage = document.getElementById("profileImage");

        urlInput.value = "${rawUrl}";
        visitButton.href = "${rawUrl}";

        function setProfileImage(url) {
            profileImage.src = url;
            profileImage.onerror = () => {
                profileImage.src = fallbackImage;
            };
        }

        setProfileImage(rawUrl);

        function copyUrl() {
            navigator.clipboard.writeText("${rawUrl}").then(() => {
                notif.classList.remove("opacity-0");
                notif.classList.add("opacity-100");

                copyButton.innerText = "Tersalin!";

                setTimeout(() => {
                    notif.classList.remove("opacity-100");
                    notif.classList.add("opacity-0");
                    copyButton.innerText = "Salin";
                }, 1500);
            });
        }
    </script>

</body>
</html>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
