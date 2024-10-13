import { Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";

import Network from "../network/router";
import INFT from "../system/inft";

import INFTBuy from "./market/inft_buy";

function Market(props) {
    const size = {
        row: [12],
        half:[6],
    };

    let [list, setList]=useState([]);

    const self={
        clickSingle:(data)=>{
            props.dialog(<INFTBuy dialog={props.dialog} data={data}/>,"iNFT Detail")
        },
        getThumbs:(list,ck,map)=>{
            if(map===undefined) map={};
            if(list.length===0){
                const narr=[];
                for(let k in map){
                    narr.push(map[k]);
                }
                return ck && ck(narr);
            } 
            const row=list.pop();
            //console.log(row);
            const chain=Network("anchor");
            chain.view({name:row.name},"anchor",(dt)=>{
                //console.log(dt);
                dt.free=row.free;
                dt.price=row.price;
                dt.target=row.target;
                INFT.single.thumb(dt.raw,dt.hash, (bs64) => {
                    dt.thumb=bs64;
                    map[row.name]=dt;
                    return self.getThumbs(list,ck,map);
                });
            });
        },
        fresh:()=>{
            const chain=Network("anchor");
            chain.market((ms)=>{
                self.getThumbs(ms,(arr)=>{
                    setList(arr);
                    //console.log(map);
                });
            });
        },
    }
    useEffect(() => {

        self.fresh();
    }, []);

    return (
        <Row>
            {list.map((row, index) => (
                <Col className="pointer" key={index} sm={size.half[0]} xs={size.half[0]} onClick={(ev)=>{
                    self.clickSingle(row);
                }}>
                    <Row className="pb-4">
                        <Col sm={size.half[0]} xs={size.half[0]}>
                            <h6>{row.name}</h6>
                        </Col>
                        <Col className="text-end" sm={size.half[0]} xs={size.half[0]}>
                            {row.price}
                        </Col>
                        <Col sm={size.row[0]} xs={size.row[0]}>
                            <img alt="" src={row.thumb} className="apply_thumb" />
                        </Col>
                    </Row>
                </Col>
            ))}
        </Row>
    )
}

export default Market;