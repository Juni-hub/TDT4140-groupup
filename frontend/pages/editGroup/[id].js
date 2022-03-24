import "bootstrap/dist/css/bootstrap.min.css";
import { useState, React, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { CardBody, CardFooter, CardHeader, Input, Label, Spinner, Card, Form, Row, Button, List, ListGroup, ListGroupItem, Col } from "reactstrap";
import NavigatorBar from "../../components/navBar";
import styles from "../../styles/Home.module.css";

const EditGroup = () => {
  const router = useRouter();
  const id = router.query["id"];

  const [groupData, setGroupData] = useState(null);
  const [interest, setInterest] = useState("");
  const [tags, setTags] = useState(null);
  const [tagMap, setTagMap] = useState({});

  const updateGroupData = (field, value) => {
    setGroupData({
      ...groupData,
      [field]: value,
    });
  };

  const tagButton = (tagName, key, onClick) => {
    return (
      <Col md={2} key={key}>
        <Button type="button" style={{ minWidth: "100px" }} onClick={onClick}>
          {tagMap[tagName]}
        </Button>
      </Col>
    );
  };

  const removeInterest = (deletedInterest) => {
    updateGroupData(
      "interests",
      groupData.interests.filter((interest) => interest != deletedInterest)
    );
  };

  const addInterest = (addedInterest) => {
    updateGroupData("interests", groupData.interests.includes(addedInterest) ? groupData.interests : [...groupData.interests, addedInterest]);
  };

  const removeTag = (removedTag) => {
    updateGroupData(
      "tags",
      groupData.tags.filter((tag) => tag != removedTag)
    );
  };

  const addTag = (addedTag) => {
    updateGroupData("tags", groupData.tags.includes(addedTag) ? groupData.tags : [...groupData.tags, addedTag]);
  };

  const submitChanges = () => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        activity_date: groupData.activity_date,
        description: groupData.description,
        member_limit:groupData.member_limit,
        minimun_age: groupData.minimun_age,
        name: groupData.name,
        tags: groupData.tags.map((tag) => {
          return { tag_name: tag };
        }),
        interests: groupData.interests.map((interest) => {
          return { interest_name: interest };
        }),
      }),
    };
    fetch(`http://localhost:8000/group/${id}/`, requestOptions).then(router.push(`/group/${id}`));
  };

  const parseGroup = (group) => {
    return {
      ...group,
      interests: group.interests.map((interest) => interest.interest_name),
      tags: group.tags.map((tag) => tag.tag_name),
    };
  };

  const fetchData = (id) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
    };
    fetch(`http://localhost:8000/group/${id}/`, requestOptions).then((response) => {
      response.json().then((data) => setGroupData(parseGroup(data)));
    });
    fetch(`http://localhost:8000/tags/`, requestOptions).then((response) => {
      response.json().then((data) => {
        setTags(data.map((tag) => tag[0]));
        setTagMap(
          data.reduce((obj, tag) => {
            return {
              ...obj,
              [tag[0]]: tag[1],
            };
          }, {})
        );
      });
    });
  };

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);
  
  return !(groupData && tags) ? (
    <Spinner></Spinner>
  ) : (
    <>
      <NavigatorBar name={groupData.name}></NavigatorBar>
      <Card>
        <CardHeader>Rediger {groupData.name}</CardHeader>
        <Form>
          <CardBody>
            <Row>
              <Label>Navn</Label>
              <Input value={groupData.name} onChange={(e) => updateGroupData("name", e.target.value)} type="text"></Input>
            </Row>
            <br></br>
            <Row>
              <Label>Beskrivelse</Label>
              <Input value={groupData.description} type="textarea" onChange={(e) => updateGroupData("description", e.target.value)}></Input>
            </Row>
            <br></br>
            <Row>
              <Label>Medlemsgrense</Label>
              <Input value={groupData.member_limit} type="number" onChange={(e) => updateGroupData("member_limit", e.target.value)}></Input>
            </Row>
            <br></br>
            <Row>
              <Label>Aldersgrense</Label>
              <Input value={groupData.minimum_age} type="number" onChange={(e) => updateGroupData("minimum_age", e.target.value)}></Input>
            </Row>
            <br></br>
            <Row>
              <Label>Dato for ønsket aktivitet</Label>
              <Input value={groupData.activity_date} onChange={(e) => updateGroupData("activity_date", e.target.value)} type="date"></Input>
            </Row>
            <br></br>
            <Row>
              <Label>Interesser</Label>
              <Input type="text" placeholder="Ny interesse" value={interest} onChange={(e) => setInterest(e.target.value.trim())}></Input>
              <ListGroup>
                {groupData.interests.map((interest, key) => (
                  <ListGroupItem key={key} onClick={() => removeInterest(interest)}>
                    {interest}
                  </ListGroupItem>
                ))}
              </ListGroup>
              <Button
                type="button"
                onClick={() => {
                  interest == "" ? null : addInterest(interest);
                  setInterest("");
                }}
              >
                Legg til interesse
              </Button>
            </Row>
            <br></br>
            <Row>
              <Label>Tilgjengelige tags</Label>
              {tags.map((tag, key) => tagButton(tag, key, () => addTag(tag)))}
            </Row>
            <br></br>
            <Row>
              <Label>Gruppens tags</Label>
              {groupData.tags.map((tag, key) => tagButton(tag, key, () => removeTag(tag)))}
            </Row>
            <br></br>
          </CardBody>
          <CardFooter>
            <Button className={styles.submitButton} onClick={submitChanges}>
              Oppdater gruppe
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </>
  );
};

export default EditGroup;
