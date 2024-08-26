import { Row, Col } from "react-bootstrap";
import { useState } from "react";

import CreativityBasic from "../component/creativity/creativity_basic"

function Creativity(props) {
    const size = {
        row: [12],
        layout: [2,10]
    };

    const self = {

    }
    return (
        <Row className="pt-2">
            <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]} >
                <CreativityBasic />
            </Col>
            <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]} >
                Operation here.
            </Col>
        </Row>
    )
}

export default Creativity;