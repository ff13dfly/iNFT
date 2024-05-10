import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Hash from "./hash";
import Counter from "./counter";
import RenderiNFT from "./inft";
//import AnimateHash from "./hash_animate";

import TPL from "../lib/tpl";
import tools from "../lib/tools";

import Network from "../network/router";

let animate=true;   //wether iNFT render animation

function Preview(props) {
    const size = {
        row: [12],
        header:[3,9],
    };

    let [block, setBlock] = useState(0);
    let [hash, setHash] = useState("0x000000000000000000000000000000000000000000000000000000000000000");
    let [start, setStart]=useState(0);
    let [active, setActive]=useState(0);

    let first=true;
    let timer=null
    const self = {
        randomActive:()=>{
            if(animate){
                clearTimeout(timer);
                return false;
            } 
            const tpl=TPL.current();
            setActive(tools.rand(0,tpl.parts.length-1));       //be set multi times, no sure why
            return setTimeout(()=>{
                self.randomActive();
            },2000);
        },
        fresh:()=>{
            setTimeout(() => {
                Network("tanssi").subscribe("preview",(bk, bhash)=>{
                    animate=true;
                    if(!first){
                        setBlock(bk);
                        setHash(bhash);
                        start++;
                        setStart(start);        //start counter at right time
                    }else{
                        first=false;
                    }

                    timer=setTimeout(()=>{
                        animate=false;
                        self.randomActive();
                    },6000);
                });
            }, 50);
        }
    }

    useEffect(() => {
        self.fresh();
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col className="text-center pb-1" sm={size.row[0]} xs={size.row[0]}>
                <RenderiNFT 
                    hash={hash} 
                    offset={[]} 
                    id={"pre_home"} 
                    hightlight={active} 
                    animate={animate}
                    callback={()=>{
                        animate=false;
                        self.randomActive();
                    }}
                    />
            </Col>
            <Col className="pt-4" sm={size.header[0]} xs={size.header[0]}>
                <Counter start={start}/>
            </Col>
            <Col className="pt-1 text-center" sm={size.header[1]} xs={size.header[1]}>
                <Hash hash={hash} active={active}/>
            </Col>
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]}>
                Block {block.toLocaleString()}, Tanssi Network
            </Col>
        </Row>
    )
}

export default Preview;