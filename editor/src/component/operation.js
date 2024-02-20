import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Operation(props) {
    const size = {
        row: [12],
        write:[7,5],
    };

    let [disable, setDisable]=useState(true);

    useEffect(() => {

    }, []);

    return (
        <Row className="pt-2">
            <Col lg={size.write[0]} xl={size.write[0]} xxl={size.write[0]} >
                Write iNFT definition to Anchor Network.
            </Col>
            <Col className="text-end" lg={size.write[1]} xl={size.write[1]} xxl={size.write[1]} >
                <button disabled={disable} className="btn btn-md btn-primary">Write iNFT Template</button>
            </Col>
        </Row>
    )
}

export default Operation;