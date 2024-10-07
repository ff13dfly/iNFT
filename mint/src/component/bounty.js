import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import API from "../system/api";
import tools from "../lib/tools";
import TPL from "../system/tpl";
import AnchorJS from "../network/anchor";

function Bounty(props) {
    const size = {
        row: [12],
        page: [4, 4, 4],
        right: [3,9],
    };

    let [page, setPage] = useState(1);
    let [single, setSingle] = useState({});

    let [list, setList] = useState([]);
    let [bonus, setBonus] = useState([]);

    const self = {
        clickPrevious: (ev) => {

        },
        clickNext: (ev) => {

        },
        prepareData: (list, ck, bts) => {
            if (!bts) bts = [];
            if (list.length === 0) return ck && ck(bts);
            const row = list.pop();
            const anchor = tools.decode(row.alink);

            AnchorJS.view(anchor, "anchor", (res) => {
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
        getThumb:(index)=>{
            //console.log(index);
            const all = single.template.raw.series[index];
            return all.thumb[0];
        },
    }
    useEffect(() => {
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
        }, page, 1);
    }, []);

    return (
        <Row>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <h6>{single.alink}</h6>
            </Col>
            {bonus.map((row, index) => (
                <Col key={index} sm={size.row[0]} xs={size.row[0]}>
                    <Row>
                        <Col className="pt-2" sm={size.right[0]} xs={size.right[0]}>
                        <img alt="" src={self.getThumb(row.series)} className="series_thumb pointer" />
                        </Col>
                        <Col className="pt-2" sm={size.right[1]} xs={size.right[1]}>
                            Bonus:{row.bonus}, Amount:{row.amount}
                        </Col>
                        <Col key={index} sm={size.row[0]} xs={size.row[0]}>
                        <hr />
                        </Col>
                    </Row>
                </Col>
            ))}
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                Ticket Status
            </Col>
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