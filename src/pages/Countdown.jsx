import React, { useState, useEffect } from 'react';
import Countdown from 'react-countdown';

const TIMER_DURATION = 24 * 60 * 60 * 1000; // 24 hours in seconds
const END_TIME = Date.now() + TIMER_DURATION * 1000;
const START_TIME = 1735811172236 + TIMER_DURATION; // Static start time more than 24 hours from today
const Count = () => {
  
  const Completionist = () => <span>You are good to go!</span>;

  console.log(Date.now())

  return (
    <div className='flex flex-col items-center min-w-full justify-center min-h-screen bg-gray-900 text-white font-sans'>
      <div className='text-4xl mb-4'>
        CLOUT Token website
      </div>
      <div className='text-6xl'>

      <Countdown date={START_TIME } >
        <Completionist/>
        </Countdown>
      </div>

      <span className=''>coming soon....</span>
    </div>
  );
}

export default Count;
