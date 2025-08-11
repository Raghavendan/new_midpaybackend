import express from "express";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Gateway sends form data
app.use(bodyParser.json());

// Replace with your AuthKey
const AUTH_KEY = "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo";

// AES Decrypt function (reverse of your React encryption)
function decryptRespData(encData) {
  const key = CryptoJS.enc.Utf8.parse(AUTH_KEY.padEnd(32, "0"));
  const iv = CryptoJS.enc.Utf8.parse(AUTH_KEY.substring(0, 16));

  const decrypted = CryptoJS.AES.decrypt(encData, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}

// Callback URL from Payment Gateway
app.post("/transaction", (req, res) => {
  try {
    const { respData } = req.body; // Payment gateway sends respData here

    if (!respData) {
      return res.status(400).send("Missing respData");
    }

    // Decrypt the response
    const paymentDetails = decryptRespData(respData);
    console.log("✅ Decrypted Payment Data:", paymentDetails);

    // TODO: Save paymentDetails to your database if needed

    // Redirect user to frontend page with only safe info
    res.redirect(
      `https://nonseampay.vercel.app/transaction?AggRefNo=${paymentDetails.AggRefNo}&status=${paymentDetails.Status}`
    );
  } catch (error) {
    console.error("❌ Error decrypting payment data:", error);
    res.status(500).send("Error processing payment response");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
