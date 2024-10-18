import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Hash from "./common/hash";
import Counter from "./common/counter";
import RenderiNFT from "./common/inft";
import ListMinting from "./minting/list_minting";

import TPL from "../system/tpl";
import tools from "../lib/tools";
import Data from "../lib/data";

import Network from "../network/router";

/* App home preview
*   @param  {function}  fresh       //force to fresh function
*   @param  {number}    update      //update number, force to fresh
*   @param  {function}  dialog      //system dialog function
*/

let animate = false;   //wether iNFT render animation
let saving_hash = "";
let saving_block = 0;
let updating=null;
let minting=[];
function Preview(props) {
    const size = {
        row: [12],
        header: (window.screen.width > 414 ? [4, 8] : [3, 9]),      //here to adjust to different device
        single: [1, 10, 1],
    };

    let [block, setBlock] = useState(0);
    let [hash, setHash] = useState("0x000000000000000000000000000000000000000000000000000000000000000");
    let [start, setStart] = useState(0);
    let [active, setActive] = useState(0);
    let [force, setForce] = useState(false);      //wether force to fresh the iNFT

    let [show, setShow] = useState(false);      //wether show minting page
    let [list, setList] = useState([]);         //minting iNFT list

    let timer = null
    const self = {
        randomActive: () => {
            if(animate){
                clearTimeout(timer);
                return false;
            }
            const tpl = TPL.current();
            if (tpl === null){
                timer=setTimeout(() => {
                    self.randomActive();
                }, 2000);
                return true;
            } 

            setActive(tools.rand(1, tpl.parts.length - 1));       //be set multi times, no sure why
            setForce(true);
            timer=setTimeout(() => {
                self.randomActive();
            }, 2000);
        },
        getNetwork:()=>{
            const cur=Data.getHash('cache', 'network');
            return  tools.toUp(cur);
        },
        checkMinting:()=>{

        },
        fresh: () => {
            setTimeout(() => {
                const cur = Data.getHash('cache', 'network');
                const chain=Network(cur);
                chain.subscribe("preview", (bk, bhash) => {
                    saving_hash = bhash;
                    saving_block = bk;
                    chain.view(bhash,"detail",(ds)=>{
                        if(ds.length > 9){
                            setList(ds);
                            //minting=list;
                            setShow(true);
                        }else{
                            //minting=[];
                            setList([]);
                            setShow(false);
                        }
                    });
                });
            }, 50);
        },
        updateHash: () => {
            //console.log(`Freshing...`);
            if(updating===null){
                //console.log(`Set inverval timer to show.`);
                start++;
                setStart(start);        //start counter at first running

                updating=setInterval(()=>{
                    //clearTimeout(timer);
                    start++;
                    setStart(start);        //start counter at right time

                    //1.fresh the hash
                    if(!saving_hash || !saving_block) return false;

                    setForce(false);
                    animate = true;
                    setHash(saving_hash);
                    setBlock(saving_block);

                    timer=setTimeout(()=>{
                        animate = false;
                        self.randomActive();
                    },5000);
                },12000);
            }
        },
    }

    useEffect(() => {
        console.log(`update preview template.`);
        self.fresh();
        self.updateHash();
        setForce(true);
        
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col className="text-center" hidden={show} sm={size.row[0]} xs={size.row[0]}>
                <RenderiNFT
                    hash={hash}
                    offset={[]}
                    id={"pre_home"}
                    hightlight={active}
                    force={force}
                    animate={false}
                    callback={() => {
                        //animate = false;
                    }}
                />
            </Col>
            <Col className="text-center" hidden={!show} sm={size.row[0]} xs={size.row[0]}>
                <ListMinting dialog={props.dialog} data={list} block={saving_block}  limit={9}/>
            </Col>

            <Col className="text-center pb-2" sm={size.row[0]} xs={size.row[0]}>
                Block {block.toLocaleString()}, {self.getNetwork()} Network
            </Col>
            <Col className="text-center pt-3" sm={size.header[0]} xs={size.header[0]}>
                <Counter start={start} duration={12} />
            </Col>
            <Col sm={size.header[1]} xs={size.header[1]}>
                <Hash hash={hash} active={active} />
            </Col>
        </Row>
    )
}

export default Preview;