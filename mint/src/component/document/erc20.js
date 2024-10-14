import { Row, Col } from "react-bootstrap";

function DocumentERC20(props) {
    const size = {
        row: [12],
    };

    return (
        <Row >
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <h4>What's ERC20 $INFT</h4>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                It is the asset on Ethereum Network.
            </Col>
        </Row>
    )
}

export default DocumentERC20;