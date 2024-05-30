import React from "react";
import { useSelector } from "react-redux";
import { useRef,useState,useEffect } from "react";
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase.js";

export const Profile = () => {
  const userphoto = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setfile] = useState(undefined);
  const [filePresentage, setfilePresentage] = useState(0);
  const [FileError, setFileError] = useState(false);
  const [FormData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
       handleFileUpload(file);
    }
  },[file]);
  const handleFileUpload =(file)=>{
    const storage= getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const StorageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(StorageRef,file);
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setfilePresentage(Math.round(progress));
    },
    (error)=>{
      console.log(error);
      setFileError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
       (DownloadUrl)=>{
         setFormData({...FormData,avatar:DownloadUrl});
         setFileError(false);
       }
      );
   }
    );
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-2">
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
          className="rounded-full h-30 w-30 object-cover cursor-pointer self-center mt-5"
          src={FormData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-center text-sm">
          {filePresentage > 0 && filePresentage < 100 && !FileError
           ? <span className="text-green-500">Uploading {filePresentage}%</span>
            : filePresentage === 100 && !FileError
           ? <span className="text-green-500">Uploaded</span>
            : ""}
            {FileError && <span className="text-red-500">Something went wrong(image must be less than 2mb)</span>}

        </p>
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="username"
          placeholder="username"
        />
        <input
          type="email"
          className="border p-3 rounded-lg"
          id="email"
          placeholder="email"
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          id="password"
          placeholder="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
          Update Account
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer">Delete Account</span>
        <span className="text-red-500 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};
