import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import API from "../system/api";
import tools from "../lib/tools";
import TPL from "../system/tpl";
import Network from "../network/router";

import BountyTicket from "./bounty/bounty_ticket";

function Bounty(props) {
    const size = {
        row: [12],
        page: [4, 4, 4],
        right: [3, 9],
        left: [7, 5],
    };

    let [page, setPage] = useState(1);
    let [single, setSingle] = useState({});     //bounty data
    let [bonus, setBonus] = useState([]);

    const self = {
        clickPrevious: (ev) => {
            setPage(page - 1);
            self.fresh(page - 1);
        },
        clickNext: (ev) => {
            setPage(page + 1);
            self.fresh(page +1);
        },
        prepareData: (list, ck, bts) => {
            if (!bts) bts = [];
            if (list.length === 0) return ck && ck(bts);
            const row = list.pop();
            const anchor = tools.decode(row.alink);
            console.log(anchor);
            const chain = Network("anchor");
            chain.view(anchor, "anchor", (res) => {
                console.log(res);
                if (res === false) return self.prepareData(list, ck, bts);
                if (!res.raw || !res.raw.template || !res.raw.template.cid) return self.prepareData(list, ck, bts);
                const cid = res.raw.template.cid;
                TPL.view(cid, (dt) => {
                    row.template = res.raw.template;
                    row.template.raw = dt;
                    row.orgin = res;
                    bts.push(row);
                    return self.prepareData(list, ck, bts);
                });
            });
        },
        getThumb: (index) => {
            const all = single.template.raw.series[index];
            return all.thumb[0];
        },
        fresh: (p) => {
            API.bounty.list((res) => {
                console.log(res);
                if (res && res.success && res.data) {
                    self.prepareData(res.data, (bts) => {
                        if (bts.length !== 0) {
                            console.log(bts[0]);
                            setSingle(bts[0]);
                            setBonus(bts[0].orgin.raw.bonus);
                        }
                    });
                }
            }, p, 1);
        },
    }
    useEffect(() => {
        self.fresh(page);
    }, []);

    return (
        <Row>
            <Col sm={size.left[0]} xs={size.left[0]}>
                Total 45 pieces wanted.<br />
                Prize 892 $ANK.
            </Col>
            <Col className="text-center" sm={size.left[1]} xs={size.left[1]}>
                <BountyTicket />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            {bonus.map((row, index) => (
                <Col key={index} sm={size.row[0]} xs={size.row[0]}>
                    <Row>
                        <Col className="pt-2" sm={size.right[0]} xs={size.right[0]}>
                            <img alt="" src={self.getThumb(row.series)} className="series_thumb pointer" />
                        </Col>
                        <Col className="pt-2" sm={size.right[1]} xs={size.right[1]}>
                            <Row>
                                <Col sm={size.row[0]} xs={size.row[0]}>
                                    Bonus:{row.bonus}, Amount:{row.amount}
                                </Col>
                                <Col sm={size.row[0]} xs={size.row[0]}>
                                    Progress of bonus
                                </Col>
                                <Col className="text-end" sm={size.row[0]} xs={size.row[0]}>
                                    <button className="btn btn-sm btn-primary">Apply</button>
                                </Col>
                            </Row>

                        </Col>

                        <Col sm={size.row[0]} xs={size.row[0]}>
                            <hr />
                        </Col>
                    </Row>
                </Col>
            ))}
            <Col sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-2" sm={size.page[0]} xs={size.page[0]}>
                        <FaAngleLeft className="pointer" size={36} onClick={(ev) => {
                            self.clickPrevious(ev);
                        }} />
                    </Col>
                    <Col className="pt-2 text-center unselect" sm={size.page[1]} xs={size.page[1]}>

                    </Col>
                    <Col className="pt-2 text-end" sm={size.page[2]} xs={size.page[2]}>
                        <FaAngleRight className="pointer" size={36} onClick={(ev) => {
                            self.clickNext(ev);
                        }} />
                    </Col>
                </Row>
            </Col>

        </Row>
    )
}

export default Bounty;