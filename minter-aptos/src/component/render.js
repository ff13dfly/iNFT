import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Data from "../lib/data";
import Render from "../lib/render";
import tools from "../lib/tools";
import Local from "../lib/local";
import Chain from "../network/aptos";

import {  Network} from "@aptos-labs/ts-sdk";

let internal_fresh=null;

function Preview(props) {
    const size = {
        row: [12],
    };

    let [width, setWidth] = useState(100);
    let [height, setHeight] = useState(100);
    let [block, setBlock] = useState(0);
    let [hash, setHash] = useState("0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f8891c0486");
    let [alink, setAlink] = useState("");

    const self = {
        
    }

    const dom_id = "previewer";
    useEffect(() => {
        const tpl = Data.get("template");
        if (tpl !== null) {
            setWidth(tpl.size[0]);
            setHeight(tpl.size[1]);
            setTimeout(() => {
                const pen = Render.create(dom_id);
                const basic = {
                    cell: tpl.cell,
                    grid: tpl.grid,
                    target: tpl.size
                }

                if(internal_fresh===null){
                    let bk=408021;
                    internal_fresh=setInterval(() => {
                        bk++;
                        Chain.view(bk,"block",(res)=>{
                            //console.log(res);
                            const bhash=res.block_hash;
                            setBlock(bk);
                            setHash(bhash);
                            //const style={font:"13px serif",color:"#FFFFFF"}
                            //Render.clear(dom_id);
                            Render.preview(pen,tpl.image,bhash,tpl.parts,basic);
                            //Render.text(pen,bhash,[0,24],style);
                            //Render.text(pen,block,[10,380],style);
                        },Network.DEVNET);
                    }, 2000);
                }
            }, 50);
        }

        const tpls = Local.get("template");
        if (tpls !== undefined) {
            const list = JSON.parse(tpls);
            const tpl = list[0];
            setAlink(tpl.alink);
        }
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col sm={size.row[0]} xs={size.row[0]}>
                Aptos block {block.toLocaleString()}: {tools.shorten(hash, 12)}
            </Col>
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]}>
                <canvas width={width} height={height} id={dom_id}></canvas>
            </Col>
            <Col className="" sm={size.row[0]} xs={size.row[0]}>
                <br/>The iNFT created from the block hash when mint, click the button to try.
            </Col>
        </Row>
    )
}

export default Preview;