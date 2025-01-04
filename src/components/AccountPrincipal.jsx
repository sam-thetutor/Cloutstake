import React from "react";
import { copyToClipboard, shortenAddress } from "../Utils/constants";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { BsCopy } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

const AccountPrincipal = () => {ß
  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedInUser"],
  });
  return (
    <div className="flex flex-col md:flex-row w-full gap-2 mx-4">
      <div className=" flex flex-col px-4 py-1 text-white  md:py-4 w-full">
        <span className="font-bold">Account Id:</span>

        {loggedInUser ? (
          <div className="flex flex-row gap-2   items-center">
            <span>
              {shortenAddress(
                AccountIdentifier.fromPrincipal({
                  principal: Principal.fromText(loggedInUser.userPrincipal),
                })?.toHex(),
                18
              )}
            </span>
            <BsCopy
              className="cursor-pointer"
              onClick={() =>
                copyToClipboard(
                  AccountIdentifier.fromPrincipal({
                    principal: Principal.fromText(loggedInUser.userPrincipal),
                  })?.toHex()
                )
              }
            />
          </div>
        ) : (
          <ClipLoader />
        )}
      </div>
      <div className=" flex flex-col px-4 py-2 text-white md:py-4 w-full">
        <span className="font-bold">Principal Address:</span>
        {loggedInUser && (
          <div className="flex flex-row gap-2  items-center">
            <span className="flex flex-row justify-center  items-center">
              {shortenAddress(loggedInUser?.userPrincipal?.toString(), 20)}
            </span>
            <BsCopy
              className="cursor-pointer"
              onClick={() =>
                copyToClipboard(loggedInUser?.userPrincipal?.toString())
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default AccountPrincipal;
