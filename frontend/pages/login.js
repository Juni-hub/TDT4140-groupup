import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Card, CardBody, CardFooter, CardHeader, CardImg, CardText, Col, Form, Input, InputGroup, InputGroupText, Label, Row } from "reactstrap";
import React, {useState} from "react";

import { useRouter } from 'next/router';

const Login = () => {

    const[isValid,setIsValid] = useState(true); 
    const router = useRouter();

    const routerRegister = () =>{
      router.push("/register")
    }

    const ifLoggedIn = async () => {

      if(typeof window !== "undefined" && localStorage.getItem('Token')){
        const requestOptions = {
          method: 'GET',
          headers: {
              'Content-Type' : 'application/json',
              'Authorization' : localStorage.getItem('Token')
          },
      }

    await fetch(`http://localhost:8000/profile/`, requestOptions)
      .then((res) => res.json())
      .then((userData) => {
        if (userData.user != null){
          router.push("/profile");
        }
        return
      })
      }
  }

ifLoggedIn();

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
              localStorage.setItem("Token", "Token "+data.token)
              router.push("/profile");
          }
      ).catch(
          (error) =>{
              console.log(error)
          }
      )
  }

    

    return (
            <div style={{backgroundColor: "#f0f2f5"}}>
                <Row style={{height:"15vh", textAlign:"center",display:"flex", justifyContent:"center", color:"141414", marginTop:"15px", marginBottom:"35px", height:"auto"}}>
                    <img src="groupup_transparent.png" alt={"GroupUp Logo"} style={{height:"100px", width:"auto"}}/>
                    <h2 style={{fontSize:"55px"}}>Velkommen til groupUp</h2>
                </Row>
                <Row>
                <Col xs="4"></Col>
                <Col xs="4">
                  <Card>
                    <CardHeader style={{backgroundColor:"#ABD08D", textAlign:"center"}}>Logg inn på profilen din</CardHeader>
                    <CardBody>

                      <Form onSubmit={handleSubmit}>
                        <InputGroup>
                          <InputGroupText style={{width:"30%", minWidth:"110px"}}>
                                Brukernavn:
                          </InputGroupText>
                          <Input type="text" name="username"></Input>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                          <InputGroupText style={{width:"30%", minWidth:"110px"}}>
                                Passord:
                          </InputGroupText>
                          <Input type="password" name="password"></Input>
                        </InputGroup>
                        <br></br>
                        <Button style={{backgroundColor:"#537E36", color:"white", marginBottom:"2px",width:"100%"}} type="submit" name="signIn">Logg inn</Button>
                      </Form>
                      {!isValid && <p style={{color:"red"}}>Brukernavn eller passord var ugyldig</p>}
                      </CardBody>
                    <CardFooter>
                      <CardText style={{color: "141414",textAlign:"left", marginBottom:"2px"}}>Ny bruker? Registrer deg:</CardText>
                      <Button onClick={routerRegister} style={{backgroundColor:"#537E36", color:"white", width:"100%"}}> Registrer</Button>
                    </CardFooter>
                  </Card>
                </Col>
                <Col xs="4"></Col>
              </Row>

            </div>
          );
        };
        

export default Login;
