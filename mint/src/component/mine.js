import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function Mine(props) {
    const size = {
        row: [12],
        list:[6],
    };

    let [list,setList] = useState([]);

    const self = {

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <Row>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                My iNFT list.
            </Col>
            {list.map((row, index) => (
                <Col key={index} sm={size.list[0]} xs={size.list[0]}>
                    {JSON.stringify(row)}
                </Col>
            ))}
        </Row>
    )
}

export default Mine;