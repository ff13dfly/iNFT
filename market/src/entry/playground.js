import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../component/common_header";
import PriveiwINFT from "../component/inft_preview";
import PartsINFT from "../component/inft_parts";
import SeriesINFT from "../component/inft_series";

import tools from "../lib/tools";
import IPFS from "../network/ipfs";

const template_orgin = {
    "IPFS": ["web3.storage"],
    "Chain": ["anchor"]
}

function Playground(props) {
    let { cid } = useParams();

    const size = {
        row: [12],
        search: [3, 6, 3],
        header: [6, 6],
        parts:[11,1],
        mock:[6,6],
    };

    let [list, setList] = useState([]);
    let [update, setUpdate] = useState(0);
    let [search, setSearch] = useState("");
    let [network, setNetwork] = useState("");        //default network
    let [enable, setEnable] = useState({
        selector: true,
        search: true,
        button: true,
    });

    //template values
    let [hash, setHash]=useState("0x6353bc102e185084671c2c1391cbb7876911e9f65cdfa46e2d9cc5f1a027a0aa");
    let [full, setFull]=useState("imgs/empty.png");
    let [parts, setParts]=useState([]);
    let [series, setSeries]=useState([]);

    const self = {
        changeSearch: (ev) => {
            setSearch(ev.target.value);
        },
        changeNetwork: (ev) => {
            setNetwork(ev.target.value);
        },
        changeHash:(ev)=>{
            setHash(ev.target.value);
        },
        clickLoad: (ev) => {
            //console.log(network);
            //console.log(search);
            if(network && search){
                const proxy=true;
                IPFS.read(search,(def)=>{
                    self.show(def);
                },proxy);
            }
        },
        show:(def)=>{
            if(def.image) setFull(def.image);
            if(def.parts) setParts(def.parts);
            if(def.series) setSeries(def.series);
        },
        getListFromOrgin: (map) => {
            const arr = [];
            for (let from in map) {
                for (let i = 0; i < map[from].length; i++) {
                    arr.push({
                        from: from,
                        orgin: map[from][i],
                    });
                }
            }
            return arr;
        },
        fresh: () => {
            setUpdate(update + 1);
        },

    }

    useEffect(() => {
        const nlist = self.getListFromOrgin(template_orgin);
        setList(nlist);

        const selected=nlist[0];
        setNetwork(`${selected.from}::${selected.orgin}`);

    }, [props.data]);

    return (
        <div>
            <Header active={"playground"} />
            <Container>
                <Row className="pt-2">
                    <Col md={size.search[0]} lg={size.search[0]} xl={size.search[0]} xxl={size.search[0]} >
                        <select name="" className='form-control'
                            value={network}
                            disabled={!enable.selector}
                            onChange={(ev) => {
                                self.changeNetwork(ev);
                            }}>
                            {list.map((row, index) => (
                                <option value={`${row.from}::${row.orgin}`} key={index} >{row.from}::{row.orgin}</option>
                            ))}
                        </select>
                    </Col>
                    <Col md={size.search[1]} lg={size.search[1]} xl={size.search[1]} xxl={size.search[1]} >
                        <small></small>
                        <input className='form-control' type="text" placeholder='The template to load'
                            disabled={!enable.search}
                            value={search} onChange={(ev) => {
                                self.changeSearch(ev);
                            }}
                        />
                    </Col>
                    <Col md={size.search[2]} lg={size.search[2]} xl={size.search[2]} xxl={size.search[2]} >
                        <button className='btn btn-md btn-primary'
                            disabled={!enable.button}
                            onClick={(ev) => {
                                self.clickLoad(ev);
                            }}>Load Template</button>
                    </Col>
                    <Col className="pt-2" md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]} >
                        <PriveiwINFT id={"iNFT_view"} hash={"0x"} />

                        <Row className="pt-2">
                            <Col md={size.mock[0]} lg={size.mock[0]} xl={size.mock[0]} xxl={size.mock[0]} >
                                <h5>Mock Hash</h5>
                                <textarea className="form-control" rows={5} 
                                    placeholder="Mock hash to test iNFT." 
                                    value={hash} 
                                    onChange={(ev)=>{
                                        self.changeHash(ev);
                                    }}></textarea>
                            </Col>
                            <Col md={size.mock[1]} lg={size.mock[1]} xl={size.mock[1]} xxl={size.mock[1]} >
                                <h5>Mock Offset</h5>
                                <textarea className="form-control" rows={5} placeholder="Mock offset to test iNFT."></textarea>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="pt-2" md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]} >
                       
                        <Row className="pt-2">
                            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                                <h5>iNFT Parts</h5>
                            </Col>
                            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                                <PartsINFT data={parts}/>
                            </Col>
                            <Col className="pt-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                                <h5>iNFT Series</h5>
                            </Col>
                            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                                <SeriesINFT data={series}/>
                            </Col>
                            <Col className="pt-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                                <h5>Full Image ( {full.length.toLocaleString()} )</h5>
                            </Col>
                            <Col className="pb-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                                <img src={full} style={{width:"100%"}} alt="Full template."/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Playground;