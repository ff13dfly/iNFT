import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Hash from "./hash";
import Counter from "./counter";
import INFT from "./inft";

import tools from "../lib/tools";

import Network from "../network/router";

function Preview(props) {
    const size = {
        row: [12],
        header:[4,8],
    };

    let [block, setBlock] = useState(0);
    let [hash, setHash] = useState("0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f889fea9bb");
    let [start, setStart]=useState(0);

    let first=true;
    const self = {
        fresh:()=>{
            setTimeout(() => {
                Network("tanssi").subscribe("preview",(bk, bhash)=>{
                    setBlock(bk);
                    setHash(bhash);

                    if(!first){
                        start++;
                        setStart(start);        //start counter at right time
                    }else{
                        first=false;
                    }
                });
            }, 50);
        }
    }

    useEffect(() => {
        self.fresh();
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col className="text-center pb-1" sm={size.row[0]} xs={size.row[0]}>
                <INFT hash={hash} offset={[]} id={"pre_home"}/>
            </Col>
            <Col className="pt-4" sm={size.header[0]} xs={size.header[0]}>
                <Counter start={start}/>
            </Col>
            <Col className="pt-1" sm={size.header[1]} xs={size.header[1]}>
                <Hash hash={hash} at={4}/>
            </Col>
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]}>
                Block {block.toLocaleString()}, Tanssi Network
            </Col>
        </Row>
    )
}

export default Preview;