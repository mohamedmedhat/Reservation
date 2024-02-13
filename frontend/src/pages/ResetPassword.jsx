import React from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-white">
        <button className="bg-blue-500 rounded-md border py-2 px-4 w-full m-2">
          <Link to='/reset-passwordby-email'>
           Reset by Email
          </Link>
        </button>
        <button className="bg-blue-500 rounded-md border py-2 px-4 w-full m-2">
          <Link to='/reset-passwordby-sms'>
           Reset by SMS
          </Link>
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
