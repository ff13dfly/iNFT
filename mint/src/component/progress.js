import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaIdBadge } from "react-icons/fa";

import Result from "../component/result"
import Network from "../network/router";

import INFT from "../lib/inft";
import Local from "../lib/local";

function Progress(props) {
    const size = {
        row: [12],
        bar:[2,8,2],
        step:[1,2,2,1,2],
    };

    const def_progress={
        START:1,
        READY:2,
        BROADCAST:3,
        INBLOCK:4,
        RETRACKED:5,
        FINALIZED:8,
    }

    let [block, setBlock]=useState(0);
    let [list,setList]=useState([]);

    const self={
        getStatus:(order,now)=>{
            if(now===0) return "pt-3 waiting";
            if(order===now) return "pt-3 going";
            if(order<now) return "pt-3 done";
            return "pt-3 waiting";
        },
        getDone:(arr)=>{
            return 0;
        },
        getINFTbyName:(name)=>{
            const fa = Local.get("login");
            if (!fa) return false;
            const login = JSON.parse(fa);
            const addr = login.address;
            const ls = Local.get("list");
            const my = JSON.parse(ls);
            for(let i=0;i<my[addr].length;i++){
                if(name===my[addr][i].anchor) return my[addr][i];
            }
        },

        clickSingle:(name,hash)=>{
            //const dt=INFT.single.target(name);
            const dt=self.getINFTbyName(name);

            //console.log(name,hash);
            props.dialog(<Result 
                name={dt.anchor} 
                hash={dt.hash} 
                block={dt.block} 
                offset={dt.offset}
                template={dt.template.hash}
                price={!dt.price?0:dt.price}
                fav={dt.fav}
                skip={true}
                back={true} 
                dialog={props.dialog}
                from={"progress"}
            />, "iNFT Details");
        },
        showTask:()=>{
            const details=INFT.mint.detail();
            setList(details.task);
        },
    }

    useEffect(() => {
        self.showTask();
        setBlock(props.block);
       
        Network("tanssi").subscribe("progress",(bk, bhash)=>{
            setBlock(bk);
            setTimeout(self.showTask,1500);  //update task after finalized new block
        });
    }, [props.update]);

    const cmap={
        background:"#555555",
        borderRadius:"10px"
    }

    return (
        <Row>
            <Col sm={size.row[0]} xs={size.row[0]}>
                {list.length} mint, {self.getDone(list)} done. Block {!block?0:block.toLocaleString()}
            </Col>
            <Col className="pt-2 pb-4" style={cmap} sm={size.row[0]} xs={size.row[0]}>
                <Row>
                {list.map((row, index) => (  
                    <Col key={index} className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                        <Row>
                            <Col className="pt-1" sm={size.bar[0]} xs={size.bar[0]}>
                                <h5>#{index+1}</h5>
                            </Col>
                            <Col className="pt-1" sm={size.bar[1]} xs={size.bar[1]}>
                                <Row className="pt-2">
                                    <Col className={self.getStatus(0,row.now)} sm={size.step[0]} xs={size.step[0]}></Col>
                                    <Col className={self.getStatus(1,row.now)} sm={size.step[1]} xs={size.step[1]}></Col>
                                    <Col className={self.getStatus(2,row.now)} sm={size.step[2]} xs={size.step[2]}></Col>
                                    <Col className={self.getStatus(3,row.now)} sm={size.step[3]} xs={size.step[3]}></Col>
                                    <Col className={self.getStatus(4,row.now)} sm={size.step[4]} xs={size.step[4]}></Col>
                                    <Col className={self.getStatus(5,row.now)}></Col>
                                </Row>
                            </Col>
                            <Col className="pt-1 text-end" sm={size.bar[2]} xs={size.bar[2]}>
                                <button hidden={row.now<def_progress.FINALIZED} className="btn btn-sm btn-secondary" onClick={(ev)=>{
                                    self.clickSingle(row.name,row.hash);
                                }}><FaIdBadge /></button>
                            </Col>
                        </Row>
                    </Col>
                ))}
                </Row>
            </Col>
            
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Info: every mint takes about 36 seconds to finalize.
            </Col>
        </Row>
    )
}

export default Progress;