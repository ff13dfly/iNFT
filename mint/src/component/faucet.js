import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Faucet(props) {
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
                Faucet functions here.
            </Col>
        </Row>
    )
}

export default Faucet;