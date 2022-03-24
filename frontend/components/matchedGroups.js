import { Container, Row } from "reactstrap";

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
            <Container fluid style={{ margin: "10px" }}>

                 {//Maps every group component to myGroups-page
                 }   
                <Row style={{ marginBottom: "15px" }}>
                    <GroupMatchesList></GroupMatchesList> 
                </Row>
            </Container>
        </div>
    );
};

export default MatchedGroups;