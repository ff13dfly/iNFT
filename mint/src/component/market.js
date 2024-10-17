import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import INFTBuy from "./market/inft_buy";

import Network from "../network/router";
import INFT from "../system/inft";
import tools from "../lib/tools";

import { FaComments } from "react-icons/fa";

function Market(props) {
    const size = {
        row: [12],
        half: [6],
        left:[8,4]
    };

    let [list, setList] = useState([]);

    const self = {
        clickSingle: (data) => {
            props.dialog(<INFTBuy dialog={props.dialog} data={data} />, "iNFT Detail")
        },
        clickChat:(alink)=>{
            console.log(alink);
        },
        getThumbs: (list, ck, map) => {
            if (map === undefined) map = {};
            if (list.length === 0) {
                const narr = [];
                for (let k in map) {
                    narr.push(map[k]);
                }
                return ck && ck(narr);
            }
            const row = list.pop();
            //console.log(row);
            const chain = Network("anchor");
            chain.view({ name: row.name }, "anchor", (dt) => {
                //console.log(dt);
                dt.free = row.free;
                dt.price = row.price;
                dt.target = row.target;
                INFT.single.thumb(dt.name, dt.raw, dt.hash, (bs64) => {
                    dt.thumb = bs64;
                    map[row.name] = dt;
                    return self.getThumbs(list, ck, map);
                });
            });
        },
        fresh: () => {
            const chain = Network("anchor");
            chain.market((ms) => {
                self.getThumbs(ms, (arr) => {
                    setList(arr);
                    //console.log(map);
                });
            });
        },
    }
    useEffect(() => {

        self.fresh();
    }, []);

    return (
        <div className="market-container">
            <Row>
                {list.map((row, index) => (
                    <Col className="pointer" key={index} sm={size.half[0]} xs={size.half[0]}>
                        <Row className="pb-3">
                            <Col sm={size.half[0]} xs={size.half[0]}>
                                <h6>{tools.shorten(row.name,4)}</h6>
                            </Col>
                            <Col className="text-end" sm={size.half[0]} xs={size.half[0]}>
                                <h6>{row.block.toLocaleString()}</h6>
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                <img alt="" src={row.thumb} className="apply_thumb"  onClick={(ev) => {
                                    self.clickSingle(row);
                                }}/>
                            </Col>
                            <Col className="pt-2" sm={size.left[0]} xs={size.left[0]}>
                                <strong className="text-warning">{row.price}</strong> $ANK
                            </Col>
                            <Col className="pt-2 text-end" sm={size.left[1]} xs={size.left[1]}>
                                <button className="btn btn-sm btn-secondary" onClick={(ev) => {
                                    self.clickChat(`anchor://${row.name}/${row.block}`)
                                }}>
                                    <FaComments className="" size={16} />
                                </button>
                            </Col>

                        </Row>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Market;