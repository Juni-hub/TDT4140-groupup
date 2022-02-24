import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, CardBody, CardHeader, Input, Label, Row, Col, Card, Form ,InputGroup, InputGroupText} from "reactstrap";
import { useRouter } from 'next/router'

const  RegisterUserForm = () => {

    const[isValid,setIsValid] = useState(true); 
    const router = useRouter();


    const handleSubmit = (e) => {
        e.preventDefault();
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const username = e.target.username.value;
        const email = e.target.email.value;
        const age = e.target.age.value;
        const password = e.target.password.value;
        
        const user = {
            username: username,
            password: password,
            email: email,
            first_name: firstName,
            last_name: lastName
        }
        const body = {user, age};
        
        console.log(body);
        registerPost(body);
    }


    const registerPost = async (body) =>{

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
                                    <Input type="number" placeholder="Alder" name="age"></Input>
                                </InputGroup>
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