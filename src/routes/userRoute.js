const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");

const tokenControl = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "Cannot leave empty fields!" });
    }
    let user = await User.create(req.body);
    res.status(200).send({
      success: true,
      message: "User successfully created.",
      user: user,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || username == "" || password == "") {
      return res
        .status(404)
        .send({ success: false, message: "Cannot leave empty fields!" });
    }
    let userFromDb = await User.findOne({ username });
    //Normalde parola ve username için ayrı ayrı hata mesajı dönülmemesi gerekemektedir
    //Ders anlatımı sebebiyle ayrı yazılmıştır.
    if (!userFromDb) {
      return res
        .status(404)
        .send({ success: false, message: "Username is not found" });
    }
    if (password !== userFromDb.password) {
      return res
        .status(404)
        .send({ success: false, message: "Inccorect Passoword" });
    }
    //Token İşlemi
    let access_token = jwt.sign(
      { userId: userFromDb.id, username: userFromDb.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).send({
      success: true,
      message: `Welcome ${userFromDb.username}`,
      user: userFromDb,
      access_token: access_token,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

userRouter.get("/get-all", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ success: true, message: "All Users", users: users });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// userRouter.get("/get-all", tokenControl, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).send({ success: true, message: "All Users", users: users });
//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// });

userRouter.post("/reset-password-request", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Not Found!" });
    }

    const token = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    user.userPasswordToken = token;
    user.userPasswordTokenTime = Date.now() + 3600000;
    await user.save();

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "21b3fe57e99699",
        pass: "5b535749dc5c4e",
      },
    });

    const mailOptions = {
      from: "wissenticaret@noreply.com",
      to: email,
      subject: "Reset Password",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1); text-align: center; width: 300px;">
          <h3 style="margin-bottom: 20px; color: #5cb85c;">Parola Sıfırlamaya Hoşgeldiniz</h3>
          <p style="margin-bottom: 20px; font-size: 16px;">Aşağıdaki butondan parola sıfırlama işleminizi gerçekleştirebilirsiniz:</p>
          <a href="http://localhost:3000/password-reset/token=${token}" style="display: inline-block; background-color: #5cb85c; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; transition: background-color 0.3s;">Yeni Parola Oluştur</a>
      </div>
  </div>
      `,
    };

    transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: error.message });
      }
      res.status(200).send({ success: true, message: "Email Sent!" });
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

userRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const { password, passwordConfirmation } = req.body;
    const { token } = req.params;
    if (!token) {
      return res.status(404).send({ success: false, message: "Invalid Token" });
    }
    if (password !== passwordConfirmation) {
      return res
        .status(404)
        .send({ success: false, message: "Password not match" });
    }
    let user = await User.findOne({
      userPasswordToken: token,
      userPasswordTokenTime: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid Token or Expired Token" });
    }
    user.password = password;
    user.userPasswordToken = null;
    user.userPasswordTokenTime = null;
    await user.save();

    res.status(200).send({ success: true, message: "Password Changed!" });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = userRouter;
