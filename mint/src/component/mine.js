import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function Mine(props) {
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
                My iNFT list.
            </Col>
        </Row>
    )
}

export default Mine;