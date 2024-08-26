import {  Row, Col } from "react-bootstrap";
import { useState } from "react";

import Minting from "../component/common/common_minting";

function Blacksmith(props) {
    const size = {
        row: [12],
        layout: [8,4]
    };

    const self = {

    }
    return (
        <Row className="pt-2">
            <Col className="pt-2" md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]} >
                Multi Account Task here.
            </Col>
            <Col className="pt-2" md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]} >
                <Minting uuid={"blacksmith_minting"} template={""}/>
            </Col>
        </Row>
    )
}

export default Blacksmith;