import "bootstrap/dist/css/bootstrap.min.css";

import {
  Container,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Form,
  Input,
  Label,
  List,
  ListGroup,
  ListGroupItem,
  Navbar,
  Row,
  Spinner,
} from "reactstrap";
import { React, useEffect, useRef, useState } from "react";
import styles from "../../../styles/Home.module.css";
import NavigationBar from "../../../components/navBar";
import { useRouter } from "next/router";

const superlikes = () => {
  const router = useRouter();
  const originalId = router.query["id"];

  const [groups, setGroups] = useState(null);

  if (typeof window !== "undefined") {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
    };
  }

  function getImage(url) {
    if (url != null) {
      return "http://localhost:8000" + url;
    }
    return "https://as2.ftcdn.net/v2/jpg/04/70/29/97/1000_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";
  }

  const getGroupData = (id) => {
    fetch(`http://localhost:8000/superlikes/` + id + "/", requestOptions)
      .then((res) => res.json())
      .then((groups) => {
        setGroups(groups);
      });
  };

  const goToGroup = (id) => {
    router.push("../../group-page/" + originalId + "/other-group/"+id);
  };

  useEffect(() => {
    if (originalId) getGroupData(originalId);
  }, [originalId]);

  return (
    <div style={{backgroundColor: "#f0f2f5", height: "100vh"}}>
    <>
      <NavigationBar></NavigationBar>
      {!groups ? (
        <Spinner></Spinner>
      ) : (
        <>
          <Container>
            <Card style={{marginTop:"10px"}}>
              <CardHeader style={{backgroundColor:"#ABD08D", fontSize:"22px"}}>
                Gruppas mottatte superlikes
              </CardHeader>
              <CardBody>
                <Row>
                  {groups.map((group, i) => (
                    <Col sm={3}>
                      <Card className={styles.groupCard} style={{border: "", borderRadius: "10px", minWidth: "220px", padding:"0px", margin: "10px", boxShadow:"0 2px 4px 0 rgba(100, 100, 100, 0.26)"}} onClick={() => goToGroup(group.id)}>
                        <CardImg alt="Card image cap" src={getImage(group.image)} style={{display:"block", aspectRatio:"5/4", objectFit:"cover"}} />
                        <CardBody>
                          <CardTitle tag="h5">{group.name}</CardTitle>
                          <CardSubtitle className="mb-2 text-muted" tag="h6">
                            {group.expanded_members.length} medlemmer
                          </CardSubtitle>
                          <CardText>{group.description}</CardText>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Container>
        </>
      )}
    </>
  </div>
  );
};

export default superlikes;
