import {Request, Response, NextFunction, RequestHandler } from "express"
// const requestHandler = (requestHandler:RequestHandler): RequestHandler => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try{
//             await requestHandler(req, res, next);
//         } catch (err) {
//             next(err);
//         }
//     };
// };
const asyncHandler = (requestHandler:RequestHandler) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};

export default asyncHandler;