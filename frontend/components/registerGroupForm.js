import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, ListGroup, ListGroupItem, Progress, Input, InputGroup, InputGroupText, Label } from "reactstrap";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

const  RegisterGroupForm = () => {

    const [usersData, setUsersData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [groupMembers, setgroupMembers] = useState([]);

    const [isLoading, setLoading] = useState(false);
    const [dropDownIsOpen, setDropdownIsOpen] = useState(false);

    const router = useRouter();

    const toggle = () => {
        setDropdownIsOpen(!dropDownIsOpen);
    }

    const handleAddMember = (userToAdd) => {
        toggle();
        setgroupMembers([...groupMembers, userToAdd]);
    }

    const handleRemoveMember = (memberToRemove) => {
        setgroupMembers(groupMembers.filter((member) => member != memberToRemove));
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        const groupName = e.target.groupName.value;
        const groupType = e.target.groupType.value == "on"? true : false;
        const members = groupMembers.map(member => member.id);
        console.log(members);
        const group = {
            name: groupName,
            members: members,
            is_gold: groupType,
        }
        console.log(group);
        registerGroup(group);
        router.push('/my-groups');
    }

    const registerGroup = async (body) =>{
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type' : 'application/json',
                      'Authorization': localStorage.getItem('Token')},
            body: JSON.stringify(body),
        }
        const response = await fetch(`http://localhost:8000/group/`, requestOptions)
        .then(
            async (response) =>{
                if(response.status!=201){
                    return
                }
                const data = await response.json()
            }
        ).catch(
            (error) =>{
                console.log(error)
            }
        )
    }

    const getProfileData = () => {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type' : 'application/json',
                      'Authorization': localStorage.getItem('Token')},
        }
        setLoading(true);
        fetch(`http://localhost:8000/profile/`, requestOptions)
        .then((res) => res.json())
        .then((profileData) => {
          let profile = {username: profileData.user.username, id: profileData.user.id}
          setProfileData(profile);
          setLoading(false);
        })
    }

    const getUsersData = () => {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type' : 'application/json',
                      'Authorization': localStorage.getItem('Token')},
        }
        setLoading(true);
        fetch(`http://localhost:8000/users`, requestOptions)
        .then((res) => res.json())
        .then((userData) => {
          let users = []
          for (const key in userData) {
            users.push({username: userData[key].user.username, id: userData[key].user.id});
          }
          setUsersData(users);
          setLoading(false);
        })
    }

    useEffect(() => {
        getProfileData();
        getUsersData();
    }, [])

    if (isLoading) return <><p>Loading...</p><Progress animated color="info" value={100} /></>
    if (!profileData || !usersData) return <p><h5>Ingen data</h5></p>

    return(
        <Container className="d-flex h-100" style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop:"5%" }}>
            <Card style={{width:"50%"}}>
                <Form onSubmit={handleSubmit}>
                    <CardHeader style={{backgroundColor: "#ABD08D", fontSize:"22px"}}> Opprett Gruppe </CardHeader>
                    <CardBody>
                        <InputGroup>
                            <InputGroupText>Gruppenavn</InputGroupText>
                            <Input id='groupName' name="groupName" placeholder=""/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <InputGroupText>Gruppeleder</InputGroupText>
                            <Input id='groupOwner' name="groupOwner" value={profileData.username} disabled style={{color: "#808080"}}/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <Label check>
                                <Input type="checkbox" id='groupType' name="groupType"/>{' '}
                                Gullgruppe
                            </Label>
                        </InputGroup>
                        <br/>
                        <p className="card-subtitle mb-2 text-muted">Medlemmer:</p>
                        <ListGroup >
                            {groupMembers.map((member,index) => 
                            <ListGroupItem id={member.id} key={index} onClick={() => handleRemoveMember(member)} className={styles.memberListItem}>
                                {member.username}
                            </ListGroupItem>)}
                        </ListGroup>
                        <Dropdown isOpen={dropDownIsOpen} toggle={toggle}>
                            <DropdownToggle caret>
                                Legg til medlem
                            </DropdownToggle>
                            <DropdownMenu>
                                {usersData.filter(user => user.username != profileData.username && user.id != profileData.id)
                                .map((user,index) => {return(
                                    <DropdownItem id={user.id} key={index} onClick={() => handleAddMember(user)}>
                                        {user.username}
                                    </DropdownItem>
                                )})}
                            </DropdownMenu>
                        </Dropdown>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" style={{backgroundColor: "#537E36"}}>Opprett gruppe</Button>
                    </CardFooter>
                </Form>
            </Card>
        </Container>
    )
};

export default RegisterGroupForm;
