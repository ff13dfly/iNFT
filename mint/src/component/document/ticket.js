import { Row, Col } from "react-bootstrap";

function DocumentTicket(props) {
    const size = {
        row: [12],
    };

    return (
        <Row >
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <h4>What is bounty ?</h4>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                As the name, it is the ticket you need to buy.
            </Col>
        </Row>
    )
}

export default DocumentTicket;