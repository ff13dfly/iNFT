import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";

function Document(props) {
    const size = {
        row: [12],
    };
    const self={
        
    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row>
            <Col className="pt-4 text-center" sm={size.row[0]} xs={size.row[0]}>
                iNFT document
            </Col>
        </Row>
    )
}

export default Document;