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
    let [raw, setRaw]=useState("");
    let [order,setOrder]=useState(0);
    let [num,setNum]=useState(0);

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
        autoSave:(key,index,val)=>{
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
            props.fresh();
        },
        changeValueStart:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
            setValueStart(val);
            self.autoSave("value",0,val);
        },
        changeValueStep:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
            setValueStep(val);
            self.autoSave("value",1,val);
        },
        changeValueDivide:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
            setValueDivide(val);
            self.autoSave("value",2,val);
        },
        changeValueOffset:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
            setValueOffset(val);
            self.autoSave("value",3,val);
        },
        changeImageLine:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
            setImageLine(val);
            self.autoSave("img",0,val);
        },
        changeImageRow:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
            setImageRow(val);
            self.autoSave("img",1,val);
        },
        
        changeImageEX:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val)) return false;
            setImageEx(val);
            self.autoSave("img",2,val);
        },
        changeImageEY:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val)) return false;
            setImageEy(val);
            self.autoSave("img",3,val);
        },
        changeCenterX:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val)) return false;
            setCenterX(val);
            self.autoSave("center",0,val);
        },
        changeCenterY:(ev)=>{
            const val=parseFloat(ev.target.value);
            if(isNaN(val)) return false;
            setCenterY(val);
            self.autoSave("center",1,val);
        },
        changePositionX:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
            setPosX(val);
            self.autoSave("position",0,val);
        },
        changePositionY:(ev)=>{
            const val=parseInt(ev.target.value);
            if(isNaN(val)) return false;
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

            const hash=Data.get("hash");

            if(hash){
                const [hash_start,hash_step,amount]=dt.value;
                const str="0x"+hash.substring(hash_start+2,hash_start+2+hash_step);
                const rand=parseInt(str);
                setRaw(str);
                setNum(rand);
                setOrder(rand%amount);
            }
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