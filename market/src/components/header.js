import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";


function Header(props) {
    const size = {
        row: [12],
        flow:[3,6,3]
    };

    const self={

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col className="text-center" sm={size.flow[0]} xs={size.flow[0]}>
                Home page
            </Col>
        </Row>
    )
}

export default Header;