import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, CardBody,CardImg, CardHeader, Input, Label, Row, Col, Card, Form, CardText } from "reactstrap";




const LoginForm = () => {
    return (
            <div>

                <Row style={{height:"15vh", textAlign:"center", color:"green", marginTop:"35px"}}>
                    <h2 style={{fontSize:"55px"}}>Welcome to groupUp</h2>
                </Row>
                <Row>
                <Col xs="4"></Col>
                <Col xs="4">
                  <Card>
                    <CardHeader style={{backgroundColor:"rgba(132, 222, 89, 0.8)", textAlign:"center"}}>Sign into your account</CardHeader>
                    <CardBody>
                      <Form onSubmit="">
                        <Label>Username</Label>
                        <Input type="text" style={{marginBottom:"30px"}}></Input>
                        <Label>Password</Label>
                        <Input type="text" style={{marginBottom:"30px"}}></Input>
                        <br></br>
                        <Button  style={{backgroundColor:"rgba(132, 222, 89, 0.8)", color:"black", marginBottom:"2px"}} type="submit">Sign in</Button>
                      </Form>
                      <br />
                      <CardText>Or if you dont have a profile, register new user</CardText>
                      <Button  style={{backgroundColor:"rgba(132, 222, 89, 0.8)", color:"black"}}> Register</Button>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs="4"></Col>
              </Row>

            </div>
          );
        };
        

export default LoginForm;
