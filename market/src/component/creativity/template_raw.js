import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import GENE from "../../system/gene";
import tools from "../../lib/tools";

/* Gene template deployment data
*   @param  {string}    name        //unique name of Gene
*/

function TemplateRaw(props) {
  const size = {
    row: [12],
    head: [10, 2],
  };

  let [info, setInfo] = useState("");
  let [json, setJson] = useState("");
  let [beauty, setBeauty]= useState(false);


  const self = {
    changeBeauty:(ev)=>{
      setBeauty(!beauty);
    },
    warning: (txt, at) => {
      setInfo(txt);
      if (at !== undefined) {
        setTimeout(() => {
          setInfo("");
        }, at);
      }
    },
  }

  useEffect(() => {
    GENE.get(props.name, (dt) => {
      if (dt.error) return self.warning(dt.error);
      if (!dt.parts) return self.warning("Invalid Gene data format");
      setJson(JSON.stringify(dt));
    });
  }, [props.name,props.update]);

  return (
    <Row>
      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        Total {json.length.toLocaleString()} bytes.
      </Col>
      <Col md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        <Form>
          <Form.Check type="checkbox" label={`Format beauty.`} checked={beauty} onChange={(ev) => {
            self.changeBeauty(ev);
          }} />
        </Form>
      </Col>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <textarea className="form-control" disabled rows={22} value={json}></textarea>
      </Col>
    </Row>
  );
}
export default TemplateRaw;