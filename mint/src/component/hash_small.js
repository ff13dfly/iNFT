import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function SmallHash(props) {
    const size = {
        row: [12],
    };

    let [list, setList]=useState([]);

    const self={
        fresh:()=>{
        },
    }

    useEffect(() => {
        self.fresh();

    }, [props.hash,props.start,props.step]);

    return (
        <Row className="unselect">
            {list.map((row, index) => (
                <Col className="hash" sm={size.row[0]} xs={size.row[0]}>

                </Col>
            ))}
        </Row>
    )
}

export default SmallHash;