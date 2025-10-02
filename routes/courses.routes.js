import { Router } from "express";
import {
  create,
  findAll,
  findOne,
  myCourses,
  update,
} from "../controllers/courses.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/rolePolice.js";
import { selfPolice } from "../middleware/selfPolice.js";

const courseRouter = Router();

/**
 * @swagger
 * /courses/my-courses:
 *   get:
 *     summary: "Get all my courses"
 *     tags: [Courses]
 *     description: "Get all my courses"
 *     responses:
 *       200:
 *         description: "A list of my courses"
 *       400:
 *         description: "Bad request - validation error"
 */
courseRouter.get("/my-courses", verifyToken, myCourses);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: "Get all courses"
 *     tags: [Courses]
 *     description: "Get all courses"
 *     responses:
 *       200:
 *         description: "A list of courses"
 *       400:
 *         description: "Bad request - validation error"
 */
courseRouter.get("/", findAll);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: "Get one course by ID"
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: "course_id"
 *     responses:
 *       200:
 *         description: "Course"
 *       404:
 *         description: "Course not found with this ID"
 */
courseRouter.get("/:id", findOne);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: "Create a new Course"
 *     tags: [Courses]
 *     description: "Only an instructor can create courses"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "course-title"
 *               description:
 *                 type: string
 *                 example: "course-description"
 *               price:
 *                 type: number
 *                 example: "course-price"
 *     responses:
 *       201:
 *         description: "Course created successfully"
 *       400:
 *         description: "Bad request - validation error"
 */
courseRouter.post("/", verifyToken, checkRole(["instructor"]), create);

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: "Update a course"
 *     tags: [Courses]
 *     description: "Modify existing course information"
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: "course_id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "course-name"
 *               description:
 *                 type: string
 *                 example: "course-description"
 *               price:
 *                 type: number
 *                 example: "course-price"
 *     responses:
 *       200:
 *         description: "Course updated successfully"
 *       404:
 *         description: "Course not found"
 */
courseRouter.patch("/:id", verifyToken, selfPolice(["instructor"]), update);

export default courseRouter;
