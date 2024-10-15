import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

function ListWinner(props) {
    const size = {
        row: [12],
    };

    let [list , setList]= useState([]);

    const self = {

    }

    useEffect(() => {
       if(props.data) setList(props.data);
    }, []);

    return (
        <Row >
            <Col sm={size.row[0]} xs={size.row[0]}></Col>
            {list.map((row, index) => (
                <Col key={index} sm={size.row[0]} xs={size.row[0]}>{row.address}</Col>
            ))}
        </Row>
    )
}

export default ListWinner;