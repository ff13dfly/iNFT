import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import TemplateList from "./template_list";
//import TemplateDeploy from "./template_deploy";

import tools from "../../lib/tools";

/* Template creator basic setting
*   @param  {function}    show        //function to update content on home page
*   @param  {boolean}     sidebar     //wether the sidebar is hidden
*   @param  {function}    fresh       //entry fresh function, update the title
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
      under: <TemplateList show={props.show} sidebar={props.sidebar} fresh={props.fresh} />,
    },
    // {
    //   title: "Image Cell List",
    //   operation: "template operation component",
    //   under: <TemplateList />,
    // },
    // {
    //   title: "Image",
    //   operation: "image under operation",
    //   under: "b",
    // },
    // {
    //   title: "Components",
    //   operation: "Components under operation",
    //   under: "c",
    // },
    // {
    //   title: "Series",
    //   operation: "series under operation",
    //   under: "d",
    // },
    // {
    //   title: "Deployment",
    //   operation: "deploy under operation",
    //   under: <TemplateDeploy show={props.show} />,
    // },
    // {
    //   title: "Published",
    //   operation: "deploy under operation",
    //   under: <TemplateList show={props.show}/>,
    // },
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
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

      </Col>
      {navs.map((row, index) => (
        <Col key={index} className="border_bottom" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <Row>
            <Col className="bg-secondary text-white pointer pt-2 pb-1 creativity-nav"
              md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} onClick={(ev) => {
                self.router(index)
              }}>
              <h6>{row.title}</h6>
            </Col>
            <Col className="creativity-under" hidden={show[index] ? false : true} key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              {row.under}
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}
export default CreativityNav;