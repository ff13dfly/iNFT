import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Flow(props) {
    const size = {
        row: [12],
        flow:[2,2,4,2,2]
    };
    const self={

    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col className="text-center" sm={size.flow[0]} xs={size.flow[0]}>0</Col>
            <Col className="text-center" sm={size.flow[1]} xs={size.flow[1]}>0</Col>
            <Col className="text-center" sm={size.flow[2]} xs={size.flow[2]}>0</Col>
            <Col className="text-center" sm={size.flow[3]} xs={size.flow[3]}>0</Col>
            <Col className="text-center" sm={size.flow[4]} xs={size.flow[4]}>0</Col>
        </Row>
    )
}

export default Flow;