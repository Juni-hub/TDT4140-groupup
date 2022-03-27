import React from "react";
import GroupBox from "./groupBox";
import { Row, Col, Container, Button, Card, CardHeader, CardFooter } from "reactstrap";
import UserGroupList from "./UserGroupList";
import styles from "../styles/Home.module.css";

const MyGroup = () => {

    const groups = [
        { title:'Gruppe 1', picture:'https://via.placeholder.com/150x100' },
        { title:'Gruppe 2', picture:'https://via.placeholder.com/150x100' },
        { title:'Gruppe 3', picture:'https://via.placeholder.com/150x100' },
    ];
    
    return (
        <div style={{padding:"10px"}}>
            <Container style={{margin: "10px"}}>
                 <Card style={{marginTop:"20px", maxWidth:"95%", minWidth:"min-content"}}>
                     <CardHeader style={{backgroundColor:"#ABD08D", fontSize:"22px", marginBottom:"10px"}}>
                         Mine Grupper
                    </CardHeader>
                    <UserGroupList/>
                    <CardFooter style={{display:"flex", justifyContent:"center"}}>
                        <Button href="/new-group" className={styles.submitButton}>
                            Opprett ny gruppe
                        </Button>
                    </CardFooter>
                </Card>
            </Container>
        </div>
    );
};

export default MyGroup;