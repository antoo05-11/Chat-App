import {
    Router
} from "express";

import authRoute from "./auth";
import userRoute from "./user";
import chatRoute from "./chat";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/chat", chatRoute);

export default router;