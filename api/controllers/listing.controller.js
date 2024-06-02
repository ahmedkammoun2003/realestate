import Listing from "../models/listing.model.js";
import { ErrorHandler } from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listingId = req.params.id;
    if (!listingId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(ErrorHandler(400, "Invalid listing ID"));
    }
    const listing = await Listing.findById(listingId).catch((error) => next(error));
  if (!listing) {
    return next(ErrorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(ErrorHandler(401, "you can only delete your listings"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing deleted");
  } catch (error) {
    next(error);
  }
};
export const editListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;
    if (!listingId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(ErrorHandler(400, "Invalid listing ID"));
    }
    const listing = await Listing.findById(listingId).catch((error) => next(error));
    if (!listing) {
      return next(ErrorHandler(400, "listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      return next(ErrorHandler(400, "you can only edit your listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res,next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if (!listing) {
      return next(ErrorHandler(404, "listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};