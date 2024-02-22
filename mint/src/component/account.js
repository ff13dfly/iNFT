import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function Account(props) {
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
                Account Management
            </Col>
        </Row>
    )
}

export default Account;