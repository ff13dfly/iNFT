import { Container, Row, Col } from "react-bootstrap";
import { useEffect } from "react";

import Header from "../component/common_header";

function Minter(props) {
    const size = {
        row: [12],
    };

    useEffect(() => {
    }, []);

    return (
        <div>
            <Header active="minter" />
            <Container>
                <Row className="pt-2">
                    <Col md={size.row[0]} lg={size.row[0]} xxl={size.row[0]} >
                        <iframe id="minter" title="iNFT minter" src="https://inft.w3os.net/minter" frameborder="0"></iframe>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default Minter;