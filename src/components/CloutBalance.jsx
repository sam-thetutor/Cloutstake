import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { idlFactory as CloutDL } from "../Utils/icrcledger.did";
import { idlFactory as BackIDL } from "../Utils/backend.did";
import { BACKEND_CANISTER_ID, CLOUT_CANISTER_ID } from "../Utils/constants";
import { createActor } from "../Utils/createActor";
import { Principal } from "@dfinity/principal";
import { ClipLoader } from "react-spinners";

const CloutBalance = ({refreshClout,setRefreshClout}) => {
  const [cloutBalance, setCloutBalance] = useState(0);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedInUser"],
  });

  useEffect(() => {
    fetchCloutBalance();
  }, [loggedInUser,refreshClout]);

  const fetchCloutBalance = async () => {
    //if there is no user, return
    if (!loggedInUser) return;
    try {
      //create the actor instyance for clout
      let cloutActor = createActor(
        CLOUT_CANISTER_ID,
        CloutDL,
        loggedInUser.authenticatedAgent
      );

      //fetch the clout balance
      let userBalance = await cloutActor.icrc1_balance_of({
        owner: Principal.fromText(loggedInUser.userPrincipal),
        subaccount: [],
      });

      console.log("user clout balance :", userBalance);
      setCloutBalance(Number(userBalance) / 1e8);
    } catch (error) {
      console.log("error in fetching user clout balance :", error);
    }
  };

  
  const handleWithdraw = async () => {
    if (!loggedInUser) return;
    setIsLoading(true);
    try {
        let cloutActor = await window.ic.plug.createActor({
            canisterId: CLOUT_CANISTER_ID,
            interfaceFactory: CloutDL,
          });

      let transferResults = await cloutActor.icrc1_transfer({
        to: {
            owner: Principal.fromText(recipient),
            subaccount: [], 
        },
        
        amount: Number(amount * 1e8),
        fee: [], // example fee
        memo: [],
        from_subaccount: [],
        created_at_time: [],
      });
      console.log("transfer results :", transferResults);

      if(transferResults.Ok){
        alert("Transfer successful")
      }
    //   setIsWithdrawModalOpen(false);
      fetchCloutBalance();
    } catch (error) {
      console.log("error in withdrawing clout:", error);
    } finally {
      setIsLoading(false);
    }
  };







  const handleStake = async () => {
    if (!loggedInUser) return;
    setIsLoading(true);

    //check if the amount is not null
    if (!stakeAmount) return;


    let backendActor = await window.ic.plug.createActor({
        canisterId: BACKEND_CANISTER_ID,
        interfaceFactory: BackIDL,
      });


    let cloutActor = await window.ic.plug.createActor({
        canisterId: CLOUT_CANISTER_ID,
        interfaceFactory: CloutDL,
      });

    try {
      //approve the backend to transfer the funds from the user
      let approveResults = await cloutActor.icrc2_approve({
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: Number(stakeAmount) * 1e8 + 20000,
        expected_allowance: [],
        expires_at: [],
        spender: {
          owner: Principal.fromText(BACKEND_CANISTER_ID),
          subaccount: [],
        },
      });
      //call the backend canister to stake the tokens
      let stakeResults = await backendActor.stake_tokens( Number(stakeAmount) * 1e8);
      console.log("stake results :", stakeResults);

      setIsStakeModalOpen(false);
      fetchCloutBalance();
    } catch (error) {
      console.log("error in staking clout:", error);
    } finally {
      setIsLoading(false);
      setRefreshClout(Math.random())
    }
  };

  return (
    <div className="bg-[#1a2028] p-4 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-white">CLOUT Balance</h2>
      <p className="text-white"> {cloutBalance?.toFixed(8)} CLOUT</p>
      <div className="flex justify-end mt-3">
        <button
          className="bg-[#020202] text-white p-2 rounded mr-2"
          onClick={() => setIsStakeModalOpen(true)}
        >
          Stake
        </button>
        <button
          className="bg-[#020202] text-white flex p-2 rounded"
          onClick={() => setIsWithdrawModalOpen(true)}
        >
          Withdraw
        </button>
      </div>
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white mx-5 p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-black mb-4">Withdraw CLOUT</h2>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white p-2 rounded mr-2"
                onClick={() => setIsWithdrawModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleWithdraw}
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader size={20} color="white" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isStakeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-black mb-4">Stake CLOUT</h2>
            <input
              type="number"
              placeholder="Amount"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white p-2 rounded mr-2"
                onClick={() => setIsStakeModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleStake}
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

export default CloutBalance;
