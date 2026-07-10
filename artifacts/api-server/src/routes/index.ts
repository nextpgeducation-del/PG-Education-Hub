import { Router, type IRouter } from "express";
import healthRouter from "./health";
import publicRouter from "./public";
import studentAuthRouter from "./studentAuth";
import studentRouter from "./student";
import adminAuthRouter from "./adminAuth";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicRouter);
router.use(studentAuthRouter);
router.use(studentRouter);
router.use(adminAuthRouter);
router.use(adminRouter);

export default router;
