// server/index.js
import express from "express";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // Payment gateway often sends form data
app.use(bodyParser.json());

// Callback route
app.all("/transaction", (req, res) => {
  try {
    console.log("Payment Gateway Callback Data:", req.body);

    // Extract encrypted respData
    const encryptedRespData = req.body.respData;

    // Decrypt (AES-256-CBC example; adjust to your key/iv setup)
    const secretKey = "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo"; // must match gateway config
    const bytes = CryptoJS.AES.decrypt(encryptedRespData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    console.log("Decrypted Payment Data:", decryptedData);

    // Send a response back to payment gateway
    res.status(200).send("Callback received successfully");
  } catch (error) {
    console.error("Error handling callback:", error);
    res.status(500).send("Error processing callback");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
