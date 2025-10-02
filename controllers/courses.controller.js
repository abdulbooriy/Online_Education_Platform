import { prisma } from "../main.js";
import {
  courseUpdateValidation,
  courseValidation,
} from "../validations/courses.validation.js";
import { Decimal } from "@prisma/client/runtime/library";

async function findAll(req, res) {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const coursesWithNumberPrice = courses.map((course) => ({
      ...course,
      price: course.price.toNumber(),
    }));

    res.status(200).send({ courses: coursesWithNumberPrice });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function findOne(req, res) {
  try {
    const course = await prisma.courses.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!course) return res.status(404).send({ message: "Course not found!" });

    res.status(200).send({ ...course, price: course.price.toNumber() });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function create(req, res) {
  try {
    const { title, description, price } = req.body;
    const { id } = req.user;

    const { error, value } = courseValidation({
      title,
      description,
      price,
    });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const instructor = await prisma.users.findUnique({
      where: { id: id },
    });

    if (!instructor)
      return res.status(404).send({ message: "Instructor not found!" });

    if (instructor.role !== "instructor")
      return res.status(403).send({ message: "User is not an instructor!" });

    const newCourse = await prisma.courses.create({
      data: {
        title: value.title,
        description: value.description,
        price: new Decimal(value.price),
        instructor_id: id,
      },
    });

    res.status(200).send({
      course: {
        ...newCourse,
        price: newCourse.price.toNumber(),
      },
    });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function update(req, res) {
  try {
    const { title, description, price } = req.body;
    const { id } = req.params;

    let { id: instructor_id } = req.user;

    const { error, value } = courseUpdateValidation({
      title,
      description,
      price,
    });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const checkCourse = await prisma.courses.findUnique({ where: { id: id } });
    if (!checkCourse)
      return res.status(404).send({ message: "Course not found!" });

    const updated_course = await prisma.courses.update({
      data: {
        title: value.title,
        description: value.description,
        price: new Decimal(value?.price),
        instructor_id,
      },
      where: { id },
    });

    res
      .status(200)
      .send({ ...updated_course, price: updated_course.price.toNumber() });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

async function myCourses(req, res) {
  try {
    const { id } = req.user;

    const instructor = await prisma.users.findUnique({
      where: { id: id },
    });
    if (!instructor)
      return res.status(404).send({ message: "Instructor not found!" });

    if (instructor.role !== "instructor")
      return res.status(403).send({ message: "User is not an instructor!" });

    const my_courses = await prisma.courses.findMany({
      where: { instructor_id: id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const coursesWithNumberPrice = my_courses.map((course) => ({
      ...course,
      price: course.price.toNumber(),
    }));

    res.status(200).send({ my_courses: coursesWithNumberPrice });
  } catch (error) {
    res.status(400).send({ error_message: error.message });
  }
}

export { findAll, findOne, create, update, myCourses };
