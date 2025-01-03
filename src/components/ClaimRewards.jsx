import React, { useState } from "react";
import Countdown from "react-countdown";
import { BACKEND_CANISTER_ID } from "../Utils/constants";
import { idlFactory as BackIDL } from "../Utils/backend.did";
import { ClipLoader } from "react-spinners";
import RewardHistory from "./RewardHistory";

const ClaimRewards = ({ userStakedRewards, stakedStartTime, setRefreshClout, userRewardHistory }) => {
  const [isLoading, setIsLoading] = useState(false);
  const TIMER_DURATION = 24 * 60 * 60 * 1000; // 24 hours in seconds
  const END_TIME = Date.now() + TIMER_DURATION * 1000;
  const START_TIME = stakedStartTime / 1e6 + TIMER_DURATION; // Static start time more than 24 hours from today

  const handleClaimRewards = async () => {
    setIsLoading(true);
    try {
      let backendActor = await window.ic.plug.createActor({
        canisterId: BACKEND_CANISTER_ID,
        interfaceFactory: BackIDL,
      });

      let claimRes = await backendActor.claim_rewards();
      if(claimRes.ok){
        alert("Rewards claim successful")

      }else{
        alert(claimRes.err)
      }
    
      console.log("claim response:", claimRes);
      setRefreshClout(Math.random());
    } catch (error) {
      console.log("error in claiming rewards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a2028] p-4 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-white">Total Rewards</h2>
      <p className="text-white">
        {userStakedRewards ? Number(userStakedRewards)?.toFixed(4) : 0} CLOUT
      </p>
      <div className="flex justify-end mt-3">
        <button
          className="bg-[#020202] text-white p-2 rounded"
          onClick={handleClaimRewards}
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="white" /> : "Claim"}
        </button>
      </div>
      {/* <RewardHistory userRewardHistory={userRewardHistory} /> */}
    </div>
  );
};

export default ClaimRewards;
