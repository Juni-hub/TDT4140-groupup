import React from 'react';
import { Col } from "reactstrap";

const GroupBox = (props) => {
  return (
        <Col md={2}>
                <div class="text-center p-3 bg-light text-dark rounded">
                    <h5>{props.title}</h5>
                    <img src= {props.picture} alt="Group Picture"/>
                </div>
        </Col>
  )
}

export default GroupBox;
