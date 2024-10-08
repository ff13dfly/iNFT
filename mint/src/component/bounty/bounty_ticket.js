import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import Local from "../../lib/local";
import tools from "../../lib/tools";
import Network from "../../network/router";

/* Bounty ticket status and operation
*   @param  {object}    bounty      //bounty data from parent
*   @param  {string}    alink       //bounty anchor link of bounty
*   @param  {boolean}   exsist      //wether ticket exsists
*/

function BountyTicket(props) {
    const size = {
        row: [12],
        buy:[10,2],
    };

    let [price, setPrice]=useState(0);

    let [password, setPassword]=useState("");       //password to buy ticket
    let [show, setShow]=useState(false);
    let [info, setInfo]=useState("");

    const self = {
        changePassword:(ev)=>{
            setPassword(ev.target.value);
        },
        clickJoin:()=>{
            setShow(true);
        },
        clickBuy:()=>{
            setInfo("Ready to buy ticket");
            const fa = Local.get("login");
            
            const chain=Network("anchor");
            chain.load(fa, password, (pair) => {
                console.log(pair);
            });
        },
        clickRecover:()=>{
            setInfo("");
            setShow(false);
        },
        getPasswordStatus:()=>{

        },
        checkTicketStatus:(alink,ck)=>{
            const ak=tools.decode(alink);
            const chain=Network("anchor");
            chain.bounty.exsist(ak.name,ak.block,(bt)=>{
                console.log(bt);
                if(bt!==false){
                    const val=parseFloat(bt.price/chain.accuracy());
                    setPrice(val);
                }
            });
        },
    }
    useEffect(() => {
        //console.log(props)
        if(props.exsist && props.alink) self.checkTicketStatus(props.alink);

    }, [props.alink,props.exsist]);

    return !props.exsist?(
        <Row>
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-warning" onClick={(ev)=>{
                    self.clickJoin(ev);
                }}>Free to Join</button>
            </Col>
        </Row>
    ):(
        <Row>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <small>Ticket <strong>{price}</strong> $ANK </small>
            </Col>
            <Col hidden={show} className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-warning" onClick={(ev)=>{
                    self.clickJoin(ev);
                }}>Join to mint</button>
            </Col>

            <Col hidden={!show} sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-primary" style={{marginRight:"8px"}} onClick={(ev)=>{
                    self.clickBuy(ev);
                }}>Buy Ticket</button>
                <button className="btn btn-md btn-secondary" onClick={(ev)=>{
                    self.clickRecover(ev);
                }}>X</button>
            </Col>
            <Col hidden={!show} className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <input type="password" className="form-control" placeholder="Password"  value={password} onChange={(ev)=>{
                    self.changePassword(ev);
                }}/>
            </Col>
            <Col hidden={!show} sm={size.row[0]} xs={size.row[0]}>
                {info}
            </Col>
        </Row>
    )
}

export default BountyTicket;