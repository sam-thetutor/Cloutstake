import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { BACKEND_CANISTER_ID } from '../Utils/constants';
import { idlFactory as BackIDL } from '../Utils/backend.did';
import { ClipLoader } from 'react-spinners';

const Staked = ({ userStakeAmount, setRefreshClout }) => {
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedInUser"],
  });
  const handleUnstake = async () => {
   if(!loggedInUser) return;
   if(!unstakeAmount) return;
    setIsLoading(true);

    try {

      //create the backend actor
      let backendActor = await window.ic.plug.createActor({
        canisterId: BACKEND_CANISTER_ID,
        interfaceFactory: BackIDL,
      });

      //unstake the tokens

      let unstakeRes = await backendActor.unstake_tokens(
        Number(unstakeAmount)*1e8
      )

      console.log("unstake response :",unstakeRes)



    } catch (error) {
      console.log("error in unstaking tokens :",error)
      
    }
    // Add logic to handle unstaking tokens here


    // After unstaking, refresh the clout balance
    setRefreshClout(Math.random());
    setIsUnstakeModalOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="bg-[#1a2028] p-4 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-white">Staked CLOUT Tokens</h2>
      <p className="text-white">Staked: {userStakeAmount && Number(userStakeAmount)} CLOUT</p>
      <div className="flex justify-end mt-3">
        <button className="bg-[#020202] text-white p-2 rounded" onClick={() => setIsUnstakeModalOpen(true)}>
          Unstake
        </button>
      </div>
      {isUnstakeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-black mb-4">Unstake CLOUT</h2>
            <input
              type="number"
              placeholder="Amount"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white p-2 rounded mr-2"
                onClick={() => setIsUnstakeModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleUnstake}
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader size={20} color="white" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staked;
