import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [fileError, setFileError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setLoading(true);
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
          setLoading(false);
        })
        .catch((err) => {
          setFileError("image upload error (2 mb per image)");
          setLoading(false);
        });
    } else {
      setFileError("images must be 6 at most per listing");
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          
        },
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

  return (
    <main className="p-3 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-3 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="textarea"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="Furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="Offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="items-center flex gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 rounded-lg border"
              />
              <span>Beds</span>
            </div>
            <div className="items-center flex gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                className="p-3 rounded-lg border"
              />
              <span>Baths</span>
            </div>
            <div className="items-center flex gap-2">
              <input
                type="number"
                id="RegularPrice"
                className="p-3 rounded-lg border"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="items-center flex gap-2">
              <input
                type="number"
                id="DiscountedPrice"
                className="p-3 rounded-lg border"
              />
              <div className="flex flex-col items-center">
                <span>Discounted Price</span>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
              disabled={loading}
              className="p-3 text-green-600 border border-green-600 rounded uppercase hover:shadow-lg disabled:opacity-75"
            >
              {loading ? 'uploading...':'upload'}
            </button>
          </div>
          <p className="text-red-500">{fileError ? fileError : ""}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div className="flex items-center justify-between p-3 border">
                  <img
                    src={url}
                    key={url}
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
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
