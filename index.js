// server.js
import express from "express";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // for form data
app.use(bodyParser.json()); // for JSON

// Your AES key and IV from the payment API team
const AES_KEY = "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo"; // e.g., "12345678901234567890123456789012"
const AES_IV = "Qv0rg4oN8cS9sm6P";   // e.g., "1234567890123456"

// Callback endpoint
app.post("/transaction", (req, res) => {
  try {
    const encryptedRespData = req.body.respdata; // Payment gateway sends this

    if (!encryptedRespData) {
      return res.status(400).json({ error: "Missing respdata" });
    }

    // Decrypt
    const decryptedBytes = CryptoJS.AES.decrypt(
      encryptedRespData,
      CryptoJS.enc.Utf8.parse(AES_KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(AES_IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

    console.log("✅ Decrypted payment data:", decryptedText);

    // Send response to gateway
    res.status(200).send("OK");

    // Optionally store in DB...
  } catch (error) {
    console.error("❌ Error decrypting respdata:", error);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
