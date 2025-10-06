// functions/upload.js
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  try {
    const data = JSON.parse(event.body);
    const { userId, mainFile, sizeMB, botId, zipBase64 } = data;

    if (!userId || !mainFile || !botId || !zipBase64) {
      return { statusCode: 400, body: JSON.stringify({ success: false, msg: "Faltando dados" }) };
    }

    const uploadFolder = path.join(__dirname, "..", "hosted");
    if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

    const zipBuffer = Buffer.from(zipBase64, "base64");
    const filePath = path.join(uploadFolder, `${userId}.zip`);
    fs.writeFileSync(filePath, zipBuffer);

    // Aqui você pode adicionar lógica extra, como salvar info em JSON
    const info = {
      userId,
      mainFile,
      sizeMB,
      botId,
      filePath
    };
    fs.writeFileSync(path.join(uploadFolder, `${userId}.json`), JSON.stringify(info, null, 2));

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, msg: err.message }) };
  }
};
