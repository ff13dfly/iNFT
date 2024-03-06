import { Row, Col } from "react-bootstrap";
import { useEffect, useState,useRef } from "react";

import  Data from "../lib/data";
import tools from "../lib/tools";

//let selected=0;

function Basic(props) {
    const size = {
        row: [12],
        grid: [6,6],
    };

    const ss=Data.get("size");
    let [width,setWidth]=useState(ss.target[0]);
    let [height,setHeight]=useState(ss.target[1]);
    let [cellX,setCellX]=useState(ss.cell[0]);      //cell的X轴像素宽度
    let [cellY,setCellY]=useState(ss.cell[1]);      //cell的Y轴像素宽度
    let [line,setLine]=useState(ss.grid[0]);        //X轴，每行多少个
    let [row,setRow]=useState(ss.grid[1]);          //Y轴，多少行

    const ref = useRef(null);

    const self={
        changeCellX:(ev)=>{
            const val=parseInt(ev.target.value);
            if(!isNaN(val)){
                setCellX(val);
                self.saveSize(val,cellY,line,row);
            }
        },
        changeCellY:(ev)=>{
            const val=parseInt(ev.target.value);
            if(!isNaN(val)){
                setCellY(val);
                self.saveSize(cellX,val,line,row);
            }
        },
        changeLine:(ev)=>{
            const val=parseInt(ev.target.value);
            if(!isNaN(val)){
                setLine(val);
                self.saveSize(cellX,cellY,val,row);
            }
        },
        changeRow:(ev)=>{
            const val=parseInt(ev.target.value);
            if(!isNaN(val)){
                setRow(val);
                self.saveSize(cellX,cellY,line,val);
            }
        },
        clickGrid:(index)=>{
            //console.log(`Index ${index} clicked.`);
            Data.set("grid",index);
            self.updateHash(index);
            props.fresh();
        },
        saveSize:(cx,cy,gx,gy)=>{
            Data.set("size",{
                cell:[cx,cy],
                grid:[gx,gy],
            })
        },
        updateHash:(order)=>{
            const puzzle_index=Data.get("selected");
            const NFT=Data.get("NFT");
            const hash=Data.get("hash");
            const def=NFT.puzzle[puzzle_index];
            const [hash_start,hash_step,amount]=def.value;
            console.log(self.getHash(hash,order,hash_start,hash_step,amount));
            Data.set("hash",self.getHash(hash,order,hash_start,hash_step,amount));
        },
        getHash:(hash,order,start,step,max)=>{
            const s=16;
            const top=Math.pow(s,step);         //总数据量
            const m=Math.floor(top/max)-1;
            const multi=tools.rand(0,m);
            const n=multi*max+order;

            const px=2;
            const prefix=hash.substring(0,start+px);
            const tailor=hash.substring(start+step+px,hash.length+px);
            return `${prefix}${n.toString(16)}${tailor}`;
        },
    }

    useEffect(() =>{
        // const  width=ref.current.offsetWidth;
        // const  w=tools.toF(width/line,3);
        // const bs64=Data.get("template");
        // if(bs64!==null){
        //     setImage(bs64);
        //     const puzzle_selected=Data.get("selected");
        //     const NFT=Data.get("NFT");
        //     if(puzzle_selected!==null){
        //         const def=NFT.puzzle[puzzle_selected];
        //         const hash=Data.get("hash");
                
        //         if(def.img){
        //             const [hash_start,hash_step,amount]=def.value;
        //             const str="0x"+hash.substring(hash_start+2,hash_start+2+hash_step);
        //             const rand=parseInt(str);

        //             const sel=rand%amount;
        //             setActive(sel);

        //             const [gX,gY,eX,eY]=def.img;
        //             const gg=self.getHelper(amount,line,w,gX,gY,eX,eY);
        //             setGrid(gg);
        //         }
        //     }
        // }
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <h5>Basic parameters</h5>
            </Col>
            <Col lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
                <small>NFT Width</small>
                <input className="form-control" type="number" value={width} onChange={(ev)=>{
                    
                }}/>
            </Col>
            <Col lg={size.grid[1]} xl={size.row[1]} xxl={size.grid[1]}>
                <small>NFT Height</small>
                <input className="form-control" type="number" value={height} onChange={(ev)=>{
                    
                }}/>
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <hr />
            </Col>

            <Col lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
                <small>Cell X</small>
                <input className="form-control" type="number" value={cellX} onChange={(ev)=>{
                    self.changeCellX(ev);
                }}/>
            </Col>
            <Col lg={size.grid[1]} xl={size.row[1]} xxl={size.grid[1]}>
                <small>Cell Y</small>
                <input className="form-control" type="number" value={cellY} onChange={(ev)=>{
                    self.changeCellY(ev);
                }}/>
            </Col>
            <Col lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
                <small>Lines</small>
                <input className="form-control" type="number" value={line} onChange={(ev)=>{
                    self.changeLine(ev);
                }}/>
            </Col>
            <Col lg={size.grid[1]} xl={size.row[1]} xxl={size.grid[1]}>
                <small>Rows</small>
                <input className="form-control" type="number" value={row} onChange={(ev)=>{
                    self.changeRow(ev)
                }}/>
            </Col>
        </Row>
    )
}

export default Basic;