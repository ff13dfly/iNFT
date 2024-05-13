import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaCheck } from "react-icons/fa";

import tools from "../lib/tools"
import TPL from "../lib/tpl";
import INFT from "../lib/inft";

function Setting(props) {
    const size = {
        row: [12],
        offset:[8,4],
        multi:[4,4,4],

    };

    const config={
        multiMax:9,
    }

    let [amount, setAmount]=useState(0);
    let [cid, setCid]=useState("");
    let [multi, setMulti]=useState(1);

    const self={
        clickIncMulti:(ev)=>{
            if(multi!==config.multiMax){
                const n=multi+1;
                setMulti(n);
                self.updateMulti(n);
            }
        },
        
        clickDecMulti:(ev)=>{
            if(multi!==1){
                const n=multi-1;
                setMulti(n);
                self.updateMulti(n);
            }
        },
        updateMulti:(n)=>{
            const active=TPL.current();
            const detail=INFT.mint.detail();
            const cid=active.cid;
            if(!detail.template[cid]){
                detail.template[cid]={
                    multi:n,
                    offset:self.getMintOffset(active.parts),
                }
            }else{
                detail.template[cid].multi=n;
            }
            INFT.mint.update(detail);
        },
        autoShow:()=>{
            const active=TPL.current();
            if(active===null) return setTimeout(()=>{
                self.autoShow();
            },1000);

            const os=INFT.mint.detail("template");
            if(!os[active.cid]){
                os[active.cid]={
                    multi:1,
                    offset:self.getMintOffset(active.parts),
                }
                INFT.mint.update({template:os});
            }
            const multi=os[active.cid].multi;

            setAmount(active.parts.length);
            setCid(active.cid);
            setMulti(multi!==undefined?multi:1);
        },
    }

    useEffect(() => {
        self.autoShow();

    }, [props.update]);

    const bmap={width:"100%"}

    return (
        <Row>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <h4>Offset</h4> 
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-2" sm={size.offset[0]} xs={size.offset[0]}>
                        Default, random offset to get unique result on the same block.
                    </Col>
                    <Col className="pt-2"  sm={size.offset[1]} xs={size.offset[1]}>
                        <button className="btn btn-sm btn-secondary mt-2 full">
                            <FaCheck className="pr-2"/> Random
                        </button>
                    </Col>

                    <Col className="pt-2 text-warning" sm={size.offset[0]} xs={size.offset[0]}>
                        Only take block hash to mint the iNFT, same result.
                    </Col>
                    <Col className="pt-2" sm={size.offset[1]} xs={size.offset[1]}>
                        <button className="btn btn-sm btn-secondary mt-2 full text-warning">
                            <FaCheck className="pr-2"/>Empty
                        </button>
                    </Col>
                    
                    <Col className="pt-2" sm={size.offset[0]} xs={size.offset[0]}>
                        
                    </Col>
                    <Col className="pt-2"  sm={size.offset[1]} xs={size.offset[1]}>
                        <button disabled={true} className="btn btn-sm btn-secondary mt-2 full">
                            <FaCheck hidden={true} className="pr-2"/>Customize
                        </button>
                    </Col>
                </Row>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <h4>Amount to mint</h4> 
            </Col>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                Set the mint times/click, {config.multiMax} max.
            </Col>
            <Col className="pt-2 text-end" sm={size.multi[0]} xs={size.multi[0]}>
                <button disabled={multi===1} className="btn btn-md btn-secondary" onClick={(ev)=>{
                    self.clickDecMulti(ev);
                }}>-</button>
            </Col>
            <Col className="pt-2 text-center unselect" sm={size.multi[1]} xs={size.multi[1]}>
                <h2 className="text-warning">{multi}</h2>
            </Col>
            <Col className="pt-2" sm={size.multi[2]} xs={size.multi[2]}>
                <button disabled={multi===config.multiMax} className="btn btn-md btn-secondary" onClick={(ev)=>{
                    self.clickIncMulti(ev);
                }}>+</button>
            </Col>
        </Row>
    )
}

export default Setting;