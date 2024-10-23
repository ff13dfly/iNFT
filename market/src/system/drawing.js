/* 
*  iNFT image drawing lib
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-10-23
*  @functions
*  1.create base64 image from canvas;
*  2.combine images to single one;
*/

import tools from "../lib/tools";

let CVS=null;
const config={
    container:"editor_container",
    canvas:"editor_canvas",
    background:"#FFEEEE",
    size:[800,800],
}
const funs={
    init:(ck,width,height)=>{
        if(CVS!==null) return ck && ck(CVS.getContext("2d"));
        let con = document.getElementById(config.container);
        if(con===null){
            con = document.createElement("div");
            con.id = config.container;
            con.style.display="none";
            document.body.appendChild(con);
        }

        if(CVS===null){
            CVS = document.createElement("canvas");
            con.appendChild(CVS);
        }
        CVS.id = config.canvas;
        CVS.width =!width?config.size[0]:width;
        CVS.height =!height?config.size[1]:height;
        return ck && ck(CVS.getContext("2d"))
    },
    fill:(pen,color)=>{
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.fillStyle=(color===undefined?config.background:color);
		pen.fillRect(0,0,w,h);
    },
};

const self={
    //create a new empty image
    create:(width,height,ck)=>{
        funs.init((pen)=>{
            //funs.fill(pen);
            setTimeout(() => {
                const dt=pen.canvas.toDataURL("image/png");
                return ck && ck(dt);
            },50);
        },width,height);
    },

    //extend the image size, auto cut
    extend:(image,width,height,ck)=>{

    },

    //combine image to canvas
    combine:(source,target,ck)=>{

    },
};

export default self;