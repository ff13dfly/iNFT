import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import API from "../system/api";
import tools from "../lib/tools";
import TPL from "../system/tpl";
import Network from "../network/router";

import BountyTicket from "./bounty/bounty_ticket";
import BountyBonus from "./bounty/bounty_bonus";
import BountyChat from "./bounty/bounty_chat";

function Bounty(props) {
    const size = {
        row: [12],
        page: [4, 4, 4],
        right: [3, 9],
        left: [7, 5],
    };

    let [page, setPage] = useState(1);          //bounty page
    let [total, setTotal]= useState(2);         //
    let [single, setSingle] = useState({});     //bounty data with template and on-chain orgin data
    let [bonus, setBonus] = useState([]);       //bonus list
    let [alink, setAlink] = useState("");       //bounty anchor link
    let [exsist, setExsist]= useState(false);   //wether bounty ticket setting
    let [sum, setSum]= useState(0);             //total bonus prize
    let [amount,setAmount]= useState(0);        //total needed pieces

    const self = {
        clickPrevious: (ev) => {
            setPage(page - 1);
            self.fresh(page - 1);
        },
        clickNext: (ev) => {
            setPage(page + 1);
            self.fresh(page +1);
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
            const row = list.pop();
            setAlink(row.alink);            //update alink
            self.checkExsist(row.alink);    //check ticket exsist

            const anchor = tools.decode(row.alink);
            const chain = Network("anchor");
            chain.view(anchor, "anchor", (res) => {
                if (res === false) return self.prepareData(list, ck, bts);
                if (!res.raw || !res.raw.template || !res.raw.template.cid) return self.prepareData(list, ck, bts);
                const cid = res.raw.template.cid;
                TPL.view(cid, (dt) => {
                    row.template = res.raw.template;
                    row.template.raw = dt;
                    row.orgin = res;
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
        fresh: (p) => {
            API.bounty.list((res) => {
                if (res && res.success && res.data) {
                    self.prepareData(res.data, (bts) => {
                        if (bts.length !== 0) {
                            setSingle(bts[0]);
                            setBonus(bts[0].orgin.raw.bonus);
                            const [sum_bonus,pieces]=self.calcSum(bts[0].orgin.raw.bonus);
                            //console.log(total,pieces);
                            setSum(sum_bonus);
                            setAmount(pieces);
                        }
                    });
                }
            }, p, 1);
        },
    }
    useEffect(() => {
        self.fresh(page);
    }, []);

    return (
        <Row>
            <Col sm={size.left[0]} xs={size.left[0]}>
                Total <strong className="text-info">{amount.toLocaleString()}</strong>P wanted.<br />
                Prize <strong className="text-info">{sum.toLocaleString()}</strong> $ANK.
            </Col>
            <Col className="text-center" sm={size.left[1]} xs={size.left[1]}>
                <BountyTicket bounty={single} alink={alink} exsist={exsist}/>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
                {/* <BountyChat dialog={props.dialog} bounty={single} alink={alink} ticket={exsist}/>
                <hr /> */}
            </Col>
            
            <BountyBonus dialog={props.dialog}  data={bonus} bounty={single} alink={alink} ticket={exsist}/>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <BountyChat dialog={props.dialog} bounty={single} alink={alink} ticket={exsist}/>
            </Col>
            <Col className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="" sm={size.page[0]} xs={size.page[0]}>
                        <FaAngleLeft className="pointer" size={36} hidden={page<=1} onClick={(ev) => {
                            self.clickPrevious(ev);
                        }} />
                    </Col>
                    <Col className="text-center unselect" sm={size.page[1]} xs={size.page[1]}>
                        <h4> {page} / {total} </h4>
                    </Col>
                    <Col className="text-end" sm={size.page[2]} xs={size.page[2]}>
                        <FaAngleRight className="pointer" size={36} hidden={page>=total} onClick={(ev) => {
                            self.clickNext(ev);
                        }} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Bounty;