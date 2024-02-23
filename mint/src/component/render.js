import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Data from "../lib/data";
import  Render from "../lib/render";
import  tools from "../lib/tools";

function Preview(props) {
    const size = {
        row: [12],
    };

    let [width,setWidth]    =useState(100);
    let [height, setHeight] =useState(100);
    let [block, setBlock]= useState(0);
    let [hash, setHash]= useState("0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f8891c0486");

    const self={
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
                const br=Math.floor(index/max);

                const cx=cell[0]*(eX+1)*(index%max);
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

    const dom_id="previewer";
    useEffect(() => {
       const tpl=Data.get("template");
       if(tpl!==null){
            setWidth(tpl.size[0]);
            setHeight(tpl.size[1]);
            setTimeout(()=>{
                const pen=Render.create("previewer");
                const img = new Image();
                img.src=tpl.image;
                img.onload = (e)=>{
                    Render.clear(dom_id);
                    const ss={
                        cell:tpl.cell,
                        grid:tpl.grid,
                        target:tpl.size
                    }
                    self.decode(hash,pen,img,tpl.parts,ss);
                    props.subscribe("preview",(bk,bhash)=>{
                        //console.log(hash)
                        setBlock(bk);
                        setHash(bhash);
                        Render.clear(dom_id);
                        self.decode(bhash,pen,img,tpl.parts,ss);
                    });
                }     
            },50);

            
       }    
    }, [props.update]);

    return (
        <Row className="pt-4">
            <Col className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                Block {block.toLocaleString()}: {tools.shorten(hash,12)}
            </Col>
            <Col className="text-center pt-4" sm={size.row[0]} xs={size.row[0]}>
                <canvas  width={width} height={height} id={dom_id}></canvas>
            </Col>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <small>Information here.</small>
            </Col>
        </Row>
    )
}

export default Preview;