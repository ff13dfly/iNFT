import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";

function Web3storage(props) {
    const size = {
        row: [12],
    };


    const self={

    }

    useEffect(() => {
        
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <h5>Write iNFT template to blockchain</h5>
            </Col>
        </Row>
    )
}

export default Web3storage;