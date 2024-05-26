import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import Restaurant from "../models/restaurant.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { param } from "express-validator";
import mongoose from "mongoose";

const searchRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const city = req.params.city;
  const searchQuery = (req.query.searchQuery as string) || "";
  const selectedCuisines = (req.query.selectedCuisines as string) || "";
  const sortOption = (req.query.sortOption as string) || "lastUpdated";
  const page = parseInt(req.query.page as string) || 1;

  let query: any = {};

  query["city"] = new RegExp(city, "i");
  const cityCheck = await Restaurant.countDocuments(query);

  if (cityCheck === 0) {
    return new ApiResponse(
      404,
      {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      },
      "Restaurant not Found"
    );
  }

  if (selectedCuisines) {
    const cuisinesArray = selectedCuisines
      .split(",")
      .map((cuisine) => new RegExp(cuisine, "i"));
    query["cuisines"] = { $all: cuisinesArray };
  }

  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery, "i");
    query["$or"] = [
      { restaurantName: searchRegex },
      { cuisines: { $in: [searchRegex] } },
    ];
  }

  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  //sort Option = 'lastUpdated';

  const restaurants = await Restaurant.find(query)
    .sort({ [sortOption]: 1 })
    .skip(skip)
    .limit(pageSize)
    .lean();

  const total = await Restaurant.countDocuments(query);

  const response = {
    data: restaurants,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / pageSize),
    },
  };

  return res.status(200).json(response);
});

const getResturantWithId = asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;

  const restaurantWithId = await Restaurant.findById(restaurantId);
  if (!restaurantWithId) {
    throw new ApiError(404, "Restaurant not found");
  }
  return res.json(restaurantWithId);
});

export { searchRestaurant, getResturantWithId };
