import { useEffect, useState } from "react";

import Render from "../lib/render";
import Data from "../lib/data";

/* iNFT render component parameters
*   @param  {string}    id            //the canvas dom ID
*   @param  {string}    hash          //hash needed to render the iNFT
*   @param  {array}     [offset]      //customer offset array for rendering
*   @param  {string}    [template]    //the template CID for rendering
*/

function INFT(props) {

    let [width, setWidth] = useState(100);
    let [height, setHeight] = useState(100);
    let [hidden, setHidden] =useState(true);

    let [bs64, setBS64] = useState("image/logo.png");

    //const dom_id = "inft_previewer";
    const self={
        show:(id,hash,tpl,offset)=>{
            setWidth(tpl.size[0]);
            setHeight(tpl.size[1]);

            Render.drop(id);
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
        console.log(props);
        if(props.template!==undefined){
            const def=Data.getHash("cache",props.template);
            def.cid=props.template;
            setHidden(false);
            self.show(props.id,props.hash,def,props.offset);
        }else{
            const tpl=Data.get("template");
            if(tpl!==null){
                setHidden(false);
                self.show(props.id,props.hash,tpl,props.offset);
            }else{
                setHidden(true);
            }
        }
        
    }, [props.hash,props.offset,props.id,props.template]);

    const cmap={width:"100%"}
    return (
        <div>
            <canvas hidden={hidden} width={width} height={height} id={props.id} style={cmap}></canvas>
            <img hidden={!hidden}  src={bs64} alt="" style={cmap}/>
        </div>
    )
}

export default INFT;