import { Container, Row, Col } from "react-bootstrap";

import Header from "../component/common_header";
import SelectNetwork from "../component/select_network";

function Explorer(props) {

    const size = {
        row: [12],
        search:[6,6],
        header: [4,8]
    };

    return (
        <div>
            <Header active={"explorer"} />
            <Container>
                <Row className="pt-2">
                    <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        <SelectNetwork />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Explorer;