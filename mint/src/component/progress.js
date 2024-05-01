import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Progress(props) {
    const size = {
        row: [12],
        offset:[1,9,2],
        multi:[4,4,4]
    };

    let [list,setList]=useState([]);

    const self={

    }

    useEffect(() => {
        setList([1,2,3,4])
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col sm={size.row[0]} xs={size.row[0]}>
                On progress list:
            </Col>
        </Row>
    )
}

export default Progress;