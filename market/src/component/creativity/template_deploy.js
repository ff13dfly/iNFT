import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import DeployCESS from "./deploy_cess";
import DeployW3S from "./deploy_w3s";
import DeployCrust from "./deploy_crust";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function TemplateDeploy(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const router={
    w3s:<DeployW3S />,
    crust:<DeployCrust />,
    cess:<DeployCESS />,
  }

  const self = {
    clickDeploy:(name)=>{
      if (props.show && router[name]) props.show(router[name]);
    },
  }

  useEffect(() => {
    const arr=[
        {name:"w3s"},
        {name:"crust"},
        {name:"cess"},
      ]
    setList(arr);
  }, []);

  return (
      <Row>
        {list.map((row, index) => (
        <Col key={index} className="pointer" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <button className="btn btn-md btn-default" onClick={(ev) => {
            self.clickDeploy(row.name);
          }}>{JSON.stringify(row)}</button>
        </Col>
      ))}
      </Row>
  );
}
export default TemplateDeploy;