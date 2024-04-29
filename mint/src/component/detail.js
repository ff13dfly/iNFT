import { Row, Col, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

import Template from "./template";

import SmallHash from "./hash_small";

//import Chain from "../lib/chain";
import Data from "../lib/data";
import Render from "../lib/render";
import tools from "../lib/tools";
import Copy from "../lib/clipboard";

import { FaBackspace, FaCopy, FaSyncAlt } from "react-icons/fa";

let current = 0;
let hash="0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f889fea9bb";
function Detail(props) {
    const size = {
        row: [12],
        back: [10, 2],
        title: [2, 7, 3],
        thumb: [7, 5],
        hash: [10, 2],
        part: [2],
    };

    const dialog = props.dialog;
    const alink = props.alink;

    let [width, setWidth] = useState(400);
    let [height, setHeight] = useState(400);

    let [start, setStart] = useState(0);
    let [step, setStep] = useState(0);
    let [value, setValue] = useState("00");
    let [dvd, setDvd]=useState(8);

    let [bs64, setBS64] = useState("image/empty.png");
    let [img_part, setImagePart] = useState("");
    let [parts, setParts] = useState([]);        //iNFT parts list

    let [cut_width, setCutWidth] = useState(400);
    let [cut_height, setCutHeight] = useState(50);
    let [hide_mask, setHideMask] = useState(true);

    let [selected, setSelected] = useState(0);        //selected iNFT parts
    let [active, setActive] = useState(null);         //index of selected image range
    let [grid, setGrid] = useState([]);             //mask grid on the selected image

    let [recover, setRecover] = useState({});

    const self = {
        clickBack: () => {
            dialog(<Template fresh={props.fresh} dialog={props.dialog} />, "Template");
        },
        clickGrid: (index) => {
            //console.log(`Index ${index} clicked.`);
            setActive(index);
        },
        clickPart: (index) => {
            setSelected(index);
            current = index;
            self.autoFresh(index, active);
        },
        clickHashFresh: (ev) => {
            hash=self.randomHash(64);
            self.autoFresh(current, active);
        },
        clickCopy: (cid) => {
            Copy(cid);
        },
        clickRecover: (key, at) => {
            if (!recover[key]) {
                recover[key] = "text-info";
                setRecover(tools.copy(recover));
                setTimeout(() => {
                    delete recover[key];
                    setRecover(tools.copy(recover));
                }, !at ? 1000 : at);
            }
        },
        randomHash: (n) => {
            const str = "01234567890abcdef";
            let hex = "0x";
            for (let i = 0; i < n; i++) hex += str[tools.rand(0, str.length - 1)];
            return hex;
        },
        getBackground: (index) => {
            const selected_grid = Data.get("grid");
            const ac = "#4aab67";
            const sc = "#f7cece";
            const bc = "#99ce23";
            if (selected_grid === index) {
                return sc;
            } else {
                return active === index ? ac : bc
            }
        },
        getHelper: (amount, line, w, h, gX, gY, eX, eY, rate) => {       //gX没用到，默认从0开始
            const list = [];
            const max = line / (1 + eX);
            const rows = Math.ceil((amount + gX) / max);
            const ww = w / rate;
            const hh = h / rate;
            for (let i = 0; i < amount; i++) {
                const br = Math.floor((gX + i) / max);
                list.push({
                    mX: ww * (eX + 1) * ((gX + i) % max),  //margin的X值
                    //mY:(br-rows)*hh*(1+eY),    //margin的Y值
                    mY: (br - rows) * hh * (1 + eY) / rate,         //margin的Y值
                    wX: ww * (eX + 1),            //block的width
                    wY: hh * (eY + 1),            //block的height
                });
            }
            //console.log(list);
            return list;
        },
        //ipart: 选中的组件
        //iselect, 选中的零件
        autoFresh: (ipart, iselect, nhash) => {
            const def = Data.getHash("cache", alink.toLocaleLowerCase());

            //0.get template parameters
            //const def=tpl.raw;
            const target = def.parts[ipart];
            const w = def.cell[0], h = def.cell[1];
            const [ gX, gY, eX, eY ] = target.img;
            const [ start, step, divide, offset ] = target.value;
            const [ line, row ] = def.grid;
            const max = line / (1 + eX);
            const br = Math.ceil((gX + divide) / max);
            const height = h * 24;      //这里的行数出错了，需要修正
            const rate = 1.0526;

            //1. set hash board
            setStart(start);
            setStep(step);
            setDvd(divide);
            setValue(nhash===undefined?hash.slice(start+2,start+2+step):nhash.slice(start+2,start+2+step));
            //console.log(hash);

            //2.get the image part from origanal image
            const ch = h * (1 + eY) * br / rate;
            setCutHeight(ch);
            setCutWidth(def.size[0]);

            setHideMask(true);  //close the mask ?

            const cpen = Render.create(cut_id);
            Render.clear(cut_id);
            Render.cut(cpen, def.image, w, h, gY, line, (1 + eY) * br, (b64) => {
                setImagePart(b64);
                setTimeout(() => {
                    setHideMask(false);
                }, 50);
            });

            //3.显示组件列表
            setParts(def.parts);

            //4.显示组件的按钮
            const ns = self.getHelper(divide, line, w, h, gX, gY, eX, eY, rate)
            setGrid(ns);

            //5.渲染图像
            const basic = {
                cell: def.cell,
                grid: def.grid,
                target: def.size
            }

            const pen = Render.create(dom_id, true);
            Render.reset(pen);
            Render.preview(pen, def.image, hash, def.parts, basic);
            Render.active(pen, w * (1 + eX), h * (1 + eY), target.position[0], target.position[1], "#FFFFFF", 2);
            setTimeout(() => {
                const img = pen.canvas.toDataURL("image/jpeg");
                setBS64(img);
            }, 50);
        },
        getHashArray: (hash, line) => {

        },
    }

    const dom_id = "pre_detail";
    const cut_id = "pre_cut";
    useEffect(() => {
        setImagePart("");
        self.autoFresh(selected, active);

    }, [props.update]);

    return (
        <Row className="pt-1">
            <Col className="pt-1" sm={size.back[0]} xs={size.back[0]}>
                IPFS CID: <strong>{tools.shorten(props.alink)}</strong><button className="btn btn-sm btn-secondary" style={{ marginLeft: "10px" }} onClick={(ev) => {
                    self.clickCopy(props.alink);
                    self.clickRecover("copy");
                }}><FaCopy className={!recover.copy ? "" : recover.copy} /></button>
            </Col>
            <Col className="text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col className="pt-2 text-center" sm={size.row[0]} xs={size.row[0]}>
                <h5>Val: 0x{value}, Dec:{parseInt(`0x${value}`)}, Result: {parseInt(`0x${value}`)} % {dvd} =  <span className="text-warning">{parseInt(`0x${value}`)%dvd}</span> </h5>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col sm={size.thumb[0]} xs={size.thumb[0]}>
                        <canvas hidden={true} id={dom_id} width={width} height={height} style={{ width: "100%" }}></canvas>
                        <img src={bs64} alt="" style={{ width: "100%", minHeight: "150px" }} />
                    </Col>
                    <Col sm={size.thumb[1]} xs={size.thumb[1]}>
                        <Row>
                            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                                Mock hash ( {hash.length-2} )
                            </Col>
                        </Row>
                        <SmallHash hash={hash} start={start} step={step} />
                        <Row>
                            <Col className="text-center pt-1" sm={size.row[0]} xs={size.row[0]}>
                                <button className="btn btn-md btn-secondary" onClick={(ev) => {
                                    self.clickHashFresh(ev);
                                }}>
                                    <FaSyncAlt className="pointer" size={16} color={"#FFAABB"} />
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col className="" sm={size.row[0]} xs={size.row[0]}>
                <small>Range of part at orgin image.</small>
                <canvas hidden={true} id={cut_id} width={cut_width} height={cut_height}></canvas>
                <img src={img_part} alt="" style={{ width: "100%" }} />
                {grid.map((row, index) => (
                    <div hidden={hide_mask} className="cover" key={index} style={{
                        marginLeft: `${row.mX}px`,
                        marginTop: `${row.mY}px`,
                        width: `${row.wX}px`,
                        height: `${row.wY}px`,
                        lineHeight: `${row.wY}px`,
                        backgroundColor: self.getBackground(index),
                        color: "#FF0000",
                    }}
                        onClick={(ev) => {
                            self.clickGrid(index);
                        }}>
                        {index}
                    </div>
                ))}
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                iNFT template {parts.length} parts selector.
            </Col>
            <Col className="" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    {parts.map((row, index) => (
                        <Col key={index} className="pt-2" sm={size.part[0]} xs={size.part[0]}>
                            <button className={index === selected ? "btn btn-md btn-secondary text-warning" : "btn btn-md btn-secondary"} onClick={(ev) => {
                                self.clickPart(index);
                            }}>
                                {/* <FaPuzzlePiece size="20" color={"#AAAAAA"} style={{marginTop:"-5px"}}/> */}
                                <strong>#{index+1}</strong>
                            </button>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    )
}

export default Detail;