
const RDS={};   //缓存render的方法

const config={
    container:"thumb_handle",
    background:"#EEEEEE",
};

const self={
    border:(id,color)=>{
        const pen=RDS[id];
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        console.log(w,h);
        pen.fillStyle=color===undefined?config.background:color;
		pen.fillRect(0,0,w,h);
    },
    decode: (hash, pen, img, parts, tpl, offset,hightlight,ck) => {
        const { cell, grid } = tpl;
        //const multi=window.devicePixelRatio;
        const multi = 1;    //solve Apple device here.
        let cache=null;
        for (let i = 0; i < parts.length; i++) {
            //get the image part from parameters
            const part = parts[i];
            const [hash_start, hash_step, amount, tpl_offset] = part.value;
            const [gX, gY, eX, eY] = part.img;
            const [px, py] = part.position;
            const [zx, zy] = part.center;

            const num = parseInt("0x" + hash.substring(hash_start + 2, hash_start + 2 + hash_step)) 
                + (!tpl_offset?0:parseInt(tpl_offset))
                + (!offset[i]?0:parseInt(offset[i]));
            const index = num % amount;     //图像的位次
            const max = grid[0] / (1 + eX);
            const br = Math.floor((index+gX)/max);

            const cx = cell[0] * (eX + 1) * ((index+gX) % max);
            const cy = cell[1] * gY + br * cell[1] * (1 + eY);
            const dx = cell[0] * (eX + 1);
            const dy = cell[1] * (eY + 1);
            const vx = px - zx * cell[0] * (1 + eX);
            const vy = py - zy * cell[1] * (1 + eY);
            pen.drawImage(img, cx * multi, cy * multi, dx * multi, dy * multi, vx, vy, dx, dy);

            if (hightlight === i) {
                cache = [dx, dy, vx, vy, "#FF0000", 1];
            }

            if (cache !== null) {
                const [dx, dy, vx, vy, color, pw] = cache
                Render.active(pen, dx, dy, vx, vy, color, pw);
            }
        }
        return ck && ck();
    },
}

const Render= {
    create:(id,force)=>{
        if(RDS[id]!==undefined && force!==true) return RDS[id];
        const cvs=document.getElementById(id);		//1.创建好canvas并返回画笔
		RDS[id]=cvs.getContext("2d");
        //self.border(id);
        return RDS[id];
    },
    active:(pen,w,h,sx,sy,color,width)=>{
        if(color!==undefined){
            pen.strokeStyle=color;
        }
        if(width!==undefined){
            pen.lineWidth=width;
        }
        pen.beginPath();
        pen.moveTo(sx,sy);
        pen.lineTo(sx+w,sy);
        pen.lineTo(sx+w,sy+h);
        pen.lineTo(sx,sy+h);
        //pen.lineTo(sx,sy);
        pen.closePath();
        pen.stroke();
        if(color!==undefined){
            pen.strokeStyle="#000000";
        }
        if(width!==undefined){
            pen.lineWidth=1;
        }
    },
    drop:(id)=>{
        delete RDS[id];
    },
    clear:(id)=>{
        //self.border(id);
    },
    fill:(pen,color)=>{
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.fillStyle=(color===undefined?config.background:color);
		pen.fillRect(0,0,w,h);
    },
    reset:(pen,color)=>{
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.fillStyle=(color===undefined?config.background:color);
        pen.fillRect(0,0,w,h);
    },
    preview:(pen,bs64,hash,parts,basic,offset,hightlight,ck)=>{
        const img = new Image();
        img.src = bs64;
        img.onload = (e) => {
            self.decode(hash, pen, img, parts, basic,(offset===undefined?[]:offset),hightlight,ck);   
        }
    },
    cut:(pen,bs64,w,h,row,line,step,ck)=>{
        const img = new Image();
        img.src = bs64;
        img.onload = (e) => {
            const cx=0;
            const cy=row*h;
            const vx=0;
            const vy=0;
            const dx=w*line;
            const dy=h*step;
            
            pen.drawImage(img, cx , cy , dx , dy , vx, vy, dx, dy);
            setTimeout(()=>{
                const b64=pen.canvas.toDataURL("image/jpeg");
                return ck && ck(b64);
            },50)
        }
    },
    count:(pen,n,back)=>{
        self.reset(pen);
    },
    text:(pen,txt,pos,style)=>{
        //console.log(txt);
        if(style!==undefined) pen.font = style.font;
        pen.fillStyle=style.color;
        pen.fillText(txt, pos[0], pos[1]);
        pen.stroke();
    },

    //can use this as static iNFT show;
    //when need to animation for iNFT, try self.preview
    thumb:(hash,bs64,parts,basic,offset,ck,hightlight)=>{
        //0.check parameters before rendering;


        const container_id=config.container;
        const canvas_id="thumb_canvas"

        //create the canvas container;
        let con = document.getElementById(container_id);
        if(con===null){
            const div = document.createElement('div');
            div.id = container_id;
            document.body.appendChild(div);
            con = document.getElementById(container_id);
        }

        //create canvas for thumbe;
        let cvs=document.getElementById(canvas_id);
        if(cvs===null){
            cvs = document.createElement('canvas');
            con.appendChild(cvs);
        }
        cvs.id = canvas_id;
        cvs.width =basic.target[0];
        cvs.height =basic.target[1];

        const pen = Render.create(canvas_id, true);
        Render.reset(pen);
        Render.preview(pen,bs64,hash, parts, basic,offset,hightlight);
        pen.canvas.toDataURL("image/jpeg");

        setTimeout(() => {
            const dt=pen.canvas.toDataURL("image/jpeg");
            return ck && ck(dt);
        },50);
    }
};

export default Render;