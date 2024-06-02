import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarked, faBed, faBath } from "@fortawesome/free-solid-svg-icons";
export default function ListingCard({ listing }) {
  return (
    <div className="bg-white p-3 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/get/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[220px] sm:w-[220px] w-full bg-black object-contain hover:scale-105 transition-all duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="font-semibold text-slate-700 text-lg truncate">
            {listing.name}
          </p>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon
              icon={faMapMarked}
              className="text-green-700 w-4 h-4"
            />
            <span className="truncate text-sm text-gray-600 w-full">
              {listing.address}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-600 font-semibold mt-2 flex items-center">
            ${" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" ? "/mouth" : ""}
          </p>
          <div className="flex gap-6">
            <div className="flex gap-2 items-center font-bold text-sm">
              <FontAwesomeIcon
                className="text-green-700"
                icon={faBed}
              ></FontAwesomeIcon>
              <p>{listing.bedroom} Beds</p>
            </div>
            <div className="flex gap-2 items-center font-bold text-sm">
              <FontAwesomeIcon
                className="text-green-700"
                icon={faBath}
              ></FontAwesomeIcon>
              <p>{listing.bathroom} Baths</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
