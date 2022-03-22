import React, { useEffect } from "react";
import AllGroupsList from "../components/allGroupsList";
import NavigationBar from "../components/navBar";
import { useState } from "react";
import { Button, Container, Card, Row, CardGroup, width, Input, Label, Col, Option, Spinner } from "reactstrap";
import { fetchTags, fetchLocations } from "../utils/requests";

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
    setFilterFunction(

      (group) => (group) =>
    {
      return (group.minimum_age && filterObject.age ? group.minimum_age >= filterObject.age : true) &&
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
    }
    );
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
    <div className="">
      <NavigationBar />
      <Container fluid style={{ margin: "10px", marginLeft: "0px" }}>
        <CardGroup>
          <Card style={{ minWidth: "400px" }}>
            <AllGroupsList filterFunction={filterFunction} />
          </Card>

          <Card style={{ minWidth: "300px", maxWidth: "350px" }}>
            <div style={{ margin: "10px" }}>
              <h5>Filtrer gruppene</h5>
              <Row>
                <Label>Aldersgrense</Label>
                <Input type="number" onChange={(e) => updateFilterInfo("age", e.target.value)}></Input>
              </Row>
              <Row>
                <Label>Gruppestørrelse</Label>
                <Col>
                  <Input type="number" placeholder="Nedre grense" onChange={(e) => updateFilterInfo("sizeMin", e.target.value)}></Input>
                </Col>
                <Col>
                  <Input type="number" placeholder="Øvre grense" onChange={(e) => updateFilterInfo("sizeMax", e.target.value)}></Input>
                </Col>
              </Row>
              <Row>
                <Label>Lokasjon</Label>
              </Row>
              <Row>
                <Input type="select" onChange={(e) => updateFilterInfo("location", e.target.value)}>
                  {[<option value={null}>Alle</option>].concat(
                    locations.map((location) => <option value={location}>{locationMap[location]}</option>)
                  )}
                </Input>
              </Row>
              <Row>
                <Label>Tag</Label>
              </Row>
              <Row>
                <Input type="select" onChange={(e) => updateFilterInfo("tag", e.target.value)}>
                  {[<option value={""}>Alle</option>].concat(tags.map((tag) => <option value={tag}>{tagMap[tag]}</option>))}
                </Input>
              </Row>
              <Row>
                <Label>Interesse</Label>
              </Row>
              <Row>
                <Input type="text" placeholder="Interesse" onChange={(e) => updateFilterInfo("interest", e.target.value)}></Input>
              </Row>
              <Row>
                <Label>Dato for ønsket aktivitet</Label>
              </Row>
              <Row>
                <Label>Fra</Label>
                <Input type="date" onChange={(e) => updateFilterInfo("start_date", e.target.value)}></Input>
                <Label>Til</Label>
                <Input type="date" onChange={(e) => updateFilterInfo("end_date", e.target.value)}></Input>
              </Row>
              <Button className="btn btn-dark" onClick={() => applyFilters(filterInfo)}>
                Filtrer
              </Button>
            </div>
          </Card>
        </CardGroup>
      </Container>
    </div>
  );
};

export default FindGroups;
