import { asyncHandler } from "../utils/asyncHandler.js";
import { School } from "../Models/school.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const getAllSchool = asyncHandler(async (req, res) => {
    // We pass the name of the field we want to populate
    const school = await School.find().populate("facility");
    
    return res.status(200).json(
        new apiResponse(200, school, "All schools fetched successfully")
    );
});

export {
    getAllSchool
};
