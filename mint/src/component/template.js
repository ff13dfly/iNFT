import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function Template(props) {
    const size = {
        row: [12],
    };

    const self = {

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <Row>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                Template Management
            </Col>
        </Row>
    )
}

export default Template;