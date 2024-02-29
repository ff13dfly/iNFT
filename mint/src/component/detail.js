import { Row, Col, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

import Template from "./template";

//import Chain from "../lib/chain";
import Data from "../lib/data";
import Render from "../lib/render";

import { FaBackspace,FaPuzzlePiece,FaSyncAlt,FaLongArrowAltDown,FaLongArrowAltUp } from "react-icons/fa";

function Detail(props) {
    const size = {
        row: [12],
        back:[9,3],
        title:[2,7,3],
        thumb:[7,5],
        hash: [10,2],
    };

    const dialog=props.dialog;
    const alink=props.alink;

    let [width, setWidth]= useState(200);
    let [height, setHeight]= useState(200);
    let [hash, setHash] = useState("0x123456abcdef123467890");
    let [bs64, setBS64] =useState("image/empty.png");
    let [parts, setParts] =useState([]);
    let [mask, setMask]= useState(0);                   //Mask的数量

    let [selected,setSelected ]=useState(0);        //选中的NFT组件
    let [active, setActive]=useState(null);         //选中的图像位次
    let [grid, setGrid]=useState([]);

    let [cmap,setImageMap]=useState({})

    const self={
        clickBack:()=>{
            dialog(<Template fresh={props.fresh} dialog={props.dialog} />,"Template");
        },
        clickGrid:(index)=>{
            //console.log(`Index ${index} clicked.`);
            setActive(index);
        },
        clickPart:(index)=>{
            setSelected(index);
            self.autoFresh(index,active);
        },
        clickHashFresh:(ev)=>{
            setHash("0xa3dfd11908fasdfas8df");
        },
        getBackground:(index)=>{
            const selected_grid=Data.get("grid");
            const ac="#4aab67";
            const sc="#f7cece";
            const bc="#99ce23";
            if(selected_grid===index){
                return sc;
            }else{
                return active===index?ac:bc
            }
        },
        getHelper:(amount,line,w,h,gX,gY,eX,eY,rate)=>{       //gX没用到，默认从0开始
            const list=[];
            const max=line/(1+eX);
            const rows= Math.ceil((amount+gX)/max);
            const ww=w/rate;
            const hh=h/rate;
            for(let i=0;i<amount;i++){
                const br=Math.floor((gX+i)/max);
                list.push({
                    mX:ww*(eX+1)*((gX+i)%max),  //margin的X值
                    mY:(br-rows)*hh*(1+eY),    //margin的Y值
                    wX:ww*(eX+1),            //block的width
                    wY:hh*(eY+1),            //block的height
                });
            }
            //console.log(list);
            return list;
        },
        //ipart: 选中的组件
        //iselect, 选中的零件
        autoFresh:(ipart,iselect)=>{
            const tpl = Data.getHash("cache", alink.toLocaleLowerCase());
            
            //0.获取基本的参数
            const def=tpl.raw;
            const target=def.parts[ipart];
            const w=def.cell[0],h=def.cell[1];
            const [gX,gY,eX,eY]=target.img;
            const [start,step,divide,offset]=target.value;
            const [line,row]=def.grid;
            const max=line/(1+eX);
            const br=Math.ceil((gX+divide)/max);
            const height=h*24;      //这里的行数出错了，需要修正
            //console.log(height);
            //console.log(`Rows: ${br}`,max);
            //1.截取显示对应的图像
            setBS64(def.image);  
            const rate=  1.0526;        
            const obj={
                width: "100%",
                height: `${h*(1+eY)*br/rate}px`,
                backgroundImage: `url("${def.image}")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition:`0% ${rate*100*h*gY/height}%`,
                backgroundSize: "cover",
                //backgroundPosition:`0px ${h*gY}px`,
                //backgroundSize: "fill",
                //backgroundPosition:`0px ${height-h*gY}px`,
                //backgroundSize: "cover",
            }
            console.log(obj);
            setImageMap(obj);

            //2.显示组件列表
            setParts(def.parts);

            //3.显示组件的按钮
            const ns=self.getHelper(divide,line,w,h,gX,gY,eX,eY,rate)
            setGrid(ns);

            //4.渲染图像
            const basic = {
                cell: def.cell,
                grid: def.grid,
                target: def.size
            }
            console.log(basic);
            const pen = Render.create(dom_id,true);
            Render.clear(dom_id);
            Render.preview(pen,def.image,hash,def.parts,basic);
        },
    }

    const offset=90;
    const dom_id = "pre_detail";
    useEffect(() => {
        self.autoFresh(selected,active);

    }, [props.update]);

    return (
        <Row className="pt-1">
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                Alink: <strong>{props.alink}</strong> 
            </Col>
             <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace size={40} color={"#FFAABB"} onClick={(ev)=>{
                    self.clickBack(ev);
                }}/>
            </Col>
            
            <Col sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col sm={size.thumb[0]} xs={size.thumb[0]}>
                        <canvas id={dom_id} width={width} height={height}></canvas>
                    </Col>
                    <Col sm={size.thumb[1]} xs={size.thumb[1]}>
                        <ListGroup as="ul" style={{cursor:"pointer"}}>
                        {parts.map((row, index) => (
                            <ListGroup.Item key={index} as="li" active={selected===index} onClick={(ev)=>{
                                self.clickPart(index);
                            }}>
                                {/* {console.log(row)} */}
                                <FaPuzzlePiece size="20" color={"#AAAAAA"}/> #{index}
                            </ListGroup.Item>
                        ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Col>
            
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <div style={cmap}></div>
                {grid.map((row, index) => (
                    <div className="cover" key={index} style={{
                            marginLeft:`${row.mX}px`,
                            marginTop:`${row.mY}px`,
                            width:`${row.wX}px`,
                            height:`${row.wY}px`,
                            lineHeight:`${row.wY}px`,
                            backgroundColor:self.getBackground(index),
                        }} 
                        onClick={(ev)=>{
                            self.clickGrid(index);
                        }}>
                        {index}
                    </div>
                ))}
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.hash[0]} xs={size.hash[0]}>
                Mock hash: 0xabc123abc123<span className="bg-warning"><strong> ab </strong></span>123abc12
            </Col>
            <Col className="text-end" sm={size.hash[1]} xs={size.hash[1]}>
                <FaSyncAlt size={24} color={"#FFAABB"} onClick={(ev)=>{
                    self.clickHashFresh(ev);
                }}/> 
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                From 24 to 26, hexadecimal value <strong> 231 </strong>, offset value 0<br />
                Target <strong> 231%16 = 12 </strong>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <FaLongArrowAltDown size={24} color={"#FFAABB"} className="pr-2"/>
                <span style={{fontSize:"24px"}} className="mt-2">0</span>
                <FaLongArrowAltUp size={24} color={"#FFAABB"} className="pl-2"/> 
            </Col>
            {/* <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            
            <Col sm={size.row[0]} xs={size.row[0]}>
                Cover here, the same as editor
            </Col> */}
        </Row>
    )
}

export default Detail;