import Listing from "../models/listing.model.js";
import  {ErrorHandler}  from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(ErrorHandler(404, "listing not found"));
  }
  if(req.user.id!==listing.userRef.toString()){
    return next(ErrorHandler(401,'you can only delete your listings'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('listing deleted');
  } catch (error) {
    next(error);
  }
};