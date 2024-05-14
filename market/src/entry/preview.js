import { useParams } from "react-router-dom";

import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Header from "../components/header";

function Preview(props) {

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
            <Header />
            <Row className="pt-2">
                <Col className="text-center" sm={size.flow[0]} xs={size.flow[0]}>
                    template previewer.
                </Col>
            </Row>
        </div>
    )
}

export default Preview;