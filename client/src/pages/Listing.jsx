import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Contact from "./Contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarked,
  faBed,
  faBath,
  faParking,
  faCouch,
} from "@fortawesome/free-solid-svg-icons";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contact,setcontact] = useState(false);
  const currentUser = useSelector((state) => state.user);
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
          <div className="flex justify-center flex-col">
            <div className="font-semibold text-2xl m-3 mx-auto max-w-4xl">
              <span>{listing.name}</span>
              <span>-$</span>
              <span>
                {listing.offer ? +listing.discountPrice : +listing.regularPrice}OFF
              </span>
              <span>/month</span>

              <p className="flex items-center gap-2 text-slate-600 my-2 text-sm">
                <FontAwesomeIcon
                  icon={faMapMarked}
                  className="text-green-700"
                />
                {listing.address}
              </p>
              <div className=" flex gap-4">
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
              <p className="mx-auto text-slate-800 max-w-4xl">
                <span className="font-bold text-black text-lg ">
                  Description -{" "}
                </span>
                <span className="font-normal">{listing.description}</span>
              </p>
              <ul className="mx-auto my-3 text-green-800 whitespace-nowrap font-semibold flex flex-wrap gap-2 items-center sm:gap-4">
                <li className="  flex items-center gap-1">
                  <FontAwesomeIcon icon={faBed} className="mx-2" />
                  {listing.bedroom > 1
                    ? `${listing.bedroom} beds`
                    : `${listing.bedroom} bed`}
                </li>
                <li>
                  <FontAwesomeIcon icon={faBath} className="mx-2" />
                  {listing.bathroom > 1
                    ? `${listing.bathroom} baths`
                    : `${listing.bathroom} bath`}
                </li>
                <li>
                  <FontAwesomeIcon icon={faParking} className="mx-2" />
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
                <li>
                  <FontAwesomeIcon icon={faCouch} className="mx-2" />
                  {listing.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>
            </div>
          </div>
          {currentUser &&
          !contact &&
          currentUser.currentUser &&
          listing.userRef !== currentUser.currentUser._id ? (
            <div className="flex justify-center">
              <button
                onClick={()=>setcontact(true)}
                type="button"
                className="mx-6 bg-slate-900 items-center p-3 rounded-lg text-white font-semibold w-[500px] uppercase hover:opacity-80"
              >
                Contact Landlord
              </button>
            </div>
          ) : null}
          {contact ? <Contact listing={listing}/> : null}
        </>
      ) : (
        ""
      )}
    </main>
  );
}
