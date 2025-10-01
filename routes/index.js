import { Router } from "express";

import userRoute from "./users.routes.js";

const mainRouter = Router();

mainRouter.use("/users", userRoute);

export default mainRouter;
