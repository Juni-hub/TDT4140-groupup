import 'bootstrap/dist/css/bootstrap.min.css'

import { Button, Card, CardBody, CardHeader, CardImg, CardText, Col, Form, Input, Label, Row } from "reactstrap";
import React, {useState} from "react";

import { useRouter } from 'next/router';

const LoginForm = () => {

    const[isValid,setIsValid] = useState(true); 
    const router = useRouter();

    const routerRegister = () =>{
      router.push("/registerPage")
    }


    const handleSubmit = (e) => {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;
      const body = {username, password};

      logIn(body);
  }

  const logIn = async (body) =>{

      const requestOptions = {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify(body),
      }
      const response = await fetch(`http://localhost:8000/login/`, requestOptions)
      .then(
          async (response) =>{
              if(response.status!=200){
                  setIsValid(false);
                  return
              }
              const data = await response.json()
              console.log(data);
              localStorage.setItem("Token", data.token)
              router.push("/profile");
          }
      ).catch(
          (error) =>{
              console.log(error)
          }
      )
  }

    

    return (
            <div>

                <Row style={{height:"15vh", textAlign:"center", color:"green", marginTop:"35px"}}>
                    <h2 style={{fontSize:"55px"}}>Velkommen til groupUp</h2>
                </Row>
                <Row>
                <Col xs="4"></Col>
                <Col xs="4">
                  <Card>
                    <CardHeader style={{backgroundColor:"rgba(132, 222, 89, 0.8)", textAlign:"center"}}>Logg inn på profilen din</CardHeader>
                    <CardBody>

                      <Form onSubmit={handleSubmit}>
                        <Label>Brukernavn</Label>
                        <Input type="text" name="username" style={{marginBottom:"30px"}}></Input>
                        <Label>Passord</Label>
                        <Input type="password" name="password" style={{marginBottom:"30px"}}></Input>
                        <br></br>
                        <Button  style={{backgroundColor:"rgba(132, 222, 89, 0.8)", color:"black", marginBottom:"2px",width:"100%"}} type="submit" name="signIn">Logg inn</Button>
                      </Form>
                      {!isValid && <p style={{color:"red"}}>Brukernavn eller passord var ugyldig</p>}
                      <br />

                      <CardText style={{textAlign:"center"}}>Eller hvis du ikke har en bruker, registrer deg!</CardText>
                      <Button  onClick={routerRegister} style={{backgroundColor:"rgba(132, 222, 89, 0.8)", color:"black", width:"100%"}}> Registrer</Button>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs="4"></Col>
              </Row>

            </div>
          );
        };
        

export default LoginForm;
