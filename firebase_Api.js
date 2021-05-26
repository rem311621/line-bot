const serviceAccount = require("./test-line-bot-e06b0-firebase-adminsdk-ytkpy-cb6f919950.json");
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  type: serviceAccount.type,
  project_id: serviceAccount.project_id,
  private_key_id: process.env.FIREBASE_KEY_ID,
  private_key: process.env.FIREBASE_KEY.replace(/\\n/g, "\n"),
  client_email: serviceAccount.client_email,
  client_id: serviceAccount.client_id,
  auth_uri: serviceAccount.auth_uri,
  token_uri: serviceAccount.token_uri,
  auth_provider_x509_cert_url: serviceAccount.auth_provider_x509_cert_url,
  client_x509_cert_url: serviceAccount.client_x509_cert_url,
};
