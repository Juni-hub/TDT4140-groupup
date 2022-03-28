import "bootstrap/dist/css/bootstrap.min.css";

import {
  Label,
  InputGroup,
  Badge,
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  ListGroupItem,
  Col,
  List,
  ListInlineItem,
  Row,
  Spinner,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavigationBar from "./navBar";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";

const OtherGroupPageComponent = () => {
  const [group, setGroup] = useState(null);
  const router = useRouter();
  const id = router.query["otherId"];

  // Checking typof to only check localstorage on client-side (does not exist on server)
  // Because Next.js will render parts of website server-side
  if (typeof window !== "undefined") {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
    };
  }

  const getGroup = () => {
    fetch(`http://localhost:8000/group/` + id + "/", requestOptions)
      .then((res) => res.json())
      .then((groupData) => {
        setGroup(groupData);
      });
  };
  useEffect(() => {
    if (id) getGroup();
  }, [id]);

  const getGroupAdmin = () => {
    const leader = group.admin;
    group.expanded_members.map((member) => {
      if (member.id == leader) {
        leader = member.username;
      }
    });
    return leader;
  };

  function isGold(goldBool){
    if(goldBool){
        return <FontAwesomeIcon icon={faStar} style={{color:"#ffce08", width:"30px", marginRight:"10px"}}  />
    }
    return null;
}

function getImage(url){
  if (url != null){
      return "http://localhost:8000" + url;
  }
  return "https://as2.ftcdn.net/v2/jpg/04/70/29/97/1000_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";
}

  return !(id && group) ? (
    <Spinner></Spinner>
  ) : (
    <>
      <NavigationBar />

      <div style={{width:"100%", padding:"15px", display:"flex"}}>
        <Card style={{width:"50%", marginRight:"10px"}}>
          <CardHeader style={{backgroundColor:"#ABD08D", fontSize:"22px"}}>
            {isGold(group.is_gold)}{group.name}
          </CardHeader>
          <CardBody style={{display:"flex"}}>
            <Card style={{width:"50%", marginRight:"10px"}}>
              <CardImg src={getImage(group.image)} alt="image" style={{display:"block", aspectRatio:"1", objectFit:"cover"}}></CardImg>
              <CardBody>
                <Label style={{marginBottom:"2px"}}>Gruppeleder:</Label>
                <p style={{fontWeight:"bold", fontSize:"20px"}}><Badge>{getGroupAdmin()}</Badge></p>
                <Label style={{marginBottom:"2px"}}>Antall Medlemmer:</Label>
                <p style={{marginLeft:"10px", fontWeight:"bold"}}>{group.members.length}</p>
                <Label style={{marginBottom:"2px"}}>Aldersgrense:</Label>
                <p style={{marginLeft:"10px", fontWeight:"bold"}}>{group.minimum_age}</p>
                <Label style={{marginBottom:"2px"}}>Medlemmer:</Label>
                <List type="inline">
                  {group.expanded_members.map((member, key) => (
                    <ListInlineItem key={key} style={{ fontSize: "20px" }}>
                      <Badge>{member.username}</Badge>
                    </ListInlineItem>
                  ))}
                </List>
              </CardBody>
            </Card>
            <Card style={{width:"50%"}}>
              <CardHeader style={{fontSize:"20px"}}>
                Beskrivelse
              </CardHeader>
              <CardBody>
                <CardText>{group.description}</CardText>
              </CardBody>
              <CardHeader style={{fontSize:"20px"}}>
                Lokasjon
              </CardHeader>
              <CardBody>
                <CardText>{group.location?locationMap[group.location.location_name]:"Ikke satt"}</CardText>
              </CardBody>
              <CardHeader style={{fontSize:"20px"}}>
                Interesser
              </CardHeader>
                <InputGroup style={{display:"table", justifyContent:"center"}}>
                  {group.interests.map((interest, key) => (
                    <ListGroupItem key={key} style={{margin:"4px", backgroundColor:"#e4f0db", fontStyle:"italic"}}>
                     {interest.interest_name}
                    </ListGroupItem>
                  ))}
                </InputGroup>
                <CardHeader style={{fontSize:"20px"}}>
                  Tags
                </CardHeader>
                <CardBody>
                  <Row style={{ height: "10vh", fontSize: "25px", textAlign: "" }}>
                    <List type="inline">
                      {group.tags.map((tag, key) => (
                        <ListInlineItem key={key}>
                          <Button style={{ minWidth: "100px", backgroundColor:"#E5EEF0", color:"black"}}>{tag.tag_name}</Button>
                        </ListInlineItem>
                      ))}
                    </List>
                  </Row>
                </CardBody>
            </Card>
          </CardBody>
        </Card>

      </div>
    </>
  );
};

export default OtherGroupPageComponent;