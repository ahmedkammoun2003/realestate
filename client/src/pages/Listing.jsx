import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarked,faBed, faBath, faParking,faCouch } from "@fortawesome/free-solid-svg-icons";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const Params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const ListingId = Params.listingId;
        const res = await fetch(`/api/listings/get/${ListingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        return;
      }
    };
    fetchListing();
  }, []);
  return (
    <main className="">
      <p className="text-green-700 my-5 text-2xl">
        {loading ? "loading..." : ""}
      </p>
      <p className="text-red-700 my-5 text-2xl">
        {error ? "an error happened" : ""}
      </p>
      {listing && !error && !loading ? (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="h-[550px] bg-black items-center flex justify-center">
                  <img
                    src={image}
                    alt={listing.name}
                    className=" h-[550px] object-cover "
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="font-semibold text-2xl m-3">
            <span>{listing.name}</span>
            <span>-$</span>
            <span>
              {listing.offer ? +listing.discountPrice : +listing.regularPrice}
            </span>
            <span>/month</span>
          </div>
          <p className="flex items-center m-6 gap-2 text-slate-600 my-2 text-sm">
            <FontAwesomeIcon icon={faMapMarked} className="text-green-700" />
            {listing.address}
          </p>
          <div className="m-6 flex gap-4">
            <p className="bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-lg ">
              {listing.type == "rent" ? "ForRent" : "For Sale"}
            </p>
            <p className="bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-lg ">
              $
              {listing.offer
                ? +listing.regularPrice - +listing.discountPrice
                : ""}
            </p>
          </div>
          <p className="mx-6 text-slate-800">
              <span className="font-semibold text-black text-lg ">
                Description -{" "}
              </span>
              {listing.description}
          </p>
          <ul className="mx-6 my-3 text-green-800 whitespace-nowrap font-semibold flex flex-wrap gap-2 items-center sm:gap-4">
                <li className="  flex items-center gap-1">
                  <FontAwesomeIcon icon={faBed} className="mx-2" />
                  {listing.bedroom > 1 ? 
                  `${listing.bedroom} beds` : 
                  `${listing.bedroom} bed` }
                </li>
                <li>
                <FontAwesomeIcon icon={faBath} className="mx-2" />
                  {listing.bathroom > 1 ? 
                  `${listing.bathroom} baths` : 
                  `${listing.bathroom} bath` }
                </li>
                <li>
                <FontAwesomeIcon icon={faParking} className="mx-2" />
                  {listing.parking ? 
                  "Parking spot": 
                  "No Parking" }
                </li>
                <li>
                  <FontAwesomeIcon icon={faCouch} className="mx-2" />
                  {listing.furnished? 
                  "Furnished" : 
                  "Not Furnished" }
                </li>
          </ul>
        </>
      ) : (
        ""
      )}
    </main>
  );
}
