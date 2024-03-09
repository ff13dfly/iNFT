import { Row, Col,ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaArrowUp,FaArrowDown,FaTrashAlt,FaPlus } from "react-icons/fa";
import  Data from "../lib/data";

let locker=false;

function Puzzle(props) {
    const size = {
        row: [12],
        opt:[2,2,1,7],
        header:[1,1,9,1],
        title:[8,4]
    };
    let [hash,setHash]=useState("");
    let [list,setList]=useState([]);
    let [active,setActive]=useState(0);
    let [disable, setDisable]=useState(true);

    const self={
        clickPuzzle:(index)=>{
            const cur=Data.get("selected");
            if(cur!==index){
                setActive(index);
                Data.set("selected",parseInt(index));
                Data.set("grid",null);
                props.fresh();
            }
        },
        clickUp:(index)=>{
            if(locker) return false;
            locker=true;
            if(index===0){
                locker=false;
                return false; 
            } 

            const def=Data.get("NFT");
            const nlist=[];
            for(let i=0;i<def.puzzle.length;i++){
                if(i===(index-1)){
                    nlist.push(def.puzzle[i+1]);
                }else if(i===index){
                    nlist.push(def.puzzle[i-1]);
                }else{
                    nlist.push(def.puzzle[i]);
                } 
            }
            def.puzzle=nlist;

            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            Data.set("selected",parseInt(index-1));
            setActive(index-1);
            locker=false;
            props.fresh();
        },
        clickDown:(index)=>{
            console.log(index);
            if(locker) return false;
            locker=true;

            const def=Data.get("NFT");
            if(index===(def.puzzle.length-1)){
                locker=false;
                return false; 
            }

            const nlist=[];
            for(let i=0;i<def.puzzle.length;i++){
                if(i===index){
                    nlist.push(def.puzzle[i+1]);
                    nlist.push(def.puzzle[i]);
                }else if(i===(index+1)){
                    
                }else{
                    nlist.push(def.puzzle[i]);
                } 
            }
            def.puzzle=nlist;

            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            Data.set("selected",parseInt(index+1));
            setActive(index+1);
            locker=false;
            props.fresh();
        },
        clickRemove:(index)=>{
            if(locker) return false;
            locker=true;

            const def=Data.get("NFT");
            //1.如果是最后一个，调整active的index
            if(index===def.puzzle.length-1){
                setActive(index-1);
                Data.set("selected",parseInt(index)-1);
            }

            //2.删除对应的数据
            const nlist=[];
            for(let i=0;i<def.puzzle.length;i++){
                if(i!==index) nlist.push(def.puzzle[i]);
            }
            def.puzzle=nlist;
            Data.set("NFT",JSON.parse(JSON.stringify(def)));

            
            locker=false;
            props.fresh();
        },
        clickAdd:()=>{
            if(disable) return false;
            if(locker) return false;
            locker=true;

            const def=Data.get("NFT");
            const row=JSON.parse(JSON.stringify(def.puzzle[def.puzzle.length-1]));
            
            row.value[0]=row.value[0]+4;
            row.position[0]=row.value[0]+50;
            row.position[1]=row.value[1]+50;

            def.puzzle.push(row);
            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            locker=false;
            props.fresh();
        }
    }

    useEffect(() => {
        const def=Data.get("NFT");
        if(def && def.puzzle){
            setList(def.puzzle);
            setDisable(false);
            self.clickPuzzle(active);
        }

        const hh=Data.get("hash");
        setHash(hh);
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]} >
                Parts
            </Col>
            <Col className="text-end" lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]} >
                <FaPlus hidden={disable} style={{ color: "rgb(13, 110, 253)", cursor: "pointer" }} onClick={(ev)=>{
                    self.clickAdd(ev);
                }}/>
            </Col>

            <Col className="pt-2" lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <ListGroup as="ul" style={{cursor:"pointer"}}>
                    {list.map((row, index) => (
                        <ListGroup.Item key={index} as="li" active={(index===active?true:false)}>
                            <Row style={{width:"100%"}}>
                                <Col lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]} >
                                    <FaArrowUp onClick={(ev)=>{
                                        self.clickUp(index);
                                    }}/>
                                </Col>
                                <Col lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]} >
                                    <FaArrowDown onClick={(ev)=>{
                                        self.clickDown(index);
                                    }}/>
                                </Col>
                                <Col lg={size.header[2]} xl={size.header[2]} xxl={size.header[2]} onClick={(ev)=>{
                                    self.clickPuzzle(index);
                                }}>  
                                 #{index}-<span className="text-info">0x{hash.slice(row.value[0]+2,row.value[0]+2+row.value[1])}</span>,
                                 divide:<span className="text-info">{row.value[2]}</span>,
                                 offset:<span className="text-info">{row.value[3]}</span> 
                                </Col>
                                <Col className="text-end" lg={size.header[3]} xl={size.header[3]} xxl={size.header[3]} >
                                    <FaTrashAlt onClick={(ev)=>{
                                        self.clickRemove(index);
                                    }}/>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Col>
        </Row>
    )
}

export default Puzzle;