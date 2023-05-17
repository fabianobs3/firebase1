const admin = require("firebase-admin");
const fs = require("fs");
const { Octokit } = require("@octokit/rest");

// Inicialize o Firebase Admin SDK
const serviceAccount = require("path/to/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "firebase-adminsdk-toxnw@ifood-f6e46.iam.gserviceaccount.com"
});

// Configurar o cliente Octokit para acessar o GitHub
const octokit = new Octokit({
  auth: "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" // Substitua pelo seu token de acesso pessoal do GitHub
});

// Acessar dados do Firebase
const db = admin.database();
const ref = db.ref("path/to/data");

// Obter os dados do Firebase
ref.once("value", (snapshot) => {
  const data = snapshot.val();

  // Converter dados para JSON
  const jsonData = JSON.stringify(data);

  // Definir o nome do arquivo no GitHub
  const fileName = "firebase_data.json";

  // Criar o arquivo JSON localmente
  fs.writeFileSync(fileName, jsonData);

  // Fazer o upload do arquivo para o repositório do GitHub
  octokit.repos.createOrUpdateFileContents({
    owner: "fabianobs3",
    repo: "YOUR_REPO_NAME",
    path: fileName,
    message: "firebase1",
    content: Buffer.from(jsonData).toString("base64")
  }).then(() => {
    console.log("Dados transferidos com sucesso para o GitHub!");
  }).catch((error) => {
    console.error("Erro ao transferir dados para o GitHub:", error);
  });
});
