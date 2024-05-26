import { Request, Response, } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.model";

export const registerUser = asyncHandler( async (req : Request, res : Response) => {
    
    const {auth0Id , email } = req.body;

    if(!auth0Id || !email ) {
        throw new ApiError(400,'All fields are compulsary!');
    }
    const existedUser = await User.findOne({
        $or: [{auth0Id}, {email}]
    });

    if(existedUser) {
        // throw new ApiError(409,'User with email already exist');
        return res.status(200).json(new ApiResponse(201,existedUser))
    }

    const user = await User.create({
        auth0Id,
        email,
    });

    const userCreated = await User.findById(user._id);

    if(!userCreated) {
        throw new ApiError(500, 'Something went wrong while creating the user');
    }
    return res
    .status(200)
    .json( new ApiResponse(200,userCreated,'User created Successfully'))
})

export const updateCurrentUser = asyncHandler( async (req : Request, res : Response) => {
    
    const { username, addressLine1, city, country } = req.body;

    if(!username || !addressLine1 || !city || !country) {
        throw new ApiError(404, 'username or addressLine1 or city or country is missing')
    }

    const user = await User.findById(req.userId);

    console.log(user);

    if(!user) {
        throw new ApiError(404,'User not found');
    }

    user.username = username;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country

    const updatedUser = await user.save();

    console.log(updatedUser)

    if(!updatedUser) {
        throw new ApiError(500,'Something went wrong while updating user');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{updatedUser}, 'User Updated Successfully')
    )
})

export const getCurrentUser = asyncHandler( async(req:Request, res: Response) => {

    const currentUser = await User.findOne({_id:req.userId});
    if(!currentUser) {
        throw new ApiError(404,'User not found');
    }

    return res
    .status(200)
    .json(currentUser)    
});

