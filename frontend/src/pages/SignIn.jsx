import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa'; // Import icons from Font Awesome
import { Loading } from '../elements/Loading/Loading';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3001/users/login", formData);
      console.log("Login Successful");
    } catch (err) {
      console.error(`There is an error: ${err}`);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
  }

  const handleFacebookSignIn = () => {
    // Implement Facebook sign-in logic here
  }

  const handleTwitterSignIn = () => {
    // Implement Twitter sign-in logic here
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        {renderInput('email', 'Email', formData, handleChange, 'email')}
        {renderInput('password', 'Password', formData, handleChange, 'password')}
        {error && <div className='text-red-500 mb-4'>{error}</div>}
        <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full'>
          {isLoading ? <Loading /> : "Sign In"}
        </button>
        <div>
          Forget your password! <Link className='font-bold hover:text-blue-500' to='/resetpassword'>restPassword</Link>
        </div>
        <div className="mt-4 text-center">
          <p></p>
          <div className="flex flex-col gap-3 justify-center mt-2">
            <button className="mr-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full flex " onClick={handleGoogleSignIn}>
              <FaGoogle className="mr-2" /> Sign in with Google
            </button>
            <button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full flex " onClick={handleFacebookSignIn}>
              <FaFacebook className="mr-2" /> Sign in with Facebook
            </button>
            <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg w-full flex" onClick={handleTwitterSignIn}>
              <FaTwitter className="mr-2" /> Sign in with Twitter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const renderInput = (name, placeholder, formData, handleChange, type = 'text') => {
  return (
    <input 
      type={type} 
      name={name} 
      placeholder={placeholder} 
      value={formData[name]} 
      onChange={handleChange} 
      autoFocus={name === 'email'} 
      required 
      className='input-field w-full' 
    />
  );
}

export default SignIn;
