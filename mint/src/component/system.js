import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function System(props) {
    const size = {
        row: [12],
    };

    const self={

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <Row>
            <Col sm={size.row[0]} xs={size.row[0]}>
                System setting here.
            </Col>
        </Row>
    )
}

export default System;