import { Row, Col, Accordion,ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaArrowUp,FaArrowDown,FaTrash } from "react-icons/fa";

import  Data from "../lib/data";

let locker=false;

function Puzzle(props) {
    const size = {
        row: [12],
        opt:[2,2,1,7],
        header:[2,2,6,2]
    };
    
    let [list,setList]=useState([]);
    let [active,setActive]=useState(0);

    const self={
        clickPuzzle:(index)=>{
            //console.log(`${index} is clicked.`);
            const cur=Data.get("selected");
            if(cur!==index){
                setActive(index);
                Data.set("selected",parseInt(index));
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
            const nlist=[];
            for(let i=0;i<def.puzzle.length;i++){
                if(i!==index) nlist.push(def.puzzle[i]);
            }
            def.puzzle=nlist;
            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            locker=false;
            props.fresh();
        },
    }

    useEffect(() => {
        const def=Data.get("NFT");
        if(def && def.puzzle){
            setList(def.puzzle);
            //Data.set("selected",active);

            self.clickPuzzle(active);
        }
    }, [props.update]);

    return (
        <Row>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <hr />
                iNFT parts
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
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
                                #{index}- {row.value[0]},{row.value[0]+row.value[1]}  
                                </Col>
                                <Col className="text-end" lg={size.header[3]} xl={size.header[3]} xxl={size.header[3]} >
                                    <FaTrash onClick={(ev)=>{
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