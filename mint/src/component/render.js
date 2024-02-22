import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function Preview(props) {
    const size = {
        row: [12],
    };

    let [width,setWidth]    =useState(400);
    let [height, setHeight] =useState(400);
    const self={

    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row className="pt-4">
            <Col className="text-center pt-4" sm={size.row[0]} xs={size.row[0]}>
                Blockchain network information here.
            </Col>
            <Col className="text-center pt-4" sm={size.row[0]} xs={size.row[0]}>
                <canvas  width={width} height={height} id="previewer"></canvas>
            </Col>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <small>Information here.</small>
            </Col>
        </Row>
    )
}

export default Preview;