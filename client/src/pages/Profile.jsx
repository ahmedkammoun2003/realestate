import React from "react";
import { useSelector } from "react-redux";

export const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-2">
        <img
          className="rounded-full h-7 w-7 object-cover cursor-pointer self-center mt-5"
          src={currentUser.avatar}
          alt="profile"
        />
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
