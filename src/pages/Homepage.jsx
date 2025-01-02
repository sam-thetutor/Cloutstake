import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import Img from "../assets/clout.png";
import { useIdentityKit } from '@nfid/identitykit/react';

const Homepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {connect} = useIdentityKit()

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className='relative w-full h-screen flex justify-center items-center'>
      <div className='absolute top-0 w-full h-1/2 bg-red-500 flex justify-between p-4'>

      <div className='flex justify-between p-1 w-full'>


        <div className='text-white text-2xl'>Logo</div>
        <div>
          {isLoggedIn ? (
              <div className='flex items-center space-x-4'>
              <FaUserCircle className='text-white text-2xl' />
              <button onClick={handleLogout} className='text-white flex items-center'>
                <FiLogOut className='mr-2' /> Logout
              </button>
            </div>
          ) : (
              <button onClick={connect} className='text-black flex items-center'>
             Connect <FiLogIn className='ml-1' /> 
            </button>
          )}
        </div>
          </div>

      </div>
      <div className='absolute bottom-0 w-full h-1/2 bg-blue-500'></div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <img src={Img} alt='Centered' className='w-40 h-40 rounded-full object-cover' />
      </div>
    </div>
  );
}

export default Homepage;
