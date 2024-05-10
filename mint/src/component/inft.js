import { useEffect, useState } from "react";

import Render from "../lib/render";
import TPL from "../lib/tpl";

/* iNFT render component parameters
*   @param  {string}    id              //the canvas dom ID
*   @param  {string}    hash            //hash needed to render the iNFT
*   @param  {array}     [offset]        //customer offset array for rendering
*   @param  {string}    [template]      //the template CID for rendering
*   @param  {boolean}   [hightlight]    //index of parts which is needed to be hightlight
*   @param  {boolean}   [animate]       //animate support
*   @param  {function}  [callback]      //callback function 
*/

function RenderiNFT(props) {

    let [width, setWidth] = useState(400);
    let [height, setHeight] = useState(400);
    let [hidden, setHidden] =useState(true);

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
            const ani=!props.animate?false:true
            Render.preview(pen,tpl.image,hash,tpl.parts,basic,offset,props.hightlight,ck,ani);
        },

        autoFresh:(ck)=>{
            if(props.template!==undefined){
                TPL.view(props.template,(def)=>{
                    if(!def) return false;
                    self.show(props.id,props.hash,def,props.offset,ck);
                });
            }else{
                const tpl=TPL.current();
                if(tpl!==null){
                    self.show(props.id,props.hash,tpl,props.offset,ck);
                }else{
                    return setTimeout(()=>{
                        self.autoFresh(ck);
                    },200)
                }
            }
        },
    }
    
    useEffect(() => {
        self.autoFresh(()=>{
            //console.log(`Freshed, ready to run callback.`);
            setHidden(false);
        });
    }, [props.hash,props.offset,props.id,props.template,props.hightlight]);

    const cmap={width:"100%"}
    return (
        <div>
            <canvas hidden={hidden} width={width} height={height} id={props.id} style={cmap}></canvas>
            <img hidden={!hidden}  src={"image/logo.png"} alt="iNFT logo" style={cmap}/>
        </div>
    )
}

export default RenderiNFT;