import crypto from "node:crypto";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import mail from "../mail.js";

import gravatar from "gravatar";

import User from "../models/user.js";

async function register(req, res, next) {
  const { email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatar = gravatar.url(emailInLowerCase);

    const verificationToken = crypto.randomUUID();

    const newUser = await User.create({
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL: avatar,
      verificationToken,
    });

    mail.sendMail({
      to: emailInLowerCase,
      from: "al.len@meta.ua",
      subject: "Welcome to contact book",
      html: `To confirm your email please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    res.status(201).send({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user === null) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    if (user.verify === false) {
      return res.status(401).send({ message: "Please verify your email" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.send({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const currentUser = await User.findOne(req.user.id);
    res.status(200).send({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOneAndUpdate(
      {
        verificationToken: verificationToken,
      },
      {
        verify: true,
        verificationToken: null,
      }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
}

async function extraVerification(req, res, next) {
  try {
    const { email } = req.body;

    const emailInLowerCase = email.toLowerCase();

    const user = await User.findOne({ email: emailInLowerCase });

    if (user.verify === true) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    const verificationToken = crypto.randomUUID();

    await User.findOneAndUpdate(
      {
        email: emailInLowerCase,
      },
      {
        verificationToken: verificationToken,
      }
    );

    mail.sendMail({
      to: emailInLowerCase,
      from: "al.len@meta.ua",
      subject: "Welcome to contact book",
      html: `To confirm your email please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    res.send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  verify,
  extraVerification,
};
