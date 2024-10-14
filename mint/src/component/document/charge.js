import { Row, Col } from "react-bootstrap";

function DocumentCharge(props) {
    const size = {
        row: [12],
    };

    return (
        <Row >
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <h4>How to get $ANK</h4>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                It is the Web3.0 account
            </Col>
        </Row>
    )
}

export default DocumentCharge;