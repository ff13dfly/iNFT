import { Container, Row, Col } from "react-bootstrap";
import { useEffect } from "react";

import Header from "../component/common_header";

function Editor(props) {
    const size = {
        row: [12],
    };

    useEffect(() => {
    }, []);

    return (
        <div>
            <Header active="editor" />
            <Container>
                <Row>
                    <Col md={size.row[0]} lg={size.row[0]} xxl={size.row[0]} >
                        <iframe id="minter" title="iNFT minter" src="https://inft.w3os.net/editor" frameBorder="0"></iframe>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default Editor;