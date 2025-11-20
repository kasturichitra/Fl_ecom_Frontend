import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-blue-600">404</h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-2 text-gray-600 text-lg">
          The page you were looking for doesn't exist or was removed.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
