'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


export default function NavBar() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  

  const handleSearch = () => {
    console.log("pq nao funciiiionaaa")
    router.push('/search'); 
  };

  const GoToHome = () => {
    router.push('/');
  }
  return (
    <nav className="flex items-center justify-between p-3 absolute top-0 left-0 w-full h-16 bg-transparent z-50">
      <div className="flex items-center ml-6 pl-2 pr-10  ">
        <img
          src="https://i.imgur.com/MnV5OqL.png"
          alt="Logo"
          className="h-12 w-auto"
        />
        <p className="text-white text-lg font-medium hover:text-gray-400 cursor-pointer ml-8 mt-2"
        onClick={() => GoToHome()}>
          Home
        </p>
      </div>

      <div
       className="mr-8 border border-white bg-transparent w-10 h-10 rounded-lg flex justify-center items-center"
       onClick={() => handleSearch()}
      >
        <FaSearch className="text-white text-base" />
      </div>
    </nav>
  );
}