import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import {createActor} from "../Utils/createActor"
import { MY_LEDGER_CANISTER_ID } from '../Utils/constants';
import {idlFactory as ICPDL} from "../Utils/icptoken.did"
import { Principal } from '@dfinity/principal';
import { ClipLoader } from "react-spinners"; // Add this import

const IcpBalance = () => {
    const [icpBalance, setIcpBalance] = useState(0);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); // Add this state
    const [recipient, setRecipient] = useState(""); // Add this state
    const [amount, setAmount] = useState(""); // Add this state
    const [isLoading, setIsLoading] = useState(false); // Add this state

    const { data: loggedInUser } = useQuery({
        queryKey: ["loggedInUser"],
      });

    useEffect(()=>{
        fetchIcpBalance()
    },[loggedInUser])

    const fetchIcpBalance = async () => {
        if(!loggedInUser) return;
        try {
            let icpActor = createActor(MY_LEDGER_CANISTER_ID,ICPDL,loggedInUser.authenticatedAgent)
            let userBalance = await icpActor.icrc1_balance_of({
                owner:Principal.fromText(loggedInUser.userPrincipal),
                subaccount:[]
            })
            console.log("user balance :",userBalance)
            setIcpBalance(Number(userBalance)/1e8)
        } catch (error) {
            console.log("error in fetching user icp balance :",error)
        }
    }

    const handleWithdraw = async () => {
        if (!loggedInUser) return;
        setIsLoading(true);
        try {
            let icpActor = await window.ic.plug.createActor({
                canisterId: MY_LEDGER_CANISTER_ID,
                interfaceFactory: ICPDL,
            });

            let transferResults = await icpActor.icrc1_transfer({
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
            fetchIcpBalance();
        } catch (error) {
            console.log("error in withdrawing icp:", error);
        } finally {
            setIsLoading(false);
            setIsWithdrawModalOpen(false);
        }
    }

  return (
    <div className="bg-[#1a2028] p-4 rounded-lg w-full max-w-md mx-auto">
        <h2 className="text-white">ICP Balance</h2>
        <p className="text-white"> {icpBalance?.toFixed(4)} ICP</p>
        <div className="flex mt-3 justify-end">
            <button className="bg-[#020202] text-white p-2 rounded" onClick={() => setIsWithdrawModalOpen(true)}>
                Withdraw
            </button>
        </div>
        {isWithdrawModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white mx-5 p-6 rounded-lg w-full max-w-sm ">
                    <h2 className="text-black mb-4">Withdraw ICP</h2>
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
    </div>
  )
}

export default IcpBalance
