
import React from "react";
import styles from "../styles/Home.module.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Card, CardBody, CardHeader, Col, Form, Input, InputGroup, InputGroupText, Label, Row } from "reactstrap";
import React, {useState} from "react";

import { useRouter } from 'next/router'

const  RegisterUserForm = () => {
    const[isValid,setIsValid] = useState(true); 
    const [ageIsValid, setAgeIsValid] = useState(true);
    const router = useRouter();
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(body),
    }
    const response = await fetch(`http://localhost:8000/register/`, requestOptions)
    .then(
        async (response) =>{
            if(response.status!=201){
                setIsValid(false);
                return
            }
            const data = await response.json()
            console.log(data);
            localStorage.setItem("Token", data.token)
            router.push("/loginPage");
        }
    ).catch(
        (error) =>{
            console.log(error)
        }
    )

const handleAgeChange = (e) => {
    setAgeIsValid(true);
    const age = e.target.value;
    console.log(age);
    const ageRegEx = new RegExp("/^(1[89]|[2-9][0-9])$");
    if (!ageRegEx.test((age))) {
        setAgeIsValid(false);
    }
    console.log(ageIsValid);
}
    return(
        <>
           <Row style={{ height: "15vh" }}></Row>
           <Row>
               <Col xs ="4"></Col>
               <Col xs="4">
                   <Card>
                       <CardHeader style={{backgroundColor:"rgba(132, 222, 89, 0.8)"}}> Register new user</CardHeader>
                       <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Brukernavn</InputGroupText>
                                    <Input type="text" placeholder="Brukernavn" name="username"></Input>
                                </InputGroup>
                                <br/>
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Fornavn</InputGroupText>
                                    <Input type="text" placeholder="Fornavn" name="firstName"></Input>
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Etternavn</InputGroupText>
                                    <Input type="text" placeholder="Etternavn" name="lastName"></Input>
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Alder</InputGroupText>
                                    <Input type="text" placeholder="Alder" name="age" onBlur={(e)=>handleAgeChange(e)} ></Input>
                                </InputGroup>
                                {!ageIsValid && <div style={{ color: "red" }}>Age must be 18 or over</div>}
                                {ageIsValid && <div style={{ color: "red" }}>yes</div>}
                                <br />
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>E-mail</InputGroupText>
                                    <Input type="email" placeholder="E-mail" name="email"></Input>
                                </InputGroup>
                                <br />
                                <InputGroup>
                                    <InputGroupText style={{width:"100px"}}>Passord</InputGroupText>
                                    <Input  type="password" placeholder="Passord" name="password"></Input>
                                </InputGroup>
                                <br />
                                <Button type="submit" style={{backgroundColor:"rgba(132, 222, 89, 0.8)", color:"black" }}>Register</Button>
                                {!isValid && <p>Dataen du sendte inn var ugyldig</p>}
                            </Form>
                       </CardBody>
                   </Card>
               </Col>
           </Row>
        </>
    )
};

export default RegisterUserForm;