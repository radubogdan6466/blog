const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();

const logger = require("firebase-functions/logger");

// Aceasta este o funcție care va răspunde la cereri HTTP
exports.checkAdminEmail = onRequest(async (request, response) => {
  // Obține UID-ul utilizatorului din autorizație
  const idToken = request.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    response.status(401).send("No ID token provided");
    return;
  }

  try {
    // Verifică token-ul și extrage utilizatorul
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    // Verifică dacă email-ul este al unui admin
    if (email === process.env.REACT_APP_ADMIN_EMAIL) {
      response.status(200).send("User is an admin");
    } else {
      response.status(403).send("User is NOT an admin");
    }
  } catch (error) {
    logger.error("Error verifying ID token", error);
    response.status(500).send("Internal Server Error");
  }
});
