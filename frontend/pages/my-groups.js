import React from 'react';
import MyGroup from '../components/myGroups';
import NavigationBar from '../components/navBar';

function myGroups() {
    return (
        <div className="" style={{backgroundColor: "#f0f2f5"}}>
            <NavigationBar />
            <MyGroup />
        </div>
    );
}

export default myGroups;
