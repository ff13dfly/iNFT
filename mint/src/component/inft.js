import { useEffect, useState } from "react";

import Render from "../lib/render";
import Data from "../lib/data";

/* iNFT render component parameters
*   @param  {string}    id              //the canvas dom ID
*   @param  {string}    hash            //hash needed to render the iNFT
*   @param  {array}     [offset]        //customer offset array for rendering
*   @param  {string}    [template]      //the template CID for rendering
*   @param  {boolean}   [hightlight]    //index of parts which is needed to be hightlight
*/

function RenderiNFT(props) {

    let [width, setWidth] = useState(400);
    let [height, setHeight] = useState(400);
    let [hidden, setHidden] =useState(true);

    let [bs64, setBS64] = useState("image/logo.png");

    //const dom_id = "inft_previewer";
    const self={

        show:(id,hash,tpl,offset,ck)=>{
            setWidth(tpl.size[0]);
            setHeight(tpl.size[1]);

            Render.drop(id);
            const pen=Render.create(id);
            const basic = {
                cell: tpl.cell,
                grid: tpl.grid,
                target: tpl.size
            };
            //Render.clear(id);
            Render.preview(pen,tpl.image,hash,tpl.parts,basic,offset,props.hightlight,ck);
        },

        autoFresh:(ck)=>{
            if(props.template!==undefined){
                //setHidden(false);
                const def=Data.getHash("cache",props.template);
                def.cid=props.template;
                self.show(props.id,props.hash,def,props.offset,ck);
            }else{
                const tpl=Data.get("template");
                if(tpl!==null){
                    //setHidden(false);
                    self.show(props.id,props.hash,tpl,props.offset,ck);
                }else{
                    return setTimeout(()=>{
                        self.autoFresh();
                    },200)
                }
            }
        },
    }
    
    useEffect(() => {
        //console.log(JSON.stringify(props));
        self.autoFresh(()=>{
            setHidden(false);
        });
        
    }, [props.hash,props.offset,props.id,props.template,props.hightlight]);

    const cmap={width:"100%"}
    return (
        <div>
            <canvas hidden={hidden} width={width} height={height} id={props.id} style={cmap}></canvas>
            <img hidden={!hidden}  src={bs64} alt="iNFT logo" style={cmap}/>
        </div>
    )
}

export default RenderiNFT;