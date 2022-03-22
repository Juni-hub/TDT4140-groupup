import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CardBody,
  CardImg,
  CardHeader,
  Row,
  Col,
  Card,
  List,
  CardText,
  ListInlineItem,
  Badge,
  Spinner,
  CardGroup,
  CardTitle,
  Button,
  Input,
  Label
} from "reactstrap";
import { useRouter } from "next/router";
import NavigationBar from "./navBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const GroupPageComponent = () => {
  const [group, setGroup] = useState(null);
  const router = useRouter();
  const id = router.query["id"];
  const inputFile = useRef(null) 

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

  function getImage(url){
    if (url != null){
        return "http://localhost:8000" + url;
    }
    return "https://as2.ftcdn.net/v2/jpg/04/70/29/97/1000_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";
}

  const getGroupAdmin = () => {
    const leader = group.admin;
    group.expanded_members.map((member) => {
      if (member.id == leader) {
        leader = member.username;
      }
    });
    return leader;
  };

  const handleImage = (e) =>{
    e.stopPropagation();
    e.preventDefault();
    var image = e.target.files[0];
    if( image!=null && (image.type.split('/')[0]) === 'image'){

      const formData = new FormData();
      formData.append("image", image, image.name);

      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
        body: formData
      };
      delete requestOptions.headers['Content-Type'];
      fetch(`http://localhost:8000/group/${id}/`, requestOptions).then((res) => res.json())
      .then((groupData) => {
        setGroup(groupData);
      });
    }
    else{
      return;
    }
  };

  useEffect(() => {
    if (id) getGroup();
  }, [id]);

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
                {group.name}
                </CardTitle>
            </Col>
            <Col md={2}>
              <Button onClick={() => router.push(`/editGroup/${id}`)}>Rediger gruppe informasjon</Button>
            </Col>
          </Row>
          <CardGroup>
            {/*Card containing basic group info*/}
            <Card style={{ margin: "20px", backgroundColor: "#fff" }}>
              <CardBody>
                <CardImg src={getImage(group.image)} alt="image"></CardImg>
                <Label>Velg nytt gruppebilde</Label>
                <Input type='file' id='file'accept="image/" ref={inputFile} style={{display: ''}} onChange={handleImage}></Input>
                
                <br />
                <br />
                <CardTitle tag="h3">Gruppeleder: {getGroupAdmin()}</CardTitle>
                <CardTitle tag="h5">Antall medlemmer: {group.members.length}</CardTitle>
                <CardTitle tag="h5">Aldersgrense: {group.minimum_age} år</CardTitle>
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

            {/*Card containing the groups matched groups*/}
            <Card style={{ margin: "20px", marginTop: "50px", backgroundColor: "#fff" }}>
              <CardBody>
                <CardTitle tag="h5" style={{ fontSize: "30px", textAlign: "center" }}>
                  Matchede grupper
                </CardTitle>
                <hr></hr>
                {/* <List style={{ listStyle: "none" }}>
                  <li>
                    <Button color="success" outline size="lg" style={{ margin: "10px" }}>
                      {" "}
                      Vi som liker øl
                    </Button>
                  </li>
                  <li>
                    <Button color="success" outline size="lg" style={{ margin: "10px" }}>
                      {" "}
                      Guttebanden
                    </Button>
                  </li>
                  <li>
                    <Button color="success" outline size="lg" style={{ margin: "10px" }}>
                      {" "}
                      Jentene
                    </Button>
                  </li>
                </List> */}
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
    </>
  );
};

export default GroupPageComponent;
