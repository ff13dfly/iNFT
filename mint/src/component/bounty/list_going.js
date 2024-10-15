import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

function ListGoing(props) {
    const size = {
        row: [12],
    };


    let [list , setList]= useState([]);

    const self = {

    }
    useEffect(() => {
        if(props.data) setList(props.data);
    }, [props.data]);

    return (
        <Row >
            <Col sm={size.row[0]} xs={size.row[0]}>
                On progress submission.
            </Col>
            {list.map((row, index) => (
                <Col key={index} sm={size.row[0]} xs={size.row[0]}>{row.inft}</Col>
            ))}
        </Row>
    )
}

export default ListGoing;