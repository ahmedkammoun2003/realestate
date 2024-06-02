import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

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
      {listing && !error && !loading ? 
      (<>
        <Swiper navigation>
          {listing.imageUrls.map(
            (image, index) => (
              <SwiperSlide key={index}>
                <div className="h-[550px]">
                  <img src={image} alt={listing.name} className="items-center h-[550px] object-cover w-full"/>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </>) : ""}
    </main>
  );
}
