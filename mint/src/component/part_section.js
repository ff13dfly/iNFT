import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Data from "../lib/data";
import Render from "../lib/render";

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
        getTemplate:(cid)=>{
            if(cid!==undefined){
                const def=Data.getHash("cache",cid);
                def.cid=cid;
                return def;
            }else{
                return Data.get("template");
            }
        },
        showSection:(index,cid)=>{
            const def=self.getTemplate(cid);
            if(!def || !def.parts ||  !def.parts[index]) return false;

            const target=def.parts[index];
            const w = def.cell[0], h = def.cell[1];
            const [gX, gY, eX, eY] = target.img;
            const [start, step, divide, offset] = target.value;
            const [line, row] = def.grid;
            const max = line / (1 + eX);
            const br = Math.ceil((gX + divide) / max);
            
            //1.calc the section size;
            const s_w=400;      //TODO, need to calc the section width;
            const s_h=100;      //TODO, need to calc the section height
            setWidth(s_w);
            setHeight(s_h);

            //2.cut the section from orgin image
            const cpen = Render.create(cut_id);
            Render.clear(cut_id);
            Render.cut(cpen, def.image, w, h, gY, line, (1 + eY) * br, (img_section) => {
                setBS64(img_section);
            });
        },
        showCover:(n,selected)=>{
            let arr=[]
            for(let i=0;i<n;i++){
                arr.push({
                    wX:100,
                    wY:100,
                    mX:i*100,
                    mY:-100,
                    active:i===selected
                })
            }
            setGrid(arr);
        },
    }

    useEffect(() => {
        self.showSection(props.index,props.template);
        self.showCover(4,props.selected);
    }, [props.index,props.selected]);

    return (
        <Row className="unselect pt-2 pb-2">
            <Col className="text-center pt-1" sm={size.row[0]} xs={size.row[0]}>
                <canvas hidden={true} id={cut_id} width={width} height={height}></canvas>
                <img src={bs64} style={{width:"100%"}} alt="The target section of orgin template"/>
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