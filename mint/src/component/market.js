import { Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";

import AnchorJS from "../network/anchor";
import INFT from "../system/inft";

function Market(props) {
    const size = {
        row: [12],
        half:[6],
    };

    let [list, setList]=useState([]);

    const self={
        fresh:()=>{
            AnchorJS.market((arr)=>{
                console.log(arr);
                setList(arr);
                // INFT.render(arr,(fs)=>{
                //     console.log(fs);
                //     setList(fs);
                // });
            });
        },
    }
    useEffect(() => {

        self.fresh();
    }, []);

    return (
        <Row>
            {list.map((row, index) => (
                <Col className="pt-2" key={index} sm={size.half[0]} xs={size.half[0]}>
                    {row.name}:  $ANK {row.price}
                </Col>
            ))}
        </Row>
    )
}

export default Market;