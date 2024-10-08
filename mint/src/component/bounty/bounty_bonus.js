import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import BountyApply from "./bounty_apply";
import BountyProgress from "./bounty_progress";

/* Bounty bonus list, the entry to apply and check the progress
*   @param  {array}     data        //bonus list
*   @param  {object}    bounty      //bounty data from parent
*   @param  {string}    alink       //bounty anchor link of bounty
*   @param  {function}  dialog      //system dialog function
*/

function BountyBonus(props) {
    const size = {
        row: [12],
        right: [3, 9],
        left:[8,4],
    };

    let [bonus, setBonus] = useState([]);

    const self = {
        clickApply:(ev)=>{
            props.dialog(<BountyApply dialog={props.dialog} alink={props.alink}/>,"Bounty Apply");
        },
        clickProgress:(ev)=>{
            props.dialog(<BountyProgress dialog={props.dialog} alink={props.alink}/>,"Apply Progress");
        },
        getThumb: (index) => {
            if(props.bounty){
                const all = props.bounty.template.raw.series[index];
                return all.thumb[0];
            }
            return "";
        },
    }
    useEffect(() => {
        console.log(props.bounty);
        if (props.data) setBonus(props.data);
    }, [props.data]);

    return (
        <Col sm={size.row[0]} xs={size.row[0]}>
            {bonus.map((row, index) => (
                <Row key={index}>
                    <Col className="pt-2" sm={size.right[0]} xs={size.right[0]}>
                        <img alt="" src={self.getThumb(row.series)} className="series_thumb pointer" />
                    </Col>
                    <Col className="pt-2" sm={size.right[1]} xs={size.right[1]}>
                        <Row>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Prize: <strong className="text-info">{row.bonus}</strong> $ANK, <strong>{row.amount}</strong>p wanted
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Rarity: 1/34,500 
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Progress of bonus
                            </Col>
                            <Col sm={size.left[0]} xs={size.left[0]}>
                                Winner thumbs
                            </Col>
                            {/* <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                                <button className="btn btn-sm btn-primary" onClick={(ev)=>{
                                    self.clickApply(ev);
                                }}>Apply</button>
                            </Col> */}
                            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                                <button className="btn btn-sm btn-primary" onClick={(ev)=>{
                                    self.clickProgress(ev);
                                }}>Progress</button>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={size.row[0]} xs={size.row[0]}>
                        <hr />
                    </Col>
                </Row>
            ))}
        </Col>
    )
}

export default BountyBonus;