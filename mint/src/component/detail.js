import { Row, Col, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

import Account from "./account";
import Template from "./template";
import Mine from "./mine";
import { FaBackspace,FaPuzzlePiece,FaSyncAlt,FaLongArrowAltDown,FaLongArrowAltUp } from "react-icons/fa";

function Detail(props) {
    const size = {
        row: [12],
        back:[9,3],
        title:[2,7,3],
        thumb:[7,5],
        hash: [10,2],
    };

    const dialog=props.dialog;
    const alink=props.alink;

    let [width, setWidth]= useState(200);
    let [height, setHeight]= useState(200);
    let [hash, setHash] = useState("0x123456abcdef123467890");
    let [bs64, setBS64] =useState("image/empty.png");
    let [parts, setParts] =useState([]);
    let [mask, setMask]= useState(0);                   //Mask的数量

    const self={
        clickBack:()=>{
            dialog(<Template fresh={props.fresh} dialog={props.dialog} />,"Template");
        },
    }
    useEffect(() => {

       //console.log(alink);
    }, [props.update]);

    return (
        <Row className="pt-1">
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                Alink: <strong>{props.alink}</strong> 
            </Col>
             <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace size={40} color={"#FFAABB"} onClick={(ev)=>{
                    self.clickBack(ev);
                }}/>
            </Col>
            
            <Col sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col sm={size.thumb[0]} xs={size.thumb[0]}>
                        <canvas width={width} height={height}></canvas>
                    </Col>
                    <Col sm={size.thumb[1]} xs={size.thumb[1]}>
                        Parts list:
                        <ListGroup as="ul" style={{cursor:"pointer"}}>
                            <ListGroup.Item as="li" active={true}>
                                <FaPuzzlePiece size="20" color={"#AAAAAA"}/> #1
                            </ListGroup.Item>
                            <ListGroup.Item as="li" active={false}>
                                <FaPuzzlePiece size="20" color={"#AAAAAA"}/> #2
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.hash[0]} xs={size.hash[0]}>
                Mock hash: 0xabc123abc123<span className="bg-warning"><strong> ab </strong></span>123abc12
            </Col>
            <Col className="text-end" sm={size.hash[1]} xs={size.hash[1]}>
                <FaSyncAlt size={24} color={"#FFAABB"}/> 
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                From 24 to 26, hexadecimal value <strong> 231 </strong>, offset value 0<br />
                Target <strong> 231%16 = 12 </strong>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <FaLongArrowAltDown size={24} color={"#FFAABB"} className="pr-2"/>
                <span style={{fontSize:"24px"}} className="mt-2">0</span>
                <FaLongArrowAltUp size={24} color={"#FFAABB"} className="pl-2"/> 
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <img src={bs64} style={{width:"100%"}} alt=""/>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                        Cover here, the same as editor
            </Col>
        </Row>
    )
}

export default Detail;