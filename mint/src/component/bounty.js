import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import tools from "../lib/tools";
import Copy from "../lib/clipboard";
import TPL from "../system/tpl";
import Network from "../network/router";

import BountyTicket from "./bounty/bounty_ticket";
import BountyBonus from "./bounty/bounty_bonus";
import Chat from "./common/chat";

import BOUNTY from  "../system/bounty";

import { FaAngleLeft, FaAngleRight,FaComments,FaCopy } from "react-icons/fa";

/* Bounty entry
*   @param  {string}    alink       //bonus anchor link
*   @param  {function}  dialog      //system dialog function
*   @param  {boolean}   fresh       //wether fresh 
*/
function Bounty(props) {
    const size = {
        row: [12],
        page: [4, 4, 4],
        right: [3, 9],
        left: [7, 5],
        title:[10,2],
    };

    let [page, setPage] = useState(1);          //bounty page
    let [list, setList] = useState([]);         //bounty list
    let [single, setSingle] = useState({});     //bounty data with template and on-chain orgin data
    let [alink, setAlink] = useState("");       //bounty anchor link
    let [exsist, setExsist]= useState(false);   //wether bounty ticket setting
    let [recover, setRecover] = useState({});

    const self = {
        clickPrevious: (ev) => {
            setPage(page - 1);
            self.show(list[page-2]);
        },
        clickNext: (ev) => {
            self.show(list[page]);
            setPage(page+1);
        },
        clickChat: (ev) => {
            props.dialog(<Chat
                dialog={props.dialog}
                alink={alink}
                callback={()=>{
                    props.dialog(<Bounty alink={alink} dialog={props.dialog}/>,"Bounty");
                }}
            />, "Bounty Comments");
        },
        clickCopy: (name) => {
            Copy(name);
        },
        clickRecover: (key, at) => {
            if (!recover[key]) {
                recover[key] = "text-info";
                setRecover(tools.copy(recover));
                setTimeout(() => {
                    delete recover[key];
                    setRecover(tools.copy(recover));
                }, !at ? 1000 : at);
            }
        },
        checkExsist:(alink)=>{
            const chain = Network("anchor");
            const ak = tools.decode(alink);
            chain.bounty.exsist(ak.name,ak.block,(bt)=>{
                setExsist(bt);
            });
        },

        prepareData: (list, ck, bts) => {
            if (!bts) bts = [];
            if (list.length === 0) return ck && ck(bts);
            const alink = list.pop();
            self.checkExsist(alink);    //check ticket exsist

            const anchor = tools.decode(alink);
            const chain = Network("anchor");
            chain.view(anchor, "anchor", (res) => {
                if (res === false) return self.prepareData(list, ck, bts);
                if (!res.raw || !res.raw.template || !res.raw.template.cid) return self.prepareData(list, ck, bts);
                const cid = res.raw.template.cid;
                TPL.view(cid, (dt) => {
                    const row={
                        alink:alink,
                        template:res.raw.template,
                        orgin:res,
                    }
                    row.template.raw = dt;
                    bts.push(row);
                    return self.prepareData(list, ck, bts);
                });
            });
        },
        calcSum:(bonus)=>{
            let sum=0;
            let amount=0;
            for(let i=0;i<bonus.length;i++){
                const row=bonus[i];
                amount+=row.amount;
                sum+=row.amount*row.bonus;
            }
            return [sum,amount];
        },
        removeBounty:(alink)=>{
            const narr=[];
            for(let i=0;i<list.length;i++){
                if(list[i]!==alink) narr.push(list[i]);
            }
            setList(narr);
            if(page===narr.length) return narr[narr.length-1];
            return narr[page];
        },
        show:(alink)=>{
            BOUNTY.view(alink,(bt)=>{
                if(bt.error) {
                    const replace=self.removeBounty(alink);
                    return self.show(replace);
                }
                setAlink(alink);            //update alink
                setSingle(bt);              //update bounty data
            });
        },
        getTotal:()=>{
            return list.length;
        },
        getDesc:()=>{
            if(single && single.raw && single.raw.desc) return single.raw.desc;
            return "No desc of this bounty.";
        },
        getTitle:()=>{
            if(single && single.raw && single.raw.title) return single.raw.title;
            return "No title";
        },
        getSumOfBonus:()=>{
            if(single && single.raw && single.raw.bonus){
                const [sum_bonus,pieces]=self.calcSum(single.raw.bonus);
                return {sum:sum_bonus,pieces:pieces};
            }
            return {sum:0,pieces:0};
        },
        getPage:(alink,arr)=>{
            for(let i=0;i<arr.length;i++){
                if(alink===arr[i]) return i+1;
            }
            return 1;
        },
        getAlink:()=>{
            if(props.alink) return props.alink;
            return alink;
        },
        //failed vs success anchor data
        test:()=>{
            const name="ivnfxmtfhjbc_20"
            const block=374363;
            const chain = Network("anchor");
            chain.view({name:name,block:block}, "anchor", (dt) => {
                console.log(dt);
            });

            chain.view({name:name}, "anchor", (dt) => {
                console.log(dt);
            });
        },
    }
    useEffect(() => {
        console.log(props)
        BOUNTY.list((bts)=>{
            setList(bts);
            //router right bounty by alink
            if(!props.alink){
                self.show(bts[page-1]);
            }else{
                const p=self.getPage(props.alink,bts);
                setPage(p);
                self.show(props.alink);
            }
        });
    }, [props.update]);

    return (
        <Row>
            <Col sm={size.title[0]} xs={size.title[0]}>
                <h5>{self.getTitle()}</h5>
                <p>{self.getDesc()}</p>
            </Col>
            <Col className="pt-2 text-end" sm={size.title[1]} xs={size.title[1]}>
                <button className="btn btn-sm btn-secondary" onClick={(ev) => {
                    self.clickChat(ev)
                }}>
                    <FaComments className="" size={24} />
                </button>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-sm btn-secondary pr-2" onClick={(ev) => {
                    self.clickCopy(self.getAlink());
                    self.clickRecover("name");
                }}>
                    <FaCopy className={!recover.name ? "" : recover.name} />
                </button>
                <strong className="pt-1">{self.getAlink()}</strong>
            </Col>   
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col> 
            
            <BountyBonus dialog={props.dialog} alink={alink} ticket={exsist}/>

            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col className="text-center pt-2" sm={size.left[0]} xs={size.left[0]}>
                Total <strong className="text-info">{self.getSumOfBonus().pieces.toLocaleString()}</strong>p wanted.<br />
                Prize <strong className="text-info">{self.getSumOfBonus().sum.toLocaleString()}</strong> $ANK.<br/>
            </Col>
            <Col className="text-center pb-1" sm={size.left[1]} xs={size.left[1]}>
                <BountyTicket bounty={single} alink={alink} exsist={exsist} fresh={props.fresh} dialog={props.dialog}/>
            </Col>

            <Col className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="" sm={size.page[0]} xs={size.page[0]}>
                        <FaAngleLeft className="pointer" size={36} hidden={page<=1} onClick={(ev) => {
                            self.clickPrevious(ev);
                        }} />
                    </Col>
                    <Col className="text-center unselect" sm={size.page[1]} xs={size.page[1]}>
                        <h4> {page} / {self.getTotal()} </h4>
                    </Col>
                    <Col className="text-end" sm={size.page[2]} xs={size.page[2]}>
                        <FaAngleRight className="pointer" size={36} hidden={page>=self.getTotal()} onClick={(ev) => {
                            self.clickNext(ev);
                        }} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Bounty;