import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";

import Grid from "./grid";

function Bounty(props) {
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
                Bounty list to show.
            </Col>
        </Row>
    )
}

export default Bounty;