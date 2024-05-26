import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import Restaurant from "../models/restaurant.model";
import ApiResponse from "../utils/ApiResponse";
import cloudinary from 'cloudinary';
import ApiError from "../utils/ApiError";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/Cloudinary";


const createRestaurant = asyncHandler( async(req: Request, res: Response) => {
    
    const existingRestaurant = await Restaurant.findOne({user: req.userId});

    if(existingRestaurant) {
        return res
        .status(409)
        .json(new ApiResponse(409,'Restaurant already exists'));
    }

    const imageFilePath = req.file?.path;
    if(!imageFilePath) {
        throw new ApiError(400,'Image File is Missing');
    }

    const uploadResponse = await uploadOnCloudinary(imageFilePath);


    if(!uploadResponse) {
        throw new ApiError(400,'Something went wrong while uploading files')
    }

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadResponse.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    if(!restaurant) {
        throw new ApiError(500,'Something went wrong while creating the restaurant')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,restaurant,'Restaurant created Successfully'),
    )

});

const getRestaurant = asyncHandler( async (req: Request, res: Response) => {
    
    const currentRestaurant = await Restaurant.findOne({ user: req.userId });

    if(!currentRestaurant) {
        throw new ApiError(404,'Restaurant Not Found');
    }

    return res.status(200).json(currentRestaurant);
});

const updateRestaurant = asyncHandler ( async (req: Request, res: Response) => {
    
    const restaurant = await Restaurant.findOne({
        user: req.userId,
    });

    if(!restaurant) {
        throw new ApiError(404,'Restaurant Not Found');
    };

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menu = req.body = req.body.menu;
    restaurant.lastUpdated = new Date(); 
    const imageFilePath = req.file?.path;
    if(imageFilePath) {
        const imageResponse = await uploadOnCloudinary(imageFilePath);
        if(!imageResponse) {
            throw new ApiError(500,'Something went wrong while uploading the imageFile')
        }
        restaurant.imageUrl = imageResponse.url;
    }

    const updatedRestaurant = restaurant.save();
    if(!updateRestaurant) {
        throw new ApiError(500, 'Something went wrong while updating Restaurant');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updateRestaurant, 'Restaurant Updated Successfully')
    )
})

export  { 
    createRestaurant,
    getRestaurant,
    updateRestaurant,
}