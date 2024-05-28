import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

function Seed(props) {
    const size = {
        row: [12],
        back:[10,2],
    };


    const self={
        clickHome:()=>{

        },
    }

    useEffect(() => {
        console.log(props.mnemonic);
    }, [props.update]);

    return (
        <Row>
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {props.anchor}
            </Col>
            <Col className="pb-2 text-end" hidden={!props.back} sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev)=>{
                    self.clickHome(ev);
                }}/>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Seed list
            </Col>
        </Row>
    )
}

export default Seed;