import React from 'react';
import UserProfile from '../components/userProfile';
import NavigationBar from '../components/navBar';

function profile() {
  return (
    <div className="" style={{backgroundColor: "#f0f2f5"}}>
      <NavigationBar />
      <UserProfile />
    </div>

  )
}

export default profile;

