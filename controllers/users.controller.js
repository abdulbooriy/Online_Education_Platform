import { totp } from "otplib";
import sendMail from "../mail/index.js";
import { prisma } from "../main.js";
import {
  userLoginVerification,
  userValidation,
  userVerification,
} from "../validations/users.validation.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const TOTP_SECRET_KEY = process.env.TOTP_SECRET_KEY;
totp.options = { step: 1800, digits: 6 };

async function TokenGenereate(payload) {
  try {
    return jwt.sign(payload, process.env.TOKEN_SECRET_KEY);
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const findUser = await prisma.users.findUnique({ where: { email } });
    if (findUser)
      return res.status(403).send({
        message:
          "This email address is already registered. Please use a different email address or log in",
      });

    const { error, value } = userValidation({ name, email, password, role });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    if (!["instructor", "student"].includes(role))
      return res.status(403).send({
        message:
          "You must select only one of these roles: [instructor, student]",
      });

    value.password = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: { name, email, password: value.password, role: role || "student" },
    });

    let otp = totp.generate(`${TOTP_SECRET_KEY}${email}`);

    await sendMail({
      to: email,
      subject: "One-Time Password",
      html: `This is an OTP-CODE to activate your account: <h1>${otp}</h1>`,
    });

    res.status(201).send({
      message:
        "Registered successfully ✅. We sent an OTP-CODE to your email, Please activate your account",
    });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req?.body;

    const { error, value } = userVerification({ email, otp });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const findUser = await prisma.users.findUnique({
      where: { email: value.email },
    });
    if (!findUser)
      return res.status(405).send({ message: "Wrong email address !" });

    const checkOtp = totp.verify({
      token: otp,
      secret: `${TOTP_SECRET_KEY}${value.email}`,
    });
    if (!checkOtp) return res.status(403).send({ message: "Wrong OTP Code !" });

    if (findUser.status === "INACTIVE") {
      await prisma.users.update({
        data: { status: "ACTIVE" },
        where: { email: value.email },
      });
    }

    res.status(200).send({ message: "Your account verified successfully ✅" });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req?.body;

    const { error, value } = userLoginVerification({ email, password });
    if (error)
      return res.status(403).send({ message: error.details[0].message });

    const checkUserEmail = await prisma.users.findUnique({
      where: { email: value.email },
    });

    if (
      !checkUserEmail ||
      !(await bcrypt.compare(password, checkUserEmail.password))
    ) {
      return res
        .status(403)
        .send({ message: "Email address or Password wrong !" });
    }

    if (checkUserEmail.status === "INACTIVE") {
      return res
        .status(401)
        .send({ message: "You should activate your account!" });
    }

    const token = await TokenGenereate({
      id: checkUserEmail.id,
      role: checkUserEmail.role,
    });

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

export { TokenGenereate, register, verifyOtp, login };
