import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import TemplateList from "./template_list";

import tools from "../../lib/tools";

/* Template creator basic setting
*   @param  {function}    props.show        //function to update content on home page
*   @param  {number}      props.update      //force to update
*   @param  {boolean}     props.sidebar     //wether the sidebar is hidden
*   @param  {function}    props.fresh       //entry fresh function, update the title
*/

function CreativityNav(props) {
  const size = {
    row: [12],
    half: [6],
  };

  const navs = [
    {
      title: "Creativity Center",
      operation: "template operation component",
      under: "Here to go",
    },
    {
      title: "Gene Local List",
      operation: "template operation component",
      under: <TemplateList show={props.show} fullscreen={props.fullscreen} fresh={props.fresh} update={props.update} />,
    },
  ]

  let [show, setShow] = useState({ 0: true });

  const self = {
    router: (order) => {
      show[order] = !show[order] ? true : (!show[order]);
      setShow(tools.clone(show));
    },
  }

  useEffect(() => {

  }, []);

  return (
    <Row className="creativity-container">
      {navs.map((row, index) => (
        <Col key={index} className="border_bottom" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <Row>
            <Col className="bg-secondary text-white pointer pt-2 pb-1 creativity-nav"
              md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} onClick={(ev) => {
                self.router(index)
              }}>
              <h6>{row.title}</h6>
            </Col>
            <Col  className="creativity-under" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}
              hidden={show[index] ? false : true}>
              {row.under}
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}
export default CreativityNav;