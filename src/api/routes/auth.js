import {
    Router
} from "express";
import {
    login,
    loginWithToken,
    logout,
    requestRefreshToken
} from "../controllers/auth";
import catchAsync from "../exceptions/catch-async";
import {
    verifyToken
} from "../middlewares/verify-token";

const authRoute = Router();

authRoute.post("/login", catchAsync(login));
authRoute.post("/loginAuth", verifyToken, catchAsync(loginWithToken));
authRoute.post("/refresh-token", catchAsync(requestRefreshToken));
authRoute.post("/logout",catchAsync(logout))

export default authRoute;