import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice.js";

export const Profile = () => {
  const userphoto = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setfile] = useState(undefined);
  const [filePresentage, setfilePresentage] = useState(0);
  const [FileError, setFileError] = useState(false);
  const [FormData, setFormData] = useState({});
  const [UpdateSuccess, SetUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const StorageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(StorageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePresentage(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((DownloadUrl) => {
          setFormData({ ...FormData, avatar: DownloadUrl });
          setFileError(false);
        });
      }
    );
  };

  const handlechange = (e) => {
    setFormData({ ...FormData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        SetUpdateSuccess(false);
        return;
      }
      dispatch(updateSuccess(data));
      SetUpdateSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
      SetUpdateSuccess(false);
    }
  };
  const handleDeleteUser = async() => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess(data.message));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };
  const handleSignOut = async(e) => {
    e.preventDefault();
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data.message));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          onChange={(e) => {
            setfile(e.target.files[0]);
          }}
          type="file"
          ref={userphoto}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => userphoto.current.click()}
          className="rounded-full h-20 w-20 object-cover cursor-pointer self-center mt-5"
          src={FormData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-center text-sm">
          {filePresentage > 0 && filePresentage < 100 && !FileError ? (
            <span className="text-green-500">Uploading {filePresentage}%</span>
          ) : filePresentage === 100 && !FileError ? (
            <span className="text-green-500">Uploaded</span>
          ) : (
            ""
          )}
          {FileError && (
            <span className="text-red-500">
              Something went wrong(image must be less than 2mb)
            </span>
          )}
        </p>
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          placeholder="username"
          onChange={handlechange}
        />
        <input
          type="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          placeholder="email"
          onChange={handlechange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          id="password"
          placeholder="password"
          onChange={handlechange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
        >
          {loading ? "loading" : "update account"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-500 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-500 mt-5">{error ? error : ""}</p>
      <p className="text-green-500 mt-5">{UpdateSuccess ? "updated successfully":""}</p>
    </div>
  );
};
