import { Router } from "express";
import {getCurrentUser, registerUser, updateCurrentUser} from "../controllers/user.controller";
import { jwtCheck, verifyJwt } from "../middlewares/auth.middleware";
import { validateUserRequest } from "../middlewares/validation.middleware";

const userRouter = Router();

userRouter.route('/register').post(
    registerUser
);
userRouter.route('/updateCurrentUser').put(
    jwtCheck,
    verifyJwt,
    updateCurrentUser
);
userRouter.route('/getCurrentUser').get(jwtCheck,
    verifyJwt,
    getCurrentUser
);

export default userRouter;