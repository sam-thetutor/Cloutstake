import React from 'react';
import Count from './pages/Countdown';
import Homepage from './pages/Homepage';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import { useIdentityKit } from '@nfid/identitykit/react';
import { useQuery } from '@tanstack/react-query';
import Navbar from './components/Navbar';

const App = () => {
  const {user} = useIdentityKit()
  const navigate = useNavigate()

  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedInUser"],
  });

  

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Homepage/>} />
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='*' element={<Error/>}/>
      {/* {loggedInUser != null && navigate('/dashboard')} */}

    </Routes>
    </>
  );
}

export default App;
