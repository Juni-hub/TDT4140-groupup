import React, { Component, useState } from 'react';
import {Form, InputGroup, InputGroupText, Input, Container, Button, ListGroupItemHeading, ListGroupItem, DropdownItem,} from 'reactstrap'
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl'
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Home.module.css';
import { withRouter } from 'next/router'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      
    </a>
  ));

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value.toLowerCase()),
            ).slice(0,5)}
          </ul>
        </div>
      );
    },
  );

  const CustomList = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {React.Children.toArray(children)}
          </ul>
        </div>
      );
    },
  );

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

  //Get all usernames that are not group creator
  var owner = ""
  var users = [];
  var participants = []
  const maxUsers = 5

  export default withRouter(class CreateGroupForm extends Component {

    constructor () {
        super();
        this.state = {
            groupOwner: owner,
            registeredUsers: users,
            groupParticipants: participants
        }

        this.handleAddParticipant = this.handleAddParticipant.bind(this)
        this.handleRemoveParticipant = this.handleRemoveParticipant.bind(this)
        this.render = this.render.bind(this)
    }

    componentDidMount() {
      this.UserList();
      this.profileData();
    }
    

    UserList(){
      const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('Token')
        },
    }

    fetch(`http://localhost:8000/users`, requestOptions)
    .then((res) => res.json())
    .then((userData) => {
      let getUsers = []
      for (const key in userData) {
        getUsers.push({username: userData[key].user.username, id: userData[key].user.id});
      }
      this.setState({ registeredUsers: getUsers })
    })
    }

    profileData(){
      const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('Token')
        },
    }

    fetch(`http://localhost:8000/profile/`, requestOptions)
    .then((res) => res.json())
    .then((userData) => {
      this.setState({ groupOwner: {username: userData.user.username, id: userData.user.id} })
    })
    }

    handleAddParticipant(e, user) {
        const inGroup = (this.state.groupParticipants.indexOf(e.target.id))
        const amount = this.state.groupParticipants.length
        if (inGroup < 0 && amount < maxUsers) (
            this.setState({groupParticipants: [...this.state.groupParticipants, {username: user.username ,id: user.id}]})
        )
    }

    handleRemoveParticipant(e) {
        const array = this.state.groupParticipants
        const index = array.indexOf(e.target.id)
        array.splice(index, 1)
        this.setState({groupParticipants: array})
    }

    handleSubmit = (e) => {
      e.preventDefault();
      const groupName = document.getElementById('groupName').value;
      let members = []
      for (const i in this.state.groupParticipants){
        members.push(parseInt(this.state.groupParticipants[i].id))
      }
      const group = {
          name: groupName,
          members: members
      }
      registerGroup(group);
      this.props.router.push('/myGroups')
  }
    


    render (){
        return(
            <Container className="d-flex h-100" style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop:"5%" }}>
                <Card style={{width:"50%"}}>
                    <Card.Header style={{backgroundColor: "#A9DAB1"}}> Opprett Gruppe </Card.Header>
                   <Card.Body>
                        <InputGroup>
                            <InputGroupText>
                                Gruppenavn
                            </InputGroupText>
                            <Input id='groupName' name="groupName" placeholder=""/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <InputGroupText>
                                Gruppeleder
                            </InputGroupText>
                            <Input id='groupOwner' name="groupOwner" value={this.state.groupOwner.username} disabled style={{color: "#808080"}}/>
                        </InputGroup>
                        <br/>
                        <p className="card-subtitle mb-2 text-muted">Medlemmer:</p>
                        <ListGroup as={CustomList} activeKey = {0} id="1">
                            {this.state.groupParticipants.map((participant,index) => 
                            <ListGroup.Item id={participant.id} key={index} onClick={this.handleRemoveParticipant} className={styles.memberListItem}>
                                {participant.username}
                            </ListGroup.Item>)}
                        </ListGroup>
                        <Dropdown>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                <Button >Legg til medlem</Button>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomMenu}>
                                    {this.state.registeredUsers.map((user,index) => <Dropdown.Item as="button" key ={index} id={user} onClick={(e) => this.handleAddParticipant(e, user)}>
                                        {user.username}
                                        </Dropdown.Item>)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Card.Body>
                    <Card.Footer>
                        <Button id='createGroup' type="submit" onClick={(e) => this.handleSubmit(e)}>Opprett gruppe</Button>
                    </Card.Footer>
                </Card>
            </Container>
        )
    }
})