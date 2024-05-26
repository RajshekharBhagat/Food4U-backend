import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/AsyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      userId: string,
      auth0Id: string,
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const verifyJwt = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization && !authorization?.startsWith("Bearer")) {
        throw new ApiError(401, "Unauthorized Request");
      }

      const token = authorization.split(" ")[1];
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      if (!decoded) {
        throw new ApiError(401, "Unauthorized Request");
      }

      const auth0Id = decoded.sub;

      const user = await User.findOne({ auth0Id });

      if (!user) {
        throw new ApiError(401, "Unauthorized Request");
      }

      req.auth0Id = auth0Id as string;
      req.userId = user?._id.toString();
      next();

    } catch (error) {
      throw new ApiError(401, "Invalid Access Token");
    }
  }
);
