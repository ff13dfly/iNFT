import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Data from "../lib/data";


function Preview(props) {
    const size = {
        row: [12],
        grid: [6,6],
    };

    const ss=Data.get("size");

    let [image,setImage]=useState("image/empty.png");
    let [grid, setGrid] =useState([]);
    let [active, setActive]=useState(null);
    
    let [cellX,setCellX]=useState(ss.cell[0]);      //cell的X轴像素宽度
    let [cellY,setCellY]=useState(ss.cell[1]);      //cell的Y轴像素宽度
    let [line,setLine]=useState(ss.grid[0]);        //X轴，每行多少个
    let [row,setRow]=useState(ss.grid[1]);          //Y轴，多少行

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
        saveSize:(cx,cy,gx,gy)=>{
            Data.set("size",{
                cell:[cx,cy],
                grid:[gx,gy],
            })
        },
        getHelper:(amount,line,w,gX,gY,eX,eY)=>{       //gX没用到，默认从0开始
            const list=[];
            const max=line/(1+eX);
            for(let i=0;i<amount;i++){
                const br=Math.floor(i/max);
                list.push({
                    mX:w*(eX+1)*(i%max),    //margin的X值
                    mY:w*gY+br*w*(1+eY),    //margin的Y值
                    wX:w*(eX+1),            //block的width
                    wY:w*(eY+1),            //block的height
                });
            } 
            return list;
        },
    }

    let width=260;
    let w=parseInt(width/line);

    useEffect(() =>{
        const bs64=Data.get("template");
        if(bs64!==null){
            setImage(bs64);
            
            const selected=Data.get("selected");
            const NFT=Data.get("NFT");
            if(selected!==null){
                const def=NFT.puzzle[selected];
                const hash=Data.get("hash");
                
                if(def.img){
                    const [hash_start,hash_step,amount]=def.value;
                    const str="0x"+hash.substring(hash_start+2,hash_start+2+hash_step);
                    const rand=parseInt(str);
                    setActive(rand%amount);

                    const [gX,gY,eX,eY]=def.img;
                    const grid=self.getHelper(amount,line,w,gX,gY,eX,eY);
                    setGrid(grid);
                }
            }
        }
    }, [props.update]);

    return (
        <Row>
            <Col className="pt-4" lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {/* template image preview, {props.update}
                <p>Image information, 1,234 bytes, 1024 * 2048.</p> */}
                {grid.map((row, index) => (
                    <div className="cover" key={index} style={{
                            marginLeft:`${row.mX}px`,
                            marginTop:`${row.mY}px`,
                            width:`${row.wX}px`,
                            height:`${row.wY}px`,
                            lineHeight:`${row.wY}px`,
                            backgroundColor:(active===index?"#4aab67":"#f7cece"),
                        }} 
                        onClick={(ev)=>{
                            console.log("clicked");
                        }}>{index}</div>
                ))}
                {<img id="preview" src={image} alt="Preview of full iNFT" />}
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
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <hr />
            </Col>
        </Row>
    )
}

export default Preview;