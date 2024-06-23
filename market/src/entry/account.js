import { Row, Col } from "react-bootstrap";
import { useState } from "react";

function Account(props) {
    const size = {
        row: [12],
    };

    let [update, setUpdate] = useState(0);

    const self = {
        fresh: () => {
            setUpdate(update + 1);
        },
    }
    return (
        <Row className="pt-2">
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                Account details
            </Col>
        </Row>
    )
}

export default Account;