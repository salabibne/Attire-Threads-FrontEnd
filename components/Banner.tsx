import React from "react";

const Banner = () => {
  return (
    <div className="relative w-full h-[600px] bg-gray-200 mt-20 overflow-hidden">
      <img
        src="https://i.ibb.co.com/qL9yXsH9/Gemini-Generated-Image-81rw7y81rw7y81rw.png"
        alt="Collection Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">NEW COLLECTION</h1>
        <p className="text-xl md:text-2xl mb-8">Elevate your style with Attire Threads</p>
        <button className="px-8 py-3 bg-white text-primary-brown font-bold rounded-full hover:bg-gray-100 transition-colors uppercase tracking-widest">
            Shop Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
