import "bootstrap/dist/css/bootstrap.min.css";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Col,
  List,
  ListInlineItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavigationBar from "./navBar";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";

const MatchedGroupPageComponent = () => {
  const [group, setGroup] = useState(null);
  const router = useRouter();
  const id = router.query["otherId"];
  const [modal, setModal] = useState(false);
  const togglePopup = () => setModal(!modal);

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
        console.log(groupData);
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

  const getContactEmail = () => {
    const contactEmail = "No email";
    group.expanded_members.map((member) => {
      if (member.id == group.admin) {
        contactEmail = member.email;
        console.log("henter e-post");
        console.log(modal);
      }
    });
    return contactEmail;
  };

  function isGold(goldBool){
    if(goldBool){
        return <FontAwesomeIcon icon={faStar} style={{color:"#ffce08", width:"30px", marginRight:"10px"}}  />
    }
    return null;
}

  return !(id && group) ? (
    <Spinner></Spinner>
  ) : (
    <>
      <NavigationBar />

      <Card style={{ backgroundColor: "lightgreen" }}>
        <CardBody>
          <Row style={{ margin: "10px", marginBottom: "40px", height: "70px" }}>
            <Col md={10}>
              <CardTitle style={{ fontSize: "60px" }}>
              {isGold(group.is_gold)}
                {"Matchet gruppe: " + group.name}
                </CardTitle>
            </Col>
          </Row>
          <CardGroup>
            {/*Card containing basic group info*/}
            <Card style={{ margin: "20px", backgroundColor: "#fff" }}>
              <CardBody>
                <CardImg src="https://as2.ftcdn.net/v2/jpg/04/70/29/97/1000_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg" alt="image"></CardImg>
                <br />
                <br />
                <CardTitle tag="h3">Gruppeleder: {getGroupAdmin()}</CardTitle>
                <CardTitle tag="h5">Antall medlemmer: {group.members.length}</CardTitle>
                <CardTitle tag="h5">Aldersgrense: {group.minimum_age} år</CardTitle>
                <Button color="success" onClick={togglePopup}>Planlegg møte </Button>
                <br />
                <br />
                <CardTitle tag="h5" style={{ fontSize: "25px" }}>
                  {" "}
                  Medlemmer:
                </CardTitle>
                <hr />
                <List type="inline">
                  {group.expanded_members.map((member, key) => (
                    <ListInlineItem key={key} style={{ fontSize: "20px" }}>
                      <Badge color="success">{member.username}</Badge>
                    </ListInlineItem>
                  ))}
                </List>
              </CardBody>
            </Card>

            {/*Card containing group description , intrests*/}
            <Card style={{ margin: "20px", marginTop: "50px", backgroundColor: "#fff" }}>
              <CardBody>
                <CardTitle tag="h5" style={{ fontSize: "30px", textAlign: "center" }}>
                  Beskrivelse
                </CardTitle>
                <hr></hr>
                <CardText style={{ fontSize: "20px" }}>{group.description}</CardText>
                <br />
                <br />
                <CardTitle tag="h5" style={{ fontSize: "30px", textAlign: "center" }}>
                  Interesser
                </CardTitle>
                <hr />

                <List type="inline">
                  {group.interests.map((interest, key) => (
                    <ListInlineItem style={{ fontSize: "20px" }} key={key}>
                      <Badge color="success">{interest.interest_name}</Badge>
                    </ListInlineItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </CardGroup>

          {/*Row for viewing tags*/}
          <Row style={{ height: "10vh", fontSize: "25px", textAlign: "" }}>
            <List type="inline">
              <ListInlineItem style={{ fontSize: "30px" }}>Tags:</ListInlineItem>
              {group.tags.map((tag, key) => (
                <ListInlineItem key={key}>
                  <Badge>{tag.tag_name}</Badge>
                </ListInlineItem>
              ))}
            </List>
          </Row>
        </CardBody>
      </Card>
      <Modal isOpen={modal} toggle={togglePopup}>
                        <ModalHeader toggle={togglePopup}>Planlegg møte</ModalHeader>
                        <ModalBody>
                            E-post: {getContactEmail()}
                            <br />
                            Dato for ønsket møte: {group.activity_date}
                        </ModalBody>
                <ModalFooter>
                 <Button color="primary" onClick={togglePopup}>Lukk</Button>
                </ModalFooter>
                </Modal>
    </>
  );
};

export default MatchedGroupPageComponent;