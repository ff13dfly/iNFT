import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import Account from "../../system/account";

function ListWinner(props) {
    const size = {
        row: [12],
        grid: [2],
    };

    let [list, setList] = useState([]);

    const self = {

    }

    useEffect(() => {
        if (props.data) setList(props.data);
    }, []);

    return (
        <Row className="pt-4 pb-2">
            <Col sm={size.row[0]} xs={size.row[0]}>10 Winners</Col>
            {list.map((row, index) => (
                <Col key={index} sm={size.grid[0]} xs={size.grid[0]}>
                    <img alt="" src={Account.avatar("abc")} className="winner_thumb pointer" />

                </Col>
            ))}
            <Col sm={size.grid[0]} xs={size.grid[0]}>
                <img alt="" src={Account.avatar("abc")} className="winner_thumb pointer" />

            </Col>
            <Col sm={size.grid[0]} xs={size.grid[0]}>
                <img alt="" src={Account.avatar("abcd")} className="winner_thumb pointer" />

            </Col>
            <Col sm={size.grid[0]} xs={size.grid[0]}>
                <img alt="" src={Account.avatar("abc1")} className="winner_thumb pointer" />

            </Col>
        </Row>
    )
}

export default ListWinner;