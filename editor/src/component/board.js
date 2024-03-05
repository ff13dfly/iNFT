import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Data from "../lib/data";
import  Render from "../lib/render";
import  ETH from '../lib/eth';

//pixijs documents
//https://pixijs.download/dev/docs/PIXI.Rectangle.html

//pixi react
//https://pixijs.io/pixi-react/components/Sprite/

//context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)

const cfg={
    id:"NFT_canvas",
    width:400,
    height:400,
}

const self={
}

function Board(props) {
    const size = {
        row: [12],
        hash:[8,4],
    };

    let [hash,setHash]=useState("0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f8891c0486");
    //console.log(Data.get("hash"));
    if(Data.get("hash")===null){
        Data.set("hash",hash);
    }

    const self={
        changeHash:(ev)=>{
            setHash(ev.target.value);
            Data.set("hash",ev.target.value);
            props.fresh();
        },
        decode:(hash,pen,img,parts,tpl,active)=>{
            const {cell,grid}=tpl;
            //const multi=window.devicePixelRatio;
            const multi=1;
            for(let i=0;i<parts.length;i++){
                //获取不同的图像
                const part=parts[i];
                const [hash_start,hash_step,amount]=part.value;
                const [gX,gY,eX,eY]=part.img;
                const [px,py]=part.position;
                const [zx,zy]=part.center;

                const num=parseInt("0x"+hash.substring(hash_start+2,hash_start+2+hash_step));
                const index=num%amount;     //图像的位次
                const max=grid[0]/(1+eX);
                const br=Math.floor((index+gX)/max);

                const cx=cell[0]*(eX+1)*((index+gX)%max);
                const cy=cell[1]*gY+br*cell[1]*(1+eY);
                const dx=cell[0]*(eX+1);
                const dy=cell[1]*(eY+1);
                const vx=px-zx*cell[0]*(1+eX);
                const vy=py-zy*cell[1]*(1+eY);
                pen.drawImage(img, cx*multi, cy*multi, dx*multi, dy*multi, vx, vy, dx, dy);
                
                //绘制当前的选中的块
                if(active===i){
                    Render.active(pen,dx,dy,vx,vy,"#FF0000",3);
                }
            }
        },
    }
    
    useEffect(() => {
        const hash=Data.get("hash");
        if(hash!=="0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f8891c0486"){
            setHash(hash);
        }
        
        const pen=Render.create(cfg.id);
        const bs64=Data.get("template");
        const def=Data.get("NFT");
        const ss=Data.get("size");
        
        if(bs64!==null && def!==null){
            const img = new Image();
            img.src=bs64;
            img.onload = (e)=>{
                Render.clear(cfg.id);
                const active=Data.get("selected");
                self.decode(hash,pen,img,def.puzzle,ss,active);
            }
        }

        ETH.init();
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <h5>iNFT Preview</h5>
            </Col>
            <Col className="pt-2" lg={size.hash[0]} xl={size.hash[0]} xxl={size.hash[0]} >
                <small>{hash.length-2} bytes</small>
                <textarea className="form-control" cols="30" rows="2" value={hash} onChange={(ev)=>{
                    self.changeHash(ev);
                }}></textarea>   
            </Col>
            <Col className="pt-2" lg={size.hash[1]} xl={size.hash[1]} xxl={size.hash[1]} >
                <Form>
                    <Form.Check type="checkbox" label={`Enable hash check.`} />
                    <Form.Check type="checkbox" label={`Disable highlight.`} />
                </Form>
            </Col>
            <Col className="text-center pt-4" lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <canvas  width={cfg.width} height={cfg.height} id={cfg.id}></canvas>
            </Col>
        </Row>
    )
}

export default Board;