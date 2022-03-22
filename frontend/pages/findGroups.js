import React from 'react';
import AllGroupsList from '../components/allGroupsList';
import NavigationBar from '../components/navBar';
import {useState} from "react";
import { Button, Container, Card, Row, CardGroup, width } from 'reactstrap';

const FindGroups = () => {
    const [query, setQuery] = useState("")



const filterItem = (object) => {
    const newItem = Data.filter((newVal) => {
        return newVal.category ===curcat;
        // comparing category for displaying data
    });
    setItem(newItem);
};

    return (
        <div className="">
            {//Imports navBar component
            }
            <NavigationBar />

            <Container fluid style={{ margin: "10px", marginLeft: "0px" }}>
                <CardGroup>
                    <Card style={{minWidth: "400px"}}>
                        <AllGroupsList />
                    </Card>

                    <Card style={{minWidth: "300px", maxWidth: "350px"}}>
                        <div style={{margin: "10px"}}>
                            <h5>Filtrer gruppene</h5>
                            
                            <Button className="btn btn-dark">
                                Filtrer
                            </Button>

                        </div>
                    </Card>
                </CardGroup>
                
                
            </Container>
        </div>
    );
}


export default FindGroups;
