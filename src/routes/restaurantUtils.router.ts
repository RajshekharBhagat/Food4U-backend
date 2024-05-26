import express from "express";
import { param } from "express-validator";
import { getResturantWithId, searchRestaurant } from "../controllers/restaurantUtils.controller";

const restaurantUtilsRoute = express.Router();

restaurantUtilsRoute.route('/search/:city',).get(
    param('city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City parameter must be valid string'),
    searchRestaurant,
);

restaurantUtilsRoute.get(
    '/details/:restaurantId',
    param('restaurantId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Restaurant ID parameter must be a valid string'),
    getResturantWithId,
)

export default restaurantUtilsRoute;


