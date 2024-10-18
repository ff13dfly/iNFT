import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import ListGoing from "./list_going";
import ListWinner from "./list_winner";

import tools from "../../lib/tools";
import Bounty from "../../system/bounty";

/* Bounty bonus progress
*   @param  {object}    bounty      //bounty data from parent
*   @param  {number}    index       //bonus index
*   @param  {function}  dialog      //system dialog function
*/

function BountyProgress(props) {
    const size = {
        row: [12],
        back:[9,3],
    };

    let [empty, setEmpty] = useState(true);
    let [winner, setWinner] = useState([]);
    let [going, setGoing]= useState([]);

    const self = {
        clickBack:(ev)=>{
            props.callback();
        },
        fresh:()=>{
            Bounty.view(props.alink,(data)=>{
                if(data===false) return false;
                Bounty.group(tools.clone(data.system.apply),(map)=>{
                    if(map.error) return setEmpty(true);
                    if(!map[props.index]) return setEmpty(true);
                    
                    setEmpty(false);
                    const data=map[props.index];
                    setWinner(data.winner);
                    setGoing(data.going);
                });
            })
        },
    }
    useEffect(() => {
       self.fresh();
    }, []);

    return (
        <Row >
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                #{props.index} Bonus.
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>

            <Col hidden={!empty} sm={size.row[0]} xs={size.row[0]}>
                <h6>No apply record yet.</h6>
            </Col>

            <Col hidden={empty} sm={size.row[0]} xs={size.row[0]}>
                <ListGoing  data={going}/>
                <ListWinner data={winner} />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                {props.alink}
            </Col>
        </Row>
    )
}

export default BountyProgress;