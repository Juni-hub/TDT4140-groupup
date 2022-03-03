import React from "react";
import GroupBox from "./groupBox";
import { Row, Col, Container, Badge } from "reactstrap";
import UserGroupList from "./UserGroupList";

const MyGroup = () => {

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
                    <UserGroupList></UserGroupList> 

                    {//Button to create groups}
                    }
                    <Col>
                        <div class="text-center">
                            <Badge href="/newGroup" style={{ backgroundColor: "black" }}>
                                <h5>Opprett gruppe</h5>
                            </Badge>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MyGroup;