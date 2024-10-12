import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Bounty from "../bounty";

function BountyApply(props) {
    const size = {
        row: [12],
    };


    const self = {
        clickBack: (ev) => {
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink} />, "Bounty");
        },
    }
    useEffect(() => {
       
    }, []);

    return (
        <Row >
            <Col sm={size.row[0]} xs={size.row[0]}></Col>
        </Row>
    )
}

export default BountyApply;