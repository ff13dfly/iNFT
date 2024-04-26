import { Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

//show the hash used by iNFT.

function Hash(props) {
    const size = {
        row: [12],
    };

    const self={

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <Row className="unselect">
            <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                80<span className="text-warning">8f</span>9fa6d081ed02
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"34px"}}>#0</Badge>
            </Col>
            <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                335d0cb5d481<span className="text-warning">cf</span>81
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"195px"}}>#5</Badge>
            </Col>
            <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                d2bb38<span className="text-warning">38</span>382dfd33
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"98px"}}>#1</Badge>
            </Col>
            <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                265<span className="text-warning">19</span>55138<span className="text-warning">7c</span>1a2e
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"50px"}}>#2</Badge>
                <Badge style={{marginLeft:"84px"}}>#3</Badge>
            </Col>
        </Row>
    )
}

export default Hash;