import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../elements/Loading/Loading';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { updateFormData } from '../redux/slices/FormDataSlice';
import { setLoading } from '../redux/slices/LoadingSlice';
import { setError } from '../redux/slices/errorSlice';
import { setPasswordStrength } from '../redux/slices/passwordStrengthSlice';

const SignUp = () => {
  // dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // selectors
  const formData = useSelector(state => state.formData)
  const isLoading = useSelector(state => state.Loading);
  const error = useSelector(state => state.error);
  const passwordStrength = useSelector(state => state.passwordStrength)
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({[name]: value}));
    if (name === 'password') {
      dispatch(setPasswordStrength(checkPasswordStrength(value)));
    }
  }

  const checkPasswordStrength = (password) => {
    const regexList = [
      /[a-z]/, // Lowercase letters
      /[A-Z]/, // Uppercase letters
      /[0-9]/, // Numbers
      /[^a-zA-Z0-9]/ // Special characters
    ];

    const instructions = [
      { text: 'Lowercase letters', done: false },
      { text: 'Uppercase letters', done: false },
      { text: 'Numbers', done: false },
      { text: 'Special characters', done: false }
    ];

    let strengthScore = 0;
    regexList.forEach((regex, index) => {
      if (regex.test(password)) {
        instructions[index].done = true;
        strengthScore++;
      }
    });

    let strengthLevel;
    if (password.length < 8 || strengthScore < 3) {
      strengthLevel = 'Weak';
    } else if (password.length < 12 || strengthScore < 4) {
      strengthLevel = 'Medium';
    } else {
      strengthLevel = 'Strong';
    }

    const percentage = (strengthScore / 4) * 100;

    return { level: strengthLevel, percentage, instructions };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(""));

    try {
      const res = await axios.post("http://localhost:3001/users/reg", formData);
      if(res.status === 200){
        console.log("Created Successfully");
        navigate("/signin");
      }
    } catch (err) {
      console.error(`There is an error: ${err}`);
      dispatch(setError("An error occurred. Please try again later."));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        {renderInput('name', 'Name', formData, handleChange)}
        {renderInput('lastname', 'Last Name', formData, handleChange)}
        {renderInput('phoneNumber', 'Phone Number', formData, handleChange)}
        {renderInput('age', 'Age', formData, handleChange, 'number')}
        {renderInput('email', 'Email', formData, handleChange, 'email')}
        {renderInput('password', 'Password', formData, handleChange, 'password')}
        {passwordStrength && renderPasswordStrength(passwordStrength)}
        {error && <div className='text-red-500 mb-4'>{error}</div>}
        <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full'>
          {isLoading ? <Loading /> : "Sign Up"}
        </button>
        <div>
          You have an account? <Link className='font-bold hover:text-blue-400' to='/signin'>signin</Link>
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
      autoFocus={name === 'name'} 
      required 
      className='input-field w-full' 
    />
  );
}

const renderPasswordStrength = (passwordStrength) => {
  return (
    <div className={`text-${getStrengthColor(passwordStrength.level)}-500 mb-2`}>
      <p className="mb-1">Password Strength: {passwordStrength.level} ({passwordStrength.percentage.toFixed(0)}%)</p>
      <ul className="list-disc pl-4">
        {passwordStrength.instructions.map((instruction, index) => (
          <li key={index} className={`text-${instruction.done ? 'green' : 'gray'}-500`}>
            {instruction.text} {instruction.done && <span className="ml-1">✔</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

const getStrengthColor = (strength) => {
  if (strength === 'Weak') {
    return 'red';
  } else if (strength === 'Medium') {
    return 'yellow';
  } else {
    return 'green';
  }
}

export default SignUp;
