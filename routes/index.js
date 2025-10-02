import { Router } from "express";

import userRouter from "./users.routes.js";
import courseRouter from "./courses.routes.js";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/courses", courseRouter);

export default mainRouter;
