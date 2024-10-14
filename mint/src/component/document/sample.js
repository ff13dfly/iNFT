import { Row, Col } from "react-bootstrap";

function DocumentWhat(props) {
    const size = {
        row: [12],
    };

    return (
        <Row >
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
            </Col>
        </Row>
    )
}

export default DocumentWhat;