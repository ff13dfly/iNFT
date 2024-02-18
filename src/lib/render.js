
const RDS={};   //缓存render的方法

const config={
    background:"#71366b",
};

const self={
    border:(id,color)=>{
        const pen=RDS[id];
        const w=pen.canvas.clientWidth;
        const h=pen.canvas.clientHeight;
        pen.fillStyle=color===undefined?config.background:color;
		pen.fillRect(0,0,w,h);
    },
}

const Render= {
    create:(id,cfg)=>{
        //console.log(`Ready to init canvas.`);
        if(RDS[id]!==undefined) return RDS[id];
        //console.log(`First time to init`);
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
};

export default Render;