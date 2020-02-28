import admin from "firebase-admin";

const serviceAccount = require("../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const firebaseAdmin = admin;
export const firestore = admin.firestore();
