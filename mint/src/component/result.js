import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Local from "../lib/local";
import Render from "../lib/render";
import Data from "../lib/data";
import tools from "../lib/tools";
import Chain from "../lib/chain";

function Result(props) {
    const size = {
        row: [12],
        sell:[8,4]
    };

    const anchor=props.anchor;

    let [width,setWidth]    =useState(100);
    let [height, setHeight] =useState(100);
    let [block,setBlock]=useState(0);
    let [block_hash,setBlockHash]=useState("");

    const dom_id="pre_result";
    const fix=40;

    

    useEffect(() => {
        const fa = Local.get("login");
        if(!fa) return false;
        const login=JSON.parse(fa);
        const addr=login.address;

        Chain.read(`anchor://${anchor}`,(res)=>{
            const bk=res.location[1];
            const alink=`anchor://${anchor}/${bk}`;
            const key=`${anchor}_${bk}`.toLocaleLowerCase();
            const adata=res.data[key];
            const raw=JSON.parse(adata.raw);

            Chain.hash(bk,(hash)=>{
                setBlock(bk);
                setBlockHash(hash);

                //1.保存数据
                const its=Local.get("list");
                const nlist=its===undefined?{}:JSON.parse(its);
                if(nlist[addr]===undefined)nlist[addr]=[];
                nlist[addr].unshift({link:alink,hash:hash});

                Local.set("list",JSON.stringify(nlist));
                
                //2.显示数据
                const tpl = Data.get("template");
                setWidth(tpl.size[0]-fix);
                setHeight(tpl.size[1]-fix);
                setTimeout(() => {
                    const pen = Render.create(dom_id,true);
                    const basic = {
                        cell: tpl.cell,
                        grid: tpl.grid,
                        target: tpl.size
                    }
                    Render.clear(dom_id);
                    Render.preview(pen,tpl.image,hash,tpl.parts,basic);
                }, 50);
            });
        });
    }, [props.update,props.anchor]);

    return (
        <Row>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <canvas width={width} height={height} id={dom_id}></canvas>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                Block: {block.toLocaleString()}<br/>
                Hash: {tools.shorten(block_hash,16)}
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                Recommand Price: <strong>$AC 100</strong>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                Rarity Price: <strong>0.15%</strong>
            </Col>

            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.sell[0]} xs={size.sell[0]}>
                <input className="form-control" type="text" placeholder="Price to sell."/>
            </Col>
            <Col className="text-end" sm={size.sell[1]} xs={size.sell[1]}>
                <button className="btn btn-md btn-primary">Sell</button>
            </Col>
        </Row>
    )
}

export default Result;