
const RDS={};   //缓存render的方法

const config={
    //background:"#71366b",
    background:"#EEEEEE",
};

const self={
    border:(id,color)=>{
        const pen=RDS[id];
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.fillStyle=color===undefined?config.background:color;
		pen.fillRect(0,0,w,h);
    },
    decode: (hash, pen, img, parts, tpl, active) => {
        const { cell, grid } = tpl;
        //const multi=window.devicePixelRatio;
        const multi = 1;
        for (let i = 0; i < parts.length; i++) {
            //获取不同的图像
            const part = parts[i];
            const [hash_start, hash_step, amount] = part.value;
            const [gX, gY, eX, eY] = part.img;
            const [px, py] = part.position;
            const [zx, zy] = part.center;

            const num = parseInt("0x" + hash.substring(hash_start + 2, hash_start + 2 + hash_step));
            const index = num % amount;     //图像的位次
            const max = grid[0] / (1 + eX);
            const br = Math.floor(index / max);

            const cx = cell[0] * (eX + 1) * (index % max);
            const cy = cell[1] * gY + br * cell[1] * (1 + eY);
            const dx = cell[0] * (eX + 1);
            const dy = cell[1] * (eY + 1);
            const vx = px - zx * cell[0] * (1 + eX);
            const vy = py - zy * cell[1] * (1 + eY);
            pen.drawImage(img, cx * multi, cy * multi, dx * multi, dy * multi, vx, vy, dx, dy);
        }
    },
}

const Render= {
    create:(id,force)=>{
        if(RDS[id]!==undefined && force!==true) return RDS[id];
        const cvs=document.getElementById(id);		//1.创建好canvas并返回画笔
		RDS[id]=cvs.getContext("2d");
        self.border(id);
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
    clear:(id)=>{
        self.border(id);
    },
    fill:(pen,color)=>{
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.fillStyle=color===undefined?config.background:color;
		pen.fillRect(0,0,w,h);
    },
    reset:(pen)=>{
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.clearRect(0, 0, w, h);
    },
    preview:(pen,bs64,hash,parts,basic)=>{
        const img = new Image();
        img.src = bs64;
        img.onload = (e) => {
            self.decode(hash, pen, img, parts, basic);
        }
    },
};

export default Render;