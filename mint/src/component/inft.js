import { useEffect, useState } from "react";

import Render from "../lib/render";
import Data from "../lib/data";

function INFT(props) {
    const size = {
        row: [12],
        header:[4,8],
    };

    let [width, setWidth] = useState(100);
    let [height, setHeight] = useState(100);
    let [hidden, setHidden] =useState(true);

    //const dom_id = "inft_previewer";
    const self={
        show:(id,hash,tpl,offset)=>{
            setWidth(tpl.size[0]);
            setHeight(tpl.size[1]);

            const pen = Render.create(id);
            const basic = {
                cell: tpl.cell,
                grid: tpl.grid,
                target: tpl.size
            };
            Render.clear(props.id);
            Render.preview(pen,tpl.image,hash,tpl.parts,basic,offset);
        },
    }
    
    useEffect(() => {
        const tpl=Data.get("template");
        if(tpl!==null){
            setHidden(false);
            self.show(props.id,props.hash,tpl,props.offset);
        }else{
            setHidden(true);
        }
    }, [props.hash,props.offset,props.id]);
    const cmap={width:"100%"}
    return (
        <div>
            <canvas hidden={hidden} width={width} height={height} id={props.id} style={cmap}></canvas>
            <img hidden={!hidden} src="image/logo.png" alt="" style={cmap}/>
        </div>
    )
}

export default INFT;