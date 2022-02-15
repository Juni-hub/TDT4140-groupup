import React from "react";
import styles from "../styles/Home.module.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, CardBody, CardHeader, Input, Label, Row, Col, Card, Form ,InputGroup, InputGroupText} from "reactstrap";


const  RegisterUserForm = () => {
    return(
        <>
           <Row style={{ height: "15vh" }}></Row>
           <Row>
               <Col xs ="4"></Col>
               <Col xs="4">
                   <Card>
                       <CardHeader style={{backgroundColor:"rgba(132, 222, 89, 0.8)"}}> Register new user</CardHeader>
                       <CardBody>
                            <Form onSubmit="">
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>First name</InputGroupText>
                                    <Input type="text" placeholder="First Name" name="firstName"></Input>
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Last name</InputGroupText>
                                    <Input type="text" placeholder="Last Name" name="lastName"></Input>
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Age</InputGroupText>
                                    <Input type="number" placeholder="Age" name="age"></Input>
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Password</InputGroupText>
                                    <Input type="password" placeholder="password" name="password"></Input>
                                </InputGroup>
                                <br />
                                <Button type="submit" style={{width:"300px", backgroundColor:"rgba(132, 222, 89, 0.8)", color:"black" }}>Register</Button>
                            </Form>
                       </CardBody>
                   </Card>
               </Col>
           </Row>
        </>
    )
};

export default RegisterUserForm;