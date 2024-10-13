import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Market from "../market";

function INFTBuy(props) {
    const size = {
        row: [12],
        back: [9, 3],
        right:[4, 8],
        left:[9,3],
    };

    let [password, setPassword] = useState("");         //password of account
    let [disable, setDisable] = useState(false);        //buy button disable
    const self = {
        changePassword:(ev)=>{
            const pass=ev.target.value;
            setDisable(!pass?true:false);
            setPassword(pass);
        },
        clickBack: (ev) => {
            props.dialog(<Market dialog={props.dialog}/>, "Market");
        },
        getAnchorLink:()=>{
            return `anchor://${props.data.name}/${props.data.block}`;
        },
        getThumb:()=>{
            if(props.data.thumb) return props.data.thumb;
            return "";
        },
    }
    useEffect(() => {
       console.log(props.data);
    }, []);

    return (
        <Row >
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {self.getAnchorLink()}
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col sm={size.right[0]} xs={size.right[0]}>
                <img alt="" src={self.getThumb()} className="apply_thumb" />
            </Col>
            <Col sm={size.right[1]} xs={size.right[1]}>
                
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}><hr /></Col>
            <Col sm={size.left[0]} xs={size.left[0]}>
                <input 
                    type="password" 
                    className="form-control"
                    placeholder="Password of account to buy"
                    hidden={false}
                    value={password} 
                    onChange={(ev) => {
                        self.changePassword(ev);
                    }} />
            </Col>
            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-md btn-primary">Buy</button>
            </Col>
        </Row>
    )
}

export default INFTBuy;