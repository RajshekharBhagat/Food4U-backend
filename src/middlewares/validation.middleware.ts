import { body, validationResult } from "express-validator";
import asyncHandler from "../utils/AsyncHandler";
import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse";

const handleValidationErrors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(
            new ApiResponse(400,errors.array())
        );
    }
    next();
});

export const validateUserRequest = [

  body("username")
    .isString()
    .notEmpty()
    .withMessage("Username must be String"),

  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("addressLine1 must be String"),

  body("city")
    .isString()
    .notEmpty()
    .withMessage("city must be String"),

  body("country")
    .isString()
    .notEmpty()
    .withMessage("country must be String"),
  handleValidationErrors,
];

export const validateRestaurantRequest = [

  body('restaurantName').isString().notEmpty().withMessage('Restaurant Name is required '),
  body('city').isString().notEmpty().withMessage('city is required '),
  body('country').isString().notEmpty().withMessage('country is required '),
  body('deliveryPrice').isFloat({ min: 0 }).withMessage('Delivery Price is required and must be a positive number'),
  body('estimatedDeliveryTime').isInt({ min: 0 }).withMessage('Estimated Delivery Time is required and must be a positive integer'),
  body('cuisines').isArray({ min: 1 }).withMessage('Cuisines must be a non-empty array'),
  body('menu').isArray({ min: 1 }).withMessage('Menu items must be a non-empty array'),
  body('menu.*.name').isString().notEmpty().withMessage('Menu item name is required'),
  body('menu.*.price').isFloat({ min: 0 }).withMessage('Menu item price is required and must be a positive number'),

  handleValidationErrors,
];
