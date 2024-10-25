/* 
*  iNFT image drawing lib
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-10-23
*  @functions
*  1.create base64 image from canvas;
*  2.combine images to single one;
*/

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
        return ck && ck(CVS.getContext("2d"));
    },
    clear:(pen,color)=>{
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.fillStyle=(color===undefined?config.background:color);
		pen.fillRect(0,0,w,h);
        pen.stroke();
    },
    getBase64:(pen,ck)=>{
        setTimeout(() => {
            const dt=pen.canvas.toDataURL("image/png");
            return ck && ck(dt);
        },50);
    },
};

const self={
    /* create a new empty image
    *   @param  {number}    width       //new image width
    *   @param  {number}    height      //new image heigth
    *   @param  {function}  ck          //ck(IMAGE_BS64)
    */
    create:(width,height,ck)=>{
        funs.init((pen)=>{
            funs.clear(pen);
            return funs.getBase64(pen,ck);
        },width,height);
    },

    /* change the image size, auto cut
    *   @param  {string}    image       //source image
    *   @param  {number}    width       //new image width
    *   @param  {number}    height      //new image heigth
    *   @param  {function}  ck          //ck(IMAGE_BS64)
    */
    extend:(image,width,height,ck)=>{
        funs.init((pen)=>{
            const img = new Image();
            img.src = image;
            img.onload = (e) => {
                const cs_x=0;
                const cs_y=0;
                const ce_x=img.width;
                const ce_y=img.height;

                const ts_x=0;
                const ts_y=0;
                const te_x=img.width;
                const te_y=img.height;
                pen.drawImage(img, cs_x, cs_y , ce_x , ce_y , ts_x, ts_y, te_x, te_y);
                return funs.getBase64(pen,ck);
            }
        },width,height);
    },

    /* cut part of source image then combine to target
    *   @param  {object}    source      //{image:IMAGE_BS64,start:[POS_X,POS_Y],end:[POS_X,POS_Y]}
    *   @param  {object}    target      //{start:[POS_X,POS_Y],end:[POS_X,POS_Y]}
    *   @param  {function}  ck          //ck(IMAGE_BS64)
    */
    combine:(source,target,ck)=>{
        funs.init((pen)=>{
            const img = new Image();
            img.src = source.image;
            img.onload = (e) => {
                const cs_x=source.start[0];
                const cs_y=source.start[1];
                const ce_x=source.end[0];
                const ce_y=source.end[1];

                const ts_x=target.start[0];
                const ts_y=target.start[1];
                const te_x=target.end[0];
                const te_y=target.end[1];
                pen.drawImage(img, cs_x, cs_y , ce_x , ce_y , ts_x, ts_y, te_x, te_y);
                return funs.getBase64(pen,ck);
            }
        });
    },

    /* clean target area of image
    *   @param  {array}    start        //[POS_X,POS_Y]
    *   @param  {array}    end          //[POS_X,POS_Y]
    *   @param  {function} ck           //ck(IMAGE_BS64)
    */
    clean:(start,end,ck)=>{

    },
};

export default self;