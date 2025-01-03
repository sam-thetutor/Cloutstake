import React from 'react';
import { convertTime } from '../Utils/constants';

const RewardHistory = ({ userRewardHistory }) => {

  return (
    <div className="overflow-x-auto max-h-96 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-400">Reward History</h1>
      <table className="min-w-full bg-[#1a2028] text-white   rounded-md border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 text-start border-b">Date</th>
            <th className="py-2 px-4 border-b text-start">Amount</th>
          </tr>
        </thead>
        <tbody>
          {userRewardHistory?.map((record, index) => (
            <tr key={index} className="hover:bg-gray-600">
              <td className="py-2 px-4 border-b">{convertTime(record.rewardTime)}</td>
              <td className="py-2 px-4 border-b">{(Number(record.amount)/1e8).toFixed(8)} CLOUT</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardHistory;
