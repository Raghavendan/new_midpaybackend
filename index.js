import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const AUTH_KEY = "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo";

function decryptRespData(respData) {
  const key = Buffer.from(AUTH_KEY.padEnd(32, "0"), "utf8");
  const iv = Buffer.from(AUTH_KEY.substring(0, 16), "utf8");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(respData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

app.post("/api/payment-callback", (req, res) => {
  try {
    const { respData, AuthID, AggRefNo } = req.body;
    const decryptedJson = decryptRespData(respData);
    const paymentInfo = JSON.parse(decryptedJson);

    console.log("Decrypted Payment Info:", paymentInfo);

    // You could save paymentInfo to DB here

    // Redirect user to your frontend status page with tx id
    res.redirect(`https://nonseampay.vercel.app/transaction?tx=${AggRefNo}`);
  } catch (err) {
    console.error("Error decrypting respData", err);
    res.status(500).send("Server error");
  }
});

app.listen(4000, () => console.log("Server listening on port 4000"));
