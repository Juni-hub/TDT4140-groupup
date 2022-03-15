import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse, DropdownToggle, Navbar, NavbarToggler, UncontrolledDropdown, NavbarBrand, Nav, NavItem, NavLink, DropdownMenu, DropdownItem } from "reactstrap";

const NavigationBar = (props) => {

    // There are no pages yet where the navBar should be included, so this has to be added when such pages are added
    // To include the navbar add <NavigationBar/>
    // To include the navbar when the user is on a page connected to a single group add <NavigationBar group="<insert-group-name>"/>

    // can't decide wheter it's best to sent the group to different pages as a prop, or if it should be set in localStorage
    // did it with props for now, but here is the code for localStorage if we decide this is more convenient later on
    // if (typeof window !== "undefined") localStorage.setItem("group", "<insert-groupname-here>");
    // const group = typeof window !== "undefined" ? localStorage.getItem("group") : null;
    
    /**
     * 
     * const group = [
            { title: 'Gruppe 1'}, ];
    */
   const group = props.group;

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

                    <Nav navbar>
                        <NavItem class="
                            px-3 
                            nav-item py-md-2">
                            <NavLink href="/profile">Min Profil</NavLink>
                        </NavItem>
                        
                        <NavItem class="
                        px-3 
                        nav-item py-md-2">
                            <NavLink href="/myGroups">Mine Grupper</NavLink>
                        </NavItem>

                        <NavItem class="
                        px-3 
                        nav-item py-md-2">
                            <NavLink href="/findGroups">Finn Grupper</NavLink>
                        </NavItem>
                        
                        {group &&
                            <UncontrolledDropdown 
                                inNavbar 
                                nav
                                class="px-3 nav-item py-md-2"
                                >
                                <DropdownToggle 
                                caret
                                nav>
                                {group}
                                </DropdownToggle>
                                <DropdownMenu left>
                                    <DropdownItem href="/groupProfile">Gruppeprofil</DropdownItem>
                                    <DropdownItem href="/matchedGroups">Matchede grupper</DropdownItem>
                                    <DropdownItem href="/findGroups">Finn nye grupper</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
            
        </div>
    )
}

export default NavigationBar;