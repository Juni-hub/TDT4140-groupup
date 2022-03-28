import { Card, CardBody, CardHeader, Container, Row } from "reactstrap";

import GroupMatchesList from "./groupMatchesList";
import React from "react";

const MatchedGroups = () => {

    const groups = [
        { title:'Gruppe 1', picture:'https://via.placeholder.com/150x100' },
        { title:'Gruppe 2', picture:'https://via.placeholder.com/150x100' },
        { title:'Gruppe 3', picture:'https://via.placeholder.com/150x100' },
    ];
    
    return (
        <div>
            <Container style={{ padding: "10px", height:"90vh"}}>

                 {//Maps every group component to myGroups-page
                 }   
                <Card>
                    <CardHeader style={{fontSize:"22px", backgroundColor:"#ABD08D"}}>
                        Matchede Grupper:
                    </CardHeader>
                    <CardBody> 
                        <GroupMatchesList></GroupMatchesList> 
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
};

export default MatchedGroups;