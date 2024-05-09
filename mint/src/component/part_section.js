import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Data from "../lib/data";
import Render from "../lib/render";
import TPL from "../lib/tpl";

function PartSection(props) {
    const size = {
        row: [12],
    };  

    const config={
        board:2,
    }

    let [width, setWidth]=useState(400);
    let [height, setHeight]=useState(50);
    let [bs64, setBS64] = useState("image/section.png");

    let [grid, setGrid]=useState([]);

    const cut_id = "pre_cut";
    const self = {
        showSection:(index,cid)=>{
            if(!cid){
                const def=TPL.current();
                if(!def) return setTimeout(()=>{
                    self.showSection(index);
                },500);
                self.render(def,index);
            }else{
                TPL.view(cid,(def)=>{
                    if(!def) return false;
                    self.render(def,index);
                });
            }
        },
        render:(def,index)=>{
            const target=def.parts[index];
            const w = def.cell[0], h = def.cell[1];
            const [gX, gY, eX, eY] = target.img;
            const [start, step, divide, offset] = target.value;
            const [line, row] = def.grid;
            const max = line / (1 + eX);
            const br = Math.ceil((gX + divide) / max);
            
            //1.calc the section size;
            const s_w=def.grid[0]*w;        //section width;
            const s_h=h*(1+eY)*br;          //section height;
            setWidth(s_w);
            setHeight(s_h);

            //2.cut the section from orgin image
            const cpen = Render.create(cut_id);
            //Render.clear(cut_id);
            Render.cut(cpen, def.image, w, h, gY, line, (1 + eY) * br, (img_section) => {
                setBS64(img_section);
                const cfg={
                    width:w*(1+eX),         //selected cell width
                    height:h*(1+eY),        //selected cell height
                    offset:gX,              //first cell offset amount
                }
                self.showCover(divide,props.selected,cfg)
            });
        },
        showCover:(n,selected,cfg)=>{
            let arr=[]
            for(let i=0;i<n;i++){
                arr.push({
                    wX:cfg.width,         //mask width, w*(1+eX)
                    wY:cfg.height,         //mask height
                    mX:(i+cfg.offset)*cfg.width,
                    mY:-cfg.height,
                    active:i===selected
                })
            }
            setGrid(arr);
        },
    }

    useEffect(() => {
        self.showSection(props.index,props.template);
    }, [props.index,props.selected]);

    return (
        <Row className="unselect pt-2 pb-2">
            <Col className="text-center pt-1" sm={size.row[0]} xs={size.row[0]}>
                <canvas hidden={true} id={cut_id} width={width} height={height}></canvas>
                <img src={bs64} style={{width:"100%"}} width={width} height={height} alt="The target section of orgin template"/>
                {grid.map((row, order) => (
                    <div className="cover" key={order} style={{
                        marginLeft: `${row.mX}px`,
                        marginTop: `${row.mY}px`,
                        width: `${row.wX}px`,
                        height: `${row.wY}px`,
                        lineHeight: `${row.wY}px`,
                        backgroundColor:`${row.active?"#f7cece":"#4aab67"}` ,
                        color: `${row.active?"#ff0000":"#ffffff"}`,
                    }}>{order}</div>
                ))}
            </Col>
        </Row>
    )
}

export default PartSection;