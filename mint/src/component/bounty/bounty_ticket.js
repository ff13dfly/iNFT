import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import Local from "../../lib/local";
import tools from "../../lib/tools";
import Network from "../../network/router";
import TPL from "../../system/tpl";
import BOUNTY from "../../system/bounty";

/* Bounty ticket status and operation
*   @param  {object}    bounty      //bounty data from parent
*   @param  {string}    alink       //bounty anchor link of bounty
*   @param  {boolean}   exsist      //wether ticket exsists
*   @param  {function}  dialog      //system dialog function
*   @param  {function}  fresh       //system fresh function
*/

function BountyTicket(props) {
    const size = {
        row: [12],
        buy:[10,2],
    };

    let [price, setPrice]=useState(0);              //ticket price value
    let [bought,setBoungt]=useState(false);         //wether bought the ticket

    let [password, setPassword]=useState("");       //password to buy ticket
    let [show, setShow]=useState(false);            //wether show password input
    let [info, setInfo]=useState("");               //buying infomation
    let [block, setBlock]=useState(0);              //bought ticket block number

    let [buying,setBuying] =useState(false);        //wether buying...

    const self = {
        changePassword:(ev)=>{
            setPassword(ev.target.value);
        },
        clickJoin:()=>{
            setShow(true);
        },
        clickBuy:()=>{
            setBuying(true);
            setInfo("Ready to buy ticket");
            const fa = Local.get("login");
            const chain=Network("anchor");
            const ak=tools.decode(props.alink);
            chain.load(fa, password, (pair) => {
                //console.log(pair);
                chain.bounty.ticket(pair,ak.name,ak.block,(status)=>{
                    console.log(status);
                    if(status.Finalized){
                        //1.add the template to local and set to default

                        setBuying(false);
                        //2. close the dialog to mint
                    }
                });
            });
        },
        clickRecover:()=>{
            setInfo("");
            setShow(false);
        },
        clickMint:()=>{
            console.log(`Here to set default gene.`);
            BOUNTY.view(props.alink,(bt)=>{
                TPL.change(bt.template.cid,()=>{
                    //console.log(props.fresh);
                    if(props.fresh) props.fresh();
                });
            });
        },
        getPasswordStatus:()=>{

        },
        getAccount:(ck)=>{
            const fa = Local.get("login");
            if(!fa) return ck && ck({error:"Invalid account"});
            try {
                const login=JSON.parse(fa);
                return ck && ck(login);
            } catch (error) {
                return ck && ck({error:"Invalid JSON file."});
            }
        },
        checkTicketStatus:(alink,ck)=>{
            const ak=tools.decode(alink);
            const chain=Network("anchor");
            chain.bounty.exsist(ak.name,ak.block,(bt)=>{
                if(bt!==false){
                    const val=parseFloat(bt.price/chain.accuracy());
                    setPrice(val);
                    self.getAccount((file)=>{
                        chain.bounty.check(ak.name,ak.block,file.address,(res)=>{
                            if(res.block) setBlock(res.block);
                            setBoungt(res===false?false:true);
                        });
                    });
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
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                Free to join
            </Col>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-warning" onClick={(ev)=>{
                    self.clickMint(ev);
                }}>Mint Now</button>
            </Col>
        </Row>
    ):(
        <Row>
            <Col hidden={buying || bought} className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <small>Ticket <strong>{price}</strong> $ANK </small>
            </Col>
            <Col hidden={!show} sm={size.row[0]} xs={size.row[0]}>
                {info}
            </Col>
            <Col hidden={bought} className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-warning" onClick={(ev)=>{
                    self.clickJoin(ev);
                }}>Join to mint</button>
            </Col>
            <Col hidden={!bought} className="text-center" sm={size.row[0]} xs={size.row[0]}>
                Ticket on {block.toLocaleString()}
            </Col>
            <Col hidden={!bought} className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-warning" onClick={(ev)=>{
                    self.clickMint(ev);
                }}>Mint Now</button>
            </Col>
                
            <Col hidden={!show}  sm={size.row[0]} xs={size.row[0]}>
                <input type="password" className="form-control" placeholder="Password"  value={password} onChange={(ev)=>{
                    self.changePassword(ev);
                }}/>
            </Col>
            <Col hidden={!show} className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-secondary" style={{marginRight:"8px"}} onClick={(ev)=>{
                    self.clickRecover(ev);
                }}>X</button>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickBuy(ev);
                }}>Buy Ticket</button>
            </Col>
        </Row>
    )
}

export default BountyTicket;