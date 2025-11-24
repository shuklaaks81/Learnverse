import React from "react";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800 text-white p-8">
      <div className="max-w-xl w-full bg-black/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center border-4 border-red-700">
        <h1 className="text-4xl font-bold mb-6 text-red-400 animate-pulse">🚧 Sorry!</h1>
        <p className="mb-6 text-center text-lg text-red-200">
          The Learnverse is not available due to errors stopping it.<br/>
          It will be available shortly, or in a month, or possibly a year!<br/>
          (A year is very unlikely!)
        </p>
      </div>
    </div>
  );
}
