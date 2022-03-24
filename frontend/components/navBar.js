import 'bootstrap/dist/css/bootstrap.min.css';

import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Navbar, NavbarBrand, NavbarToggler, Progress, UncontrolledDropdown } from "reactstrap";
import React, {useEffect, useState} from "react";

const NavigationBar = () => {

    const [groupData, setGroupData] = useState(null)
    const [groupId, setGroupId] = useState(null)
    const [isLoading, setLoading] = useState(false)

    if(typeof window !== "undefined"){
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : localStorage.getItem('Token')
            },
        }
    }

    const getGroupData = (groupId) => {
        setLoading(true)
        fetch(`http://localhost:8000/group/` + groupId + `/`, requestOptions)
          .then((res) => res.json())
          .then((groupData) => {
            setGroupData(groupData)
          })
        setLoading(false)
    }

    const removeGroupInLocalStorage = () => {
        if (typeof window !== "undefined") localStorage.setItem("group", "");
    }

    const logOut = () => {
        if (typeof window !== "undefined") localStorage.removeItem("Token");
    }

    useEffect(() => {
        const groupId = typeof window !== "undefined" ? localStorage.getItem("group") : null
        if (groupId != null){
            setGroupId(groupId);
            getGroupData(groupId);
        }
    }, [])

    if (isLoading) return <><p>Loading...</p><Progress animated color="info" value={100} /></>

    return ( 
        <div>
            <Navbar 
                color="light"
                expand="md"
                light 
                group="">

                <NavbarBrand
                className="me-auto" 
                    href="/">
                    GroupUp
                </NavbarBrand>
                <NavbarToggler onClick={function noRefCheck(){}}/>
                <Collapse navbar>

                    <Nav navbar className="container-fluid">
                        <NavItem class="
                            px-3 
                            nav-item py-md-2">
                            <NavLink href="/profile" onClick={removeGroupInLocalStorage}>Min Profil</NavLink>
                        </NavItem>
                        
                        <NavItem class="
                        px-3 
                        nav-item py-md-2">
                            <NavLink href="/my-groups" onClick={removeGroupInLocalStorage}>Mine Grupper</NavLink>
                        </NavItem>
                        
                        {groupId && groupData &&
                            <UncontrolledDropdown 
                                inNavbar 
                                nav
                                class="px-3 nav-item py-md-2"
                                >
                                <DropdownToggle 
                                caret
                                nav>
                                {groupData.name}
                                </DropdownToggle>
                                <DropdownMenu left>
                                    <DropdownItem href={`/group-page/${groupId}`}>Gruppeprofil</DropdownItem>
                                    <DropdownItem href={`/group-page/${groupId}/matched-groups`}>Matchede grupper</DropdownItem>
                                    <DropdownItem href={`/group-page/${groupId}/find-groups`}>Finn nye grupper</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        }
                        <NavItem className="ms-auto">
                            <NavLink href="/login-page" onClick={logOut}>Logg ut</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
            
        </div>
    )
}

export default NavigationBar;