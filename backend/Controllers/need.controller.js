import { asyncHandler } from "../utils/asyncHandler";
import { School } from "../Models/school.model";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { Need } from "../Models/need.model";

//post route to create need as a verifier
const creatNeed=asyncHandler(async (req,res)=>{
const {userId}=req.user;
if(userId.role!=="verifier"){
    throw new apiError(403, "Unauthorized")
}
const {schoolId}= req.params;

if(!schoolId){
    throw new apiError(400,"School ID is required")
}

const school =await School.findById(schoolId);

if(!school){
    throw new apiError(404,"School not found")
}
const {itemName,quantity,estimatedCost,description}=req.body;

if(!itemName || !quantity || !estimatedCost){
    throw new apiError(401," fill all the required feilds");
};

const need =await Need.create(
    {
        schoolId: school._id,
        itemName,
        quantity,
        estimatedCost,
        description,
    }
)



const createdNeed=await Need.findById(need._id);
if(!creatNeed){
    throw new apiError(500,"something goes wrong while creating need")
}

return res.status(201).json(
    new apiResponse(201,createdNeed,"Need created successfully")
)



});

// get route to get all the need of any school
const getAllNeed= asyncHandler( async (req,res)=>{
   const {schoolId}= req.params;
   if(!schoolId){
    throw new apiError(400,"school not specified");
   }

   const needs= await Need.findById({schoolId});

  return res.status(200).json(
    new apiResponse(400,needs,"successfully fetched needs")
  )
});


const updateNeedStatus= asyncHandler( async (req,res)=>{
    
    const {needId}= req.params;
})



    

export {
    creatNeed,
    getAllNeed,

}
