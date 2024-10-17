import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import tools from "../../lib/tools";
import Network from "../../network/router";
import INFT from "../../system/inft";

import { FaLightbulb, FaPencilAlt, FaBalanceScale, FaFunnelDollar, FaPaperPlane } from "react-icons/fa";

function ListGoing(props) {
    const size = {
        row: [12],
        right: [3, 9],
    };


    let [list, setList] = useState([]);

    const self = {
        formatApls: (arr, ck, map) => {
            if (map === undefined) map = [];
            if (arr.length === 0) return ck && ck(map);
            const row = arr.pop();
            const ak = tools.decode(row.inft);
            const chain = Network("anchor");
            chain.view(ak, "anchor", (inft) => {
                if (inft === false) return self.formatApls(arr, ck, map);
                INFT.single.thumb(inft.name, inft.raw, inft.hash, (bs64) => {
                    row.more = {
                        inft: inft,
                        thumb: bs64,
                    }

                    map.push(row);
                    return self.formatApls(arr, ck, map);
                });
            });
        },
    }
    useEffect(() => {
        //console.log(props.data);
        if (props.data) {
            self.formatApls(props.data, (arr) => {
                console.log(arr);
                setList(arr);
            });
        }
    }, [props.data]);

    return (
        <Row >
            <Col sm={size.row[0]} xs={size.row[0]}>
               <h6>Going</h6> 
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                {list.map((row, index) => (
                    <Row key={index} >
                        <Col sm={size.right[0]} xs={size.right[0]}>
                            <img alt="" src={row.more.thumb} className="series_thumb pointer" />
                        </Col>
                        <Col sm={size.right[1]} xs={size.right[1]}>
                            <Row>
                                <Col sm={size.row[0]} xs={size.row[0]}>
                                    <FaLightbulb className="text-info pr-2"/>{tools.shorten(row.inft,12)}
                                </Col>
                                <Col sm={size.row[0]} xs={size.row[0]}>
                                    <FaPencilAlt className="text-info pr-2"/>{tools.shorten(row.apply.alink,12)}
                                </Col>
                                <Col sm={size.row[0]} xs={size.row[0]}>
                                    <FaBalanceScale className="text-info pr-2"/>{tools.shorten(row.judge.alink,12)}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                ))}
            </Col>

        </Row>
    )
}

export default ListGoing;