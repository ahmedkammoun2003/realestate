import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../component/ListingCard";

export default function Search() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState([]);
  console.log(listing);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchTerm = searchParams.get("searchTerm");
    const type = searchParams.get("type");
    const parking = searchParams.get("parking");
    const furnished = searchParams.get("furnished");
    const offer = searchParams.get("offer");
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");

    setSearchData({
      searchTerm: searchTerm || "",
      type: type || "all",
      parking,
      furnished,
      offer,
      sort: sort || "createdAt",
      order: order || "desc",
    });
    const fetchListing = async () => {
      try {
        const searchQuery = searchParams.toString();
        setloading(true);
        setError(false);
        const res = await fetch(`/api/listings/search?${searchQuery}`);

        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setloading(false);
          console.log(data);
          return;
        }
        setListing(data);
        setloading(false);
      } catch (error) {
        setError(true);
        setloading(false);
        console.log(error);
      }
    };
    fetchListing();
  }, [window.location.search]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSearchData({ ...searchData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setSearchData({ ...searchData, [e.target.id]: e.target.checked });
    }
    if (e.target.id === "searchTerm") {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setSearchData({ ...searchData, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const ParamUrl = new URLSearchParams();
    ParamUrl.set("searchTerm", searchData.searchTerm);
    ParamUrl.set("sort", searchData.sort);
    ParamUrl.set("order", searchData.order);
    ParamUrl.set("type", searchData.type);
    ParamUrl.set("parking", searchData.parking);
    ParamUrl.set("furnished", searchData.furnished);
    ParamUrl.set("offer", searchData.offer);
    const searchQuery = ParamUrl.toString();
    navigate(`/search?${searchQuery}`, { replace: true });
  };
  return (
    <div className="flex flex-col md:flex-row md:min-h-screen">
      <div className="p-7 border-b-2 md:border-r-2">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-1">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              name="searchTerm"
              id="searchTerm"
              placeholder="searching..."
              className="border w-full rounded-lg p-3"
              value={searchData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-5 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={searchData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={searchData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={searchData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={
                  searchData.offer === true || searchData.offer === "true"
                }
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex gap-5 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={
                  searchData.parking === true || searchData.parking === "true"
                }
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={
                  searchData.furnished === true ||
                  searchData.furnished === "true"
                }
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              value={searchData.sort + "_" + searchData.order}
            >
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80">
            Search
          </button>
        </form>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
        <div className="p-7 w-full flex flex-wrap gap-5">
          {!loading && listing.length === 0 ? (
            <p className="text-xl text-slate-700 ">No listing found</p>
          ) : null}
          {loading ? (
            <p className="text-xl text-slate-700 text-center">loading...</p>
          ) : null}
          {!loading && !error && listing ? listing.map((house)=><ListingCard key={house._id} listing={house} />):null}
        </div>
      </div>
    </div>
  );
}
