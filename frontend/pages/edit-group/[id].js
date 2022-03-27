import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { React, useEffect, useState } from "react";
import {
  Button, Card, CardBody, CardFooter,
  CardHeader, Col, Container, Form, Input, InputGroup, InputGroupText, Label, ListGroup,
  ListGroupItem, Row, Spinner
} from "reactstrap";
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
        <Button type="button" style={{ minWidth: "100px", backgroundColor: "#E5EEF0", color: "black" }} onClick={onClick}>
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

  const submitChanges = async () => {
    const body = {
      activity_date: groupData.activity_date,
      description: groupData.description,
      member_limit: groupData.member_limit,
      minimun_age: groupData.minimun_age,
      name: groupData.name,
      tags: groupData.tags.map((tag) => {
        return { tag_name: tag };
      }),
      interests: groupData.interests.map((interest) => {
        return { interest_name: interest };
      }),
    };

    body = JSON.stringify(body);

    const data = new FormData();
    data.append("JSON", body);

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("Token"),
      },
      body: data,
    };
    var result = await fetch(`http://localhost:8000/group/${id}/`, requestOptions)
    if(result){
      router.push(`/group-page/${id}`)
    }
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
      response.json().then((data) => {
        setGroupData(parseGroup(data));
      });
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
      fetch(`http://localhost:8000/group/${id}/`, requestOptions)
    }else{
      e.target.value = "Not valid image";
      return;
    }
  };


  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  return !(groupData && tags) ? (
    <Spinner></Spinner>
  ) : (
    <>
      <NavigatorBar name={groupData.name}></NavigatorBar>
      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Card style={{ margin: "20px" }}>
          <CardHeader style={{ backgroundColor: "#ABD08D", display: "inline-block", fontSize: "22px" }}>
            Rediger <h3>{groupData.name}</h3>
          </CardHeader>
          <Form>
            <CardBody>
              <InputGroup>
                <InputGroupText style={{ minWidth: "150px" }}>Navn</InputGroupText>
                <Input value={groupData.name} onChange={(e) => updateGroupData("name", e.target.value)} type="text"></Input>
              </InputGroup>
              <br />
              <InputGroup>
            <InputGroupText>Velg nytt gruppebilde</InputGroupText>
            <Input type='file' id='file'accept="image/" onChange={handleImage}></Input>
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText style={{ minWidth: "150px" }}>Beskrivelse</InputGroupText>
                <Input value={groupData.description} type="textarea" onChange={(e) => updateGroupData("description", e.target.value)}></Input>
              </InputGroup>
              <br></br>
              <InputGroup>
                <InputGroupText style={{ minWidth: "150px" }}>Medlemsgrense</InputGroupText>
                <Input value={groupData.member_limit} type="number" onChange={(e) => updateGroupData("member_limit", e.target.value)}></Input>
              </InputGroup>
              <br></br>
              <InputGroup>
                <InputGroupText style={{ minWidth: "150px" }}>Aldersgrense</InputGroupText>
                <Input value={groupData.minimum_age} type="number" onChange={(e) => updateGroupData("minimum_age", e.target.value)}></Input>
              </InputGroup>
              <br></br>
              <InputGroup>
                <InputGroupText style={{ minWidth: "150px" }}>
                  Dato for ønsket
                  <br /> aktivitet
                </InputGroupText>
                <Input value={groupData.activity_date} onChange={(e) => updateGroupData("activity_date", e.target.value)} type="date"></Input>
              </InputGroup>
              <br></br>
              <Row>
                <Label>Interesser:</Label>
                <InputGroup>
                  <InputGroupText style={{ minWidth: "150px" }}>Ny Interesse:</InputGroupText>
                  <Input type="text" placeholder="Ny interesse" value={interest} onChange={(e) => setInterest(e.target.value.trim())}></Input>
                </InputGroup>
                <ListGroup style={{ marginLeft: "12px", marginTop: "10px" }}>
                  {groupData.interests.map((interest, key) => (
                    <ListGroupItem className={styles.memberListItem} key={key} onClick={() => removeInterest(interest)}>
                      {interest}
                    </ListGroupItem>
                  ))}
                </ListGroup>
                <Button
                  style={{ width: "30%", margin: "12px", backgroundColor: "#537E36" }}
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
            <CardFooter style={{ display: "flex", justifyContent: "center" }}>
              <Button className={styles.submitButton} onClick={submitChanges}>
                Oppdater gruppe
              </Button>
            </CardFooter>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default EditGroup;
