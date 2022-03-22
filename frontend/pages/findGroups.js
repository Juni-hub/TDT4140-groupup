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
    setFilterFunction((group) => (group) => group["minimum_age"] ? group["minimum_age"] >= filterObject.age : true);
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
console.log(loading)
  return loading.some(l => l) ? (
    <Spinner></Spinner>
  ) : (
    <div className="">
      {
        //Imports navBar component
      }
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
                <Input type="select">
                  {locations.map((location) => (
                    <Option></Option>
                  ))}
                </Input>
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
