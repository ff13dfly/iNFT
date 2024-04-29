import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Hash from "./hash";
import Counter from "./counter";

import Flow from "./flow";

import Data from "../lib/data";
import Render from "../lib/render";
import tools from "../lib/tools";
import Local from "../lib/local";

import Network from "../network/router";

function Preview(props) {
    const size = {
        row: [12],
        header:[4,8],
    };

    let [width, setWidth] = useState(100);
    let [height, setHeight] = useState(100);
    let [block, setBlock] = useState(0);
    let [hash, setHash] = useState("0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f8891c0486");
    let [alink, setAlink] = useState("");

    let [start, setStart]=useState(0);

    let first=true;

    const self = {
        fresh:()=>{
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
                    };
                    Network("tanssi").subscribe("preview",(bk, bhash)=>{
                        console.log(tools.stamp(),bk,bhash,);

                        setBlock(bk);
                        setHash(bhash);

                        
                        if(!first){
                            //force to fresh counter 
                            start++;
                            setStart(start);

                            //fresh the iNFT result
                            Render.clear(dom_id);
                            Render.preview(pen,tpl.image,bhash,tpl.parts,basic);
                        }else{
                            first=false;
                        }
                    });
                }, 50);
            }

            const tpls = Local.get("template");
            if (tpls !== undefined) {
                const list = JSON.parse(tpls);
                const tpl = list[0];
                setAlink(tpl.alink);
            }

        }
    }

    const dom_id = "previewer";
    useEffect(() => {
        self.fresh();
    }, [props.update]);

    return (
        <Row className="pt-2">
            
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <canvas width={width} height={height} id={dom_id}></canvas>
            </Col>
            <Col className="pt-4" sm={size.header[0]} xs={size.header[0]}>
                <Counter start={start}/>
            </Col>
            <Col className="pt-1" sm={size.header[1]} xs={size.header[1]}>
                <Hash hash={hash} at={4}/>
            </Col>
            
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]}>
                Block {block.toLocaleString()}, Tanssi Network
            </Col>
        </Row>
    )
}

export default Preview;