import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Market from "../market";

import tools from "../../lib/tools";
import Account from "../../system/account";
import Network from "../../network/router";

function INFTBuy(props) {
    const size = {
        row: [12],
        back: [9, 3],
        right:[ 4 ,8],
        left:[9, 3],
    };

    let [password, setPassword] = useState("");         //password of account
    let [disable, setDisable] = useState(false);        //buy button disable
    let [info, setInfo] = useState("");                 //buying infomation

    const self = {
        changePassword:(ev)=>{
            const pass=ev.target.value;
            setDisable(!pass?true:false);
            setPassword(pass);
        },
        clickBack: (ev) => {
            props.dialog.show(<Market dialog={props.dialog}/>, "Market");
        },
        clickBuy:(ev)=>{
            setDisable(true);
            Account.keyring(password,(pair)=>{
                if(pair.error){
                    setPassword("");
                    return setInfo(pair.error);
                }

                const chain=Network("anchor");
                const name=props.data.name;
                chain.buy(pair,name,(res)=>{
                    setPassword("");
                    if(res.error){
                        return setInfo(res.error);
                    }
                    setInfo(res.msg);
                });
            });
        },
        getAnchorLink:()=>{
            return `anchor://${props.data.name}/${props.data.block}`;
        },
        getThumb:()=>{
            if(props.data.thumb) return props.data.thumb;
            return "";
        },
        getPrice:()=>{
            if(props.data.price) return props.data.price;
            return 0;
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
                <strong className="text-warning">{self.getPrice()}</strong> $ANK
            </Col>
            <Col className="text-end" sm={size.right[1]} xs={size.right[1]}>
                {tools.shorten(props.data.owner)}
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <img alt="" src={self.getThumb()} className="apply_thumb" />
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
                <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev)=>{
                    self.clickBuy(ev);
                }}>Buy</button>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>{info}</Col>
        </Row>
    )
}

export default INFTBuy;