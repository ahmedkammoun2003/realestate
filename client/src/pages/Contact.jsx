import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [Landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        console.log(listing.userRef);
        const res = await fetch(`http://localhost:3000/api/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchLandlord();
  }, []);
  console.log(message);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {Landlord ? (
        <div className="flex flex-col gap-2 text-lg mx-auto w-[500px]">
          <p>
            Contact <span className="font-semibold">{Landlord.username}</span>{" "}
            for <span className="font-semibold">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here ..."
            className="w-full border rouded-lg"
          ></textarea>
          <Link
            to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white p-3 text-center rounded-lg my-3 uppercase hover:opacity-95"
          >
            Send to landlord
          </Link>
        </div>
      ) : null}
    </>
  );
}
