import { Button, Container, Card, Row, CardGroup, width, Input, Label, Col, Option, Spinner, CardHeader, InputGroup, InputGroupText, CardBody, CardFooter } from "reactstrap";
import { fetchTags, fetchLocations } from "../../../utils/requests";
import AllGroupsList from "../../../components/allGroupsList";
import NavigationBar from "../../../components/navBar";
import React from "react";
import { useState, useEffect } from "react";

const FindGroups = () => {
  const [query, setQuery] = useState("");
  const [filterInfo, setFilterInfo] = useState({});
  const [filterFunction, setFilterFunction] = useState(null);
  const [locations, setLocations] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [tags, setTags] = useState(null);
  const [tagMap, setTagMap] = useState(null);

  const updateFilterInfo = (field, value) => {
    setFilterInfo({
      ...filterInfo,
      [field]: value,
    });
  };

  const applyFilters = (filterObject) => {
    setFilterFunction((group) => (group) => {
      return (
        (group.minimum_age && filterObject.age ? group.minimum_age >= filterObject.age : true) &&
        (filterObject.sizeMin || filterObject.sizeMax
          ? group.member_limit
            ? (filterObject.sizeMin ? filterObject.sizeMin <= group.member_limit : true) &&
              (filterObject.sizeMax ? filterObject.sizeMax >= group.member_limit : true)
            : false
          : true) &&
        (filterObject.location ? (group.location ? group.location.location_name == filterObject.location : false) : true) &&
        (filterObject.tag ? (group.tags ? group.tags.find((tag) => tag.tag_name == filterObject.tag) : false) : true) &&
        (filterObject.interest
          ? group.interests
            ? group.interests.find((interest) => interest.interest_name.toLowerCase() == filterObject.interest.toLowerCase())
            : false
          : true) &&
        (filterObject.start_date || filterObject.end_date
          ? group.activity_date
            ? (filterObject.start_date ? Date.parse(filterObject.start_date) < Date.parse(group.activity_date) : true) &&
              (filterObject.end_date ? Date.parse(filterObject.end_date) > Date.parse(group.activity_date) : true)
            : false
          : true)
      );
    });
  };

  useEffect(() => {
    fetchTags().then((data) => {
      setTags(data.tags);
      setTagMap(data.tagMap);
    });
    fetchLocations().then((data) => {
      setLocations(data.locations);
      setLocationMap(data.locationMap);
    });
  }, []);
  return !(tags && locations && tagMap && locationMap) ? (
    <Spinner></Spinner>
  ) : (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <NavigationBar />
      <Container fluid>
        <Row style={{margin:"10px"}}>
        <Col sm={10}></Col>
          {
            //Card that contains the whole filter view.
          <Card style={{ marginRight: "40px", minWidth: "350px", maxWidth: "800px", padding:"0" }}>
            <CardHeader style={{backgroundColor:"#ABD08D", fontSize:"22px"}}>
              Utforsk grupper
            </CardHeader>
            <AllGroupsList filterFunction={filterFunction} />
          </Card>
          }
          <Col sm={2}>
          <Card
            style={{
              minWidth: "400px",
              maxWidth: "450px",
              maxHeight: "700px",
              padding:"0"
            }}>
              <CardHeader style={{backgroundColor:"#ABD08D", fontSize:"22px", margin:"0"}}>
                Filtrer gruppene
              </CardHeader>
              <CardBody>
                <InputGroup>
                  <InputGroupText style={{width:"140px"}}>Aldersgrense</InputGroupText>
                  <Input type="number" onChange={(e) => updateFilterInfo("age", e.target.value ? Number(e.target.value) : "")}></Input>
                </InputGroup>
                <br/>
                <InputGroup>
                  <InputGroupText style={{width:"140px"}}>Gruppestørrelse</InputGroupText>
                    <Input
                      type="number"
                      placeholder="Nedre grense"
                      onChange={(e) => updateFilterInfo("sizeMin", e.target.value ? Number(e.target.value) : "")}
                    ></Input>
                    <Input
                      type="number"
                      placeholder="Øvre grense"
                      onChange={(e) => updateFilterInfo("sizeMax", e.target.value ? Number(e.target.value) : "")}
                    ></Input>
                </InputGroup>
                <br/>
                <InputGroup>
                  <InputGroupText style={{width:"140px"}}>Lokasjon</InputGroupText>
                  <Input type="select" onChange={(e) => updateFilterInfo("location", e.target.value)}>
                    {[<option value={""}>Alle</option>].concat(locations.map((location) => <option value={location}>{locationMap[location]}</option>))}
                  </Input>
                </InputGroup>
                <br/>
                <InputGroup>
                  <InputGroupText style={{width:"140px"}}>Tag</InputGroupText>
                  <Input type="select" onChange={(e) => updateFilterInfo("tag", e.target.value)}>
                    {[<option value={""}>Alle</option>].concat(tags.map((tag) => <option value={tag}>{tagMap[tag]}</option>))}
                  </Input>
                </InputGroup>
                <br/>
                <InputGroup>
                  <InputGroupText style={{width:"140px"}}>Interesse</InputGroupText>
                  <Input type="text" placeholder="Interesse" onChange={(e) => updateFilterInfo("interest", e.target.value)}></Input>
                </InputGroup>
                <br/>
                <InputGroup>
                  <InputGroupText style={{width:"100%"}}>Dato for ønsket aktivitet</InputGroupText>
                </InputGroup>
                <br/>
                <InputGroup>
                  <InputGroupText style={{width:"140px"}}>Fra</InputGroupText>
                  <Input type="date" onChange={(e) => updateFilterInfo("start_date", e.target.value)}></Input>
                </InputGroup>
                <br/>
                <InputGroup>
                  <InputGroupText style={{width:"140px"}}>Til</InputGroupText>
                  <Input type="date" onChange={(e) => updateFilterInfo("end_date", e.target.value)}></Input>
                </InputGroup>
                <br/>
              </CardBody>
              <CardFooter>
                  <Button style={{backgroundColor:"#537E36"}} onClick={() => applyFilters(filterInfo)}>
                    Filtrer
                  </Button>
              </CardFooter>
          </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FindGroups;
