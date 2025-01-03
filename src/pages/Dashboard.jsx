import { AccountIdentifier } from "@dfinity/ledger-icp";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { BACKEND_CANISTER_ID, CLOUT_CANISTER_ID, copyToClipboard, shortenAddress } from "../Utils/constants";
import { ClipLoader } from "react-spinners";
import { Principal } from "@dfinity/principal";
import { BsCopy } from "react-icons/bs";
import IcpBalance from "../components/IcpBalance";
import CloutBalance from "../components/CloutBalance";
import RewardHistory from "../components/RewardHistory";
import Staked from "../components/Staked";
import ClaimRewards from "../components/ClaimRewards";
import AccountPrincipal from "../components/AccountPrincipal";
import { idlFactory as BackIDL } from "../Utils/backend.did";

const Dashboard = () => {
  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedInUser"],
  });

  const [refreshClout, setRefreshClout] = useState("");
  const [userStakeAm,, setUserStakeInfo] = useState({});
  const [userStakeAmount, setUserStakeAmount] = useState(0);
  const [userStakedRewards, setUserStakedRewards] = useState(0);
  const [stakedStartTime, setStakedStartTime] = useState(0);
  const [userRewardHistory, setUserRewardHistory] = useState([]);



  useEffect(()=>{
    fetchStakedToknes()

  },[refreshClout])

  const fetchStakedToknes = async () => {
if(!loggedInUser) return;

    try {

      let backendActor = await window.ic.plug.createActor({
        canisterId: BACKEND_CANISTER_ID,
        interfaceFactory: BackIDL,
      })

      let stakeRes = await backendActor.get_user_stake_info(Principal.fromText(loggedInUser.userPrincipal))
      
      let rewardHistory = await backendActor.get_reward_history(Principal.fromText(loggedInUser.userPrincipal))

      if(rewardHistory.ok){
        setUserRewardHistory(rewardHistory.ok)
      }

      console.log("stake response :",stakeRes,rewardHistory)

      if(stakeRes.ok){

        setUserStakeAmount(Number(stakeRes?.ok?.amount)/1e8)
        setUserStakedRewards(Number(stakeRes?.ok?.rewards)/1e8)
        setStakedStartTime(Number(stakeRes?.ok?.startTime))
      }
      
    } catch (error) {
      console.log("error in fetching user staked tokens :",error)
      
    }

  }




  return (
    <div className="w-full min-h-screen bg-[#151719] flex justify-center">
      <div className="bg-[#0f1318] p-8 gap-4 flex flex-col rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <AccountPrincipal/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IcpBalance/>
          <CloutBalance setRefreshClout={setRefreshClout} refreshClout={refreshClout}/>
          <Staked setRefreshClout={setRefreshClout} userStakeAmount={userStakeAmount}/>
         <ClaimRewards setRefreshClout={setRefreshClout} userStakedRewards={userStakedRewards} stakedStartTime={stakedStartTime}/>
        </div>
        <RewardHistory userRewardHistory={userRewardHistory}/>
      </div>
    </div>
  );
};

export default Dashboard;
