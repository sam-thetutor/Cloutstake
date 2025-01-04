import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiLogOut, FiMenu } from 'react-icons/fi';
import { HOST, whiteListedCanisters } from '../Utils/constants';
import Logo from "../assets/clout.png"
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedInUser"],
  });

  useEffect(() => {
    verifyConnection();
  }, []);

  const verifyConnection = async () => {
    if (await window.ic.plug.isConnected()) {
      queryClient.setQueryData(["loggedInUser"], {
        authenticatedAgent: window.ic.plug.agent,
        userPrincipal: window.ic.plug.principalId,
        userAccountId: window.ic.plug.accountId
      });
      navigate("/dashboard");
    }
  };

  const handleLogout = async () => {
    queryClient.setQueryData(["loggedInUser"], null);
    window.ic.plug.disconnect();
    navigate("/");
  };

  const logg = async () => {
    try {
      await window.ic.plug.requestConnect({
        whitelist: whiteListedCanisters,
        host: HOST,
        timeout: 50000
      });

      queryClient.setQueryData(["loggedInUser"], {
        authenticatedAgent: window.ic.plug.agent,
        userPrincipal: window.ic.plug.principalId,
        userAccountId: window.ic.plug.accountId
      });

      navigate("/dashboard");
    } catch (error) {
      console.log("error in connecting plug wallet:", error);
    }
  };

  return (
    <div className="relative w-full px-4 flex border-b-2 bg-[#0f1318]">
      <div className="flex justify-between p-1 w-full">
        <div className='h-14 w-14'>

        <img src={Logo} alt="" />
        </div>
        <div className="md:hidden flex items-center">
          <button className='bg-transparent' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu className="text-2xl" color='white' />
          </button>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {loggedInUser ? (
            <button onClick={handleLogout} className="flex items-center bg-transparent border border-gray-200 text-white">
              <FiLogOut className="mr-2" /> Logout
            </button>
          ) : (
            
            <button onClick={logg} className="flex hover:outline-none items-center bg-transparent border border-gray-200 text-white ">
              Connect
               <FiLogIn className="ml-1" />
            </button>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute z-50 flex flex-col items-end space-y-2  bg-transparent mt-12  w-full p-4">
          {loggedInUser ? (
            <button onClick={handleLogout} className="flex items-center">
              <FiLogOut className="mr-2" /> Logout
            </button>
          ) : (
            <button onClick={logg} className="flex items-center">
              Connect <FiLogIn className="ml-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
