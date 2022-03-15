import React from 'react';
import MyGroup from '../components/myGroups';
import NavigationBar from '../components/navBar';
import UserGroupList from '../components/UserGroupList';

function findGroups() {
    return (
        <div className="">
            <NavigationBar />
            <UserGroupList />
            <allGroupsList />
        </div>
    );
}

export default findGroups;
