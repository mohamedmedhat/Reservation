import React from 'react';
import { Link } from 'react-router-dom';
import { links } from './links';

const Navbar = () => {
  return (
    <div className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Reservation website icon/image */}
        <img src='/images/hotel.gif' alt="logoimg" className="h-15 w-10" />

        {/* Navigation links */}
        <ul className="flex space-x-4">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                to={link.url}
                className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
