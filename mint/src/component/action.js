import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function Action(props) {
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
        <div id="footer">
            <Row>
                <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                    <button className="btn btn-lg btn-primary">Mint Now!</button>
                </Col>
            </Row>
        </div>
    )
}

export default Action;