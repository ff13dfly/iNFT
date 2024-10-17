import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import Account from "../../system/account";

function ListWinner(props) {
    const size = {
        row: [12],
        grid: [2],
    };

    let [list, setList] = useState([]);
    useEffect(() => {
        if (props.data) setList(props.data);
    }, [props.data]);

    return (
        <Row className="pt-4 pb-2">
            <Col sm={size.row[0]} xs={size.row[0]}>{list.length} {list.length===1?"winner":"winners"}</Col>
            {list.map((row, index) => (
                <Col key={index} sm={size.grid[0]} xs={size.grid[0]}>
                    <img alt="" src={Account.avatar(row.address)} className="winner_thumb pointer" />
                </Col>
            ))}
        </Row>
    )
}

export default ListWinner;