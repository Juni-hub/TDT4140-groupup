import React from "react";
import GroupBox from "./groupBox";
import { Row, Col, Container, Button, Card, CardHeader, CardFooter } from "reactstrap";
import UserGroupList from "./UserGroupList";

const MyGroup = () => {

    const groups = [
        { title:'Gruppe 1', picture:'https://via.placeholder.com/150x100' },
        { title:'Gruppe 2', picture:'https://via.placeholder.com/150x100' },
        { title:'Gruppe 3', picture:'https://via.placeholder.com/150x100' },
    ];
    
    return (
        <div>
            <Container style={{ margin: "10px"}}>
                 <Card style={{marginTop:"20px"}}>
                     <CardHeader style={{backgroundColor:"#ABD08D", fontSize:"22px"}}>
                         Mine Grupper
                    </CardHeader>
                    <UserGroupList/>
                    <CardFooter style={{display:"flex", justifyContent:"center"}}>
                        <Button href="/newGroup" style={{backgroundColor:"#537E36"}}>
                            Opprett gruppe
                        </Button>
                    </CardFooter>
                </Card>
            </Container>
        </div>
    );
};

export default MyGroup;