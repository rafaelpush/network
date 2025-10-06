const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const AdmZip = require('adm-zip');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

// Supondo que você exportou botData do bot
const botData = require('./botData'); 

app.post('/api/upload', async (req, res) => {
  const { userId, mainFile, sizeMB, botId, zipBase64 } = req.body;
  if (!userId || !mainFile || !sizeMB || !botId || !zipBase64) return res.status(400).send("Dados incompletos");

  const folderPath = path.join("hosted", userId);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const zipBuffer = Buffer.from(zipBase64, 'base64');
  const zipPath = path.join("hosted", `${userId}.zip`);
  fs.writeFileSync(zipPath, zipBuffer);

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(folderPath, true);

  botData[userId] = {
    userId,
    mainFile,
    sizeMB,
    botId,
    folder: folderPath,
    thumbnail: '', // você pode salvar avatar URL
    ram: 0,
    cpu: 0,
    logs: [],
  };

  res.send({ success: true });
});

app.listen(3000, () => console.log("Backend rodando na porta 3000"));
