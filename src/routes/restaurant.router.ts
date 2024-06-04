import express from 'express';
import {createRestaurant, getRestaurant, getRestaurantOrder, updateRestaurant} from '../controllers/restaurant.controller';
import { upload } from '../middlewares/multer.middleware';
import { jwtCheck, verifyJwt } from '../middlewares/auth.middleware';
import { validateRestaurantRequest } from '../middlewares/validation.middleware';

const restaurantRouter = express.Router();

restaurantRouter.route('/createRestaurant').post(
    upload.single('imageUrl'),
    validateRestaurantRequest,
    jwtCheck,
    verifyJwt,
    createRestaurant,
);

restaurantRouter.route('/getRestaurant').get(
    jwtCheck,
    verifyJwt,
    getRestaurant,
);

restaurantRouter.route('/updateRestaurant').put(
    upload.single('imageUrl'),
    validateRestaurantRequest,
    jwtCheck,
    verifyJwt,
    updateRestaurant
)

restaurantRouter.route('/getRestaurantOrder').get(
    jwtCheck,
    verifyJwt,
    getRestaurantOrder,
)

export default restaurantRouter;