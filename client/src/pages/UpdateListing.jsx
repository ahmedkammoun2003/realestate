import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {useSelector} from "react-redux";
import {useNavigate,useParams} from "react-router-dom"

export default function UpdateListing() {
  const navigate = useNavigate();
  const Params = useParams();
  const currentUser = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    type: "rent",
    regularPrice: 0,
    discountPrice: 0,
    address: "",
    offer: false,
    parking: false,
    furnished: false,
    bedroom: 1,
    bathroom: 1,
  });
  const [fileError, setFileError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const ListingId = Params.listingId;
        const res = await fetch(`/api/listings/get/${ListingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        setError("Failed to fetch listing");
      }
    };
    fetchListing();
  }, []);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      const promises = [];
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setFileError(false);
          setUploading(false);
        })
        .catch((err) => {
          setFileError("Image upload error (2 MB per image)");
          setUploading(false);
        });
    } else {
      setFileError("Images must be 6 at most per listing");
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageDelete = (index) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls.splice(index, 1);
    setFormData({ ...formData, imageUrls: newImageUrls });
  };
  const handlechange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.id === "regularPrice" ||
      e.target.id === "discountPrice" ||
      e.target.id === "bedroom" ||
      e.target.id === "bathroom"
    ) {
      setFormData({
       ...formData,
        [e.target.id]: Number(e.target.value),
      });
    }
    if (e.target.id === "name" || e.target.id === "description" || e.target.id === "address") {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
      setError("At least one image is required");
      return;
    }
    if (formData.regularPrice < formData.discountPrice) {
      setError("Regular price must be greater than or equal to discount price");
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listings/edit/${Params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listings/${data._id}`);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className="p-3 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Edit a listing
      </h1>
      <form className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-3 flex-1">
          <input
            onChange={handlechange}
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
          />
          <input
            onChange={handlechange}
            type="textarea"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            required
            value={formData.description}
          />
          <input
            onChange={handlechange}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            required
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handlechange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handlechange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handlechange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handlechange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handlechange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="items-center flex gap-2">
              <input
                onChange={handlechange}
                type="number"
                id="bedroom"
                min="1"
                max="10"
                required
                className="p-3 rounded-lg border"
                value={formData.bedroom}
              />
              <span>Beds</span>
            </div>
            <div className="items-center flex gap-2">
              <input
                onChange={handlechange}
                type="number"
                id="bathroom"
                min="1"
                max="10"
                className="p-3 rounded-lg border"
                value={formData.bathroom}
              />
              <span>Baths</span>
            </div>
            <div className="items-center flex gap-2">
              <input
                onChange={handlechange}
                type="number"
                id="regularPrice"
                className="p-3 rounded-lg border"
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer ?
            <div className="items-center flex gap-2">
              <input
                onChange={handlechange}
                type="number"
                id="discountPrice"
                max={formData.regularPrice}
                className="p-3 rounded-lg border"
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <span>Discounted Price</span>
                <span className="text-xs">($ / month)</span>
              </div>
            </div> :""}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-5">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="p-3 border-gray-400 rounded w-full"
              onChange={(e) => {
                setFiles(e.target.files);
              }}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-600 border border-green-600 rounded uppercase hover:shadow-lg disabled:opacity-75"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-500">{fileError ? fileError : ""}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div className="flex items-center justify-between p-3 border" key={url}>
                  <img
                    src={url}
                    className="w-20 h-20 object-contain rounded-lg "
                    alt="listing image"
                  />
                  <button
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95"
                    type="button"
                    onClick={() => handleImageDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button disabled={loading || uploading} onClick={handleSubmit} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? 'Editing...' : 'Edit Listing'}
          </button>
          <p className="text-red-500">{error ? error : ""}</p>
        </div>
      </form>
    </main>
  );
}
