import React from 'react';
import AllGroupsList from '../components/allGroupsList';
import NavigationBar from '../components/navBar';
import {useState} from "react";
import { Button, Container } from 'reactstrap';

const FindGroups = () => {
    const [query, setQuery] = useState("")

    return (
        <div className="">
            <NavigationBar />
            <Container fluid style={{ margin: "10px" }}>
    
            <AllGroupsList />
            </Container>
        </div>
    );
}


export default FindGroups;
