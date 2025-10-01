import { Router } from "express";
import { login, register, verifyOtp } from "../controllers/users.controller.js";

const userRoute = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: "User registration"
 *     tags: [Auth]
 *     description: "Create a new user and send them an OTP-CODE via email"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user-name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user-email address"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "user-password"
 *               role:
 *                 type: string
 *                 enum: ["instructor", "student"]
 *                 example: "user-role"
 *     responses:
 *       201:
 *         description: "User successfully registered"
 *       400:
 *         description: "Bad request - validation error"
 *       403:
 *         description: "Email already exists"
 */
userRoute.post("/register", register);

/**
 * @swagger
 * /users/verify-otp:
 *   post:
 *     summary: "Confirm OTP code via email"
 *     tags: [Auth]
 *     description: "The user confirms the OTP code received in the email and activates their account"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user-email address"
 *               otp:
 *                 type: string
 *                 example: "otp code"
 *     responses:
 *       200:
 *         description: "Account successfully activated"
 *       400:
 *         description: "Error query"
 *       403:
 *         description: "Wrong OTP Code"
 */
userRoute.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: "User login"
 *     tags: [Auth]
 *     description: "Login in with email address and password"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user-email address"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "user-password"
 *     responses:
 *       200:
 *         description: "Logged in successfully"
 *       401:
 *         description: "Account not activated"
 *       403:
 *         description: "Email address or password wrong"
 */
userRoute.post("/login", login);

export default userRoute;
