import { useParams } from "react-router-dom";

import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Header from "../components/header";

function View(props) {

    let { anchor } = useParams();
    console.log(anchor);

    const size = {
        row: [12],
        flow:[3,6,3]
    };

    const self={

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <div>
            <Header active={"market"} />
            <Row className="pt-2">
                <Col className="text-center" sm={size.flow[0]} xs={size.flow[0]}>
                    View page to get hash.
                </Col>
            </Row>
        </div>
    )
}

export default View;