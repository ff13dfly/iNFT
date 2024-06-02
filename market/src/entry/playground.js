import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../component/common_header";
import PriveiwINFT from "../component/inft_preview";
import PartsINFT from "../component/inft_parts";

import tools from "../lib/tools";

const template_orgin = {
    "IPFS": ["web3.storage"],
    "Chain": ["anchor"]
}

function Playground(props) {
    let { cid } = useParams();

    const size = {
        row: [12],
        search: [3, 5, 4],
        header: [4, 8]
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

    const self = {
        changeSearch: (ev) => {
            setSearch(ev.target.value);
        },
        changeNetwork: (ev) => {
            console.log(ev.target.value);
            setNetwork(ev.target.value);
        },
        clickSearch: (ev) => {
            console.log(network);
            console.log(search)
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
                                self.clickSearch(ev);
                            }}>Load Template</button>
                    </Col>
                    <Col className="pt-2" md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]} >
                        <PriveiwINFT id={"iNFT_view"} hash={"0x"} />
                        <PartsINFT />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Playground;