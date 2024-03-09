import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Rarity from "./rarity";

import  Data from "../lib/data";

function Detail(props) {
    const size = {
        row: [12],
        value:[3,3,3,3],
        center:[3,3],
        img:[3,3,3,3],
        position:[3,3],
    };

    let [hidden,setHidden] = useState(true);

    let [value_start,setValueStart]=useState(0);
    let [value_step,setValueStep]=useState(0);
    let [value_divide,setValueDivide]=useState(0);
    let [value_offset,setValueOffset]=useState(0);

    let [img_line,setImageLine] =useState(0);
    let [img_row, setImageRow] =useState(0);
    let [img_ext_x,setImageEx]=useState(0);
    let [img_ext_y,setImageEy]=useState(0);

    let [pos_x, setPosX]= useState(0);
    let [pos_y, setPosY]= useState(0);

    let [center_x,setCenterX]=useState(0);
    let [center_y,setCenterY]=useState(0);

    let [rare, setRare]=useState("");

    const self={
        autoTask:(arr)=>{
            const active=Data.get("selected");
            const def=Data.get("NFT");
            if(active===null || def===null) return false;
            const data={
                value:[value_start,value_step,value_divide,value_offset],
                img:[img_line,img_row,img_ext_x,img_ext_y],
                position:[pos_x,pos_y],
                center:[center_x,center_y],
            }
            if(def.puzzle[active].rarity!==undefined){
                data.rarity=def.puzzle[active].rarity;
            }
            def.puzzle[active]=data;

            for(let i=0;i<arr.length;i++){
                const [key,index,val]=arr[i];
                def.puzzle[active][key][index]=val;
            }
            const changed=JSON.parse(JSON.stringify(def));
            Data.set("NFT",changed);
            props.fresh();
        },
        autoSave:(key,index,val,pending)=>{
            const active=Data.get("selected");
            const def=Data.get("NFT");
            if(active===null || def===null) return false;
            const data={
                value:[value_start,value_step,value_divide,value_offset],
                img:[img_line,img_row,img_ext_x,img_ext_y],
                position:[pos_x,pos_y],
                center:[center_x,center_y],
            }
            if(def.puzzle[active].rarity!==undefined){
                data.rarity=def.puzzle[active].rarity;
            }

            
            def.puzzle[active]=data;
            def.puzzle[active][key][index]=val;
            const changed=JSON.parse(JSON.stringify(def));
            Data.set("NFT",changed);

            if(!pending){   //更新数据
                //const changed=JSON.parse(JSON.stringify(def));
                //Data.set("NFT",changed);
                props.fresh();
            }
        },
        changeValueStart:(ev)=>{
            const val=parseInt(ev.target.value);
            const min=0,index=0;

            //1.处理非正常数据、删除的操作，重置为1
            if(isNaN(val) || val<min){
                setValueStart(min);
                self.autoSave("value",index,min);
                return false;
            } 

            const hash=Data.get("hash");
            const len=hash.length-2;
            const max=len-value_step;

            //2.处理顶到step的问题
            if(val<max){
                setValueStart(val);
                self.autoSave("value",index,val);
                return true;
            }else{
                const index_step=1;
                if(val >= len-1){
                    //2.1.顶到hash的长度限制了
                    setValueStart(len-1);
                    setValueStep(1);            //保留一位取值
                    const task=[
                        ["value",index,len-1],
                        ["value",index_step,1],
                    ]
                    self.autoTask(task)
                    return true;
                }else{
                    const fix_step=len-val;
                    setValueStart(val);
                    setValueStep(fix_step);            //保留一位取值
                    const task=[
                        ["value",index,val],
                        ["value",index_step,fix_step],
                    ]
                    self.autoTask(task);
                    return true;
                }
            }
        },
        changeValueStep:(ev)=>{
            const val=parseInt(ev.target.value);
            const min=1,index=1;
            if(isNaN(val) || val<min){
                setValueStep(min);
                self.autoSave("value",index,min);
                return false;
            }
            const hash=Data.get("hash");
            const len=hash.length-2;
            const max=len-value_start;

            const index_start=0;
            if(val>len){
                setValueStart(0);
                setValueStep(len);            //保留一位取值
                const task=[
                    ["value",index_start,0],
                    ["value",index,len],
                ]
                self.autoTask(task);
                return true;
            }else{
                if(val>max){
                    setValueStart(len-val);
                    setValueStep(val);            //保留一位取值
                    const task=[
                        ["value",index_start,len-val],
                        ["value",index,val],
                    ]
                    self.autoTask(task)
                    return true;
                }else{
                    setValueStep(val);
                    self.autoSave("value",index,val);
                    return true;
                }
            }
        },
        changeValueDivide:(ev)=>{
            const val=parseInt(ev.target.value);
            const min=2,index=2;
            if(isNaN(val) || val<min){
                setValueDivide(min);
                self.autoSave("value",index,min);
                return false;
            } 
            setValueDivide(val);
            self.autoSave("value",2,val);
        },
        changeValueOffset:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val) || val<value_divide){
                setValueOffset(0);
                self.autoSave("value",3,0);
                return false;
            } 
            setValueOffset(val);
            self.autoSave("value",3,val);
        },
        changeImageLine:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val) || val<0){
                setImageLine(0);
                self.autoSave("img",0,0);
                return false;
            }
            setImageLine(val);
            self.autoSave("img",0,val);
        },
        changeImageRow:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val) || val<0){
                setImageRow(0);
                self.autoSave("img",1,0);
                return false;
            }
            setImageRow(val);
            self.autoSave("img",1,val);
        },
        
        changeImageEX:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val) || val<0){
                setImageEx(0);
                self.autoSave("img",2,0);
                return false;
            }
            setImageEx(val);
            self.autoSave("img",2,val);
        },
        changeImageEY:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val) || val<0){
                setImageEy(0);
                self.autoSave("img",3,0);
                return false;
            }
            setImageEy(val);
            self.autoSave("img",3,val);
        },
        changeCenterX:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val) || val<0){
                setCenterX(0);
                self.autoSave("center",0,0);
                return false;
            }
            setCenterX(val);
            self.autoSave("center",0,val);
        },
        changeCenterY:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val) || val<0){
                setCenterY(0);
                self.autoSave("center",1,0);
                return false;
            }
            setCenterY(val);
            self.autoSave("center",1,val);
        },
        changePositionX:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val) || val<0){
                setPosX(0);
                self.autoSave("position",0,0);
                return false;
            }
            setPosX(val);
            self.autoSave("position",0,val);
        },
        changePositionY:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val) || val<0){
                setPosY(0);
                self.autoSave("position",1,0);
                return false;
            }
            setPosY(val);
            self.autoSave("position",1,val);
        },

        setValues:(dt)=>{
            setValueStart(dt.value[0]);
            setValueStep(dt.value[1]);
            setValueDivide(dt.value[2]);
            setValueOffset(dt.value[3]);
            
            setImageLine(dt.img[0]);
            setImageRow(dt.img[1]);
            setImageEx(dt.img[2]);
            setImageEy(dt.img[3]);

            setCenterX(dt.center[0]);
            setCenterY(dt.center[1]);

            setPosX(dt.position[0]);
            setPosY(dt.position[1]);
        },
    }
    
    useEffect(() => {
        const active=Data.get("selected");
        if(active!==null){
            setHidden(false);
            const def=Data.get("NFT");
            const dt=def.puzzle[active];
            self.setValues(dt);

            setRare(<Rarity fresh={props.fresh} update={props.update} index={active}/>);

            // const hash=Data.get("hash");
            // if(hash){
            //     const [hash_start,hash_step,amount,offset]=dt.value;
            //     const str="0x"+hash.substring(hash_start+2,hash_start+2+hash_step);
            //     const rand=parseInt(str);
            // }
        }

    }, [props.update]);

    return (
        <Row hidden={hidden} className="pt-2">
            {/* <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <small className="text-warning">Raw: {raw}, value:{num}, order: {order}</small>
                <hr />
            </Col> */}
            <Col lg={size.value[0]} xl={size.value[0]} xxl={size.value[0]}>
                <small>Start</small>
                <input type="number" className="form-control" value={value_start} onChange={(ev)=>{
                    self.changeValueStart(ev);
                }}/>
            </Col>
            <Col lg={size.value[1]} xl={size.value[1]} xxl={size.value[1]}>
                <small>Step</small>
                <input type="number" className="form-control" value={value_step} onChange={(ev)=>{
                    self.changeValueStep(ev);
                }}/>
            </Col>
            <Col lg={size.value[2]} xl={size.value[2]} xxl={size.value[2]}>
                <small>Divide</small>
                <input type="number" className="form-control" value={value_divide} onChange={(ev)=>{
                    self.changeValueDivide(ev);
                }}/>
            </Col>
            <Col lg={size.value[3]} xl={size.value[3]} xxl={size.value[3]}>
                <small>Offset</small>
                <input type="number" className="form-control" value={value_offset} onChange={(ev)=>{
                    self.changeValueOffset(ev);
                }}/>
            </Col>
            {/* <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <hr />
            </Col> */}
            <Col lg={size.img[0]} xl={size.img[0]} xxl={size.img[0]}>
                <small>Line X</small>
                <input type="number" className="form-control" value={img_line} onChange={(ev)=>{
                    self.changeImageLine(ev);
                }}/>
            </Col>
            <Col lg={size.img[1]} xl={size.img[1]} xxl={size.img[1]}>
                <small>Row Y</small>
                <input type="number" className="form-control" value={img_row} onChange={(ev)=>{
                    self.changeImageRow(ev);
                }}/>
            </Col>
            <Col lg={size.img[2]} xl={size.img[2]} xxl={size.img[2]}>
                <small>X extend</small>
                <input type="number" className="form-control" value={img_ext_x} onChange={(ev)=>{
                    self.changeImageEX(ev);
                }}/>
            </Col>
            <Col lg={size.img[3]} xl={size.img[3]} xxl={size.img[3]}>
                <small>Y extend</small>
                <input type="number" className="form-control" value={img_ext_y} onChange={(ev)=>{
                    self.changeImageEY(ev);
                }}/>
            </Col>
            {/* <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <hr />
            </Col> */}
            <Col lg={size.center[0]} xl={size.center[0]} xxl={size.center[0]}>
                <small>Center X</small>
                <input type="number" className="form-control" value={center_x} onChange={(ev)=>{
                    self.changeCenterX(ev);
                }}/>
            </Col>
            <Col lg={size.center[1]} xl={size.center[1]} xxl={size.center[1]}>
                <small>Center Y</small>
                <input type="number" className="form-control" value={center_y} onChange={(ev)=>{
                    self.changeCenterY(ev);
                }}/>
            </Col>
            {/* <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <hr />
            </Col> */}
            <Col lg={size.center[0]} xl={size.center[0]} xxl={size.center[0]}>
                <small>Pos X</small>
                <input type="number" className="form-control" value={pos_x} onChange={(ev)=>{
                    self.changePositionX(ev);
                }}/>
            </Col>
            <Col lg={size.center[0]} xl={size.center[0]} xxl={size.center[0]}>
                <small>Pos Y</small>
                <input type="number" className="form-control" value={pos_y} onChange={(ev)=>{
                    self.changePositionY(ev);
                }}/>
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {rare}
            </Col>
        </Row>
    )
}

export default Detail;