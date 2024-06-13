import { Row, Col, Card, Placeholder } from 'react-bootstrap';
import { useEffect, useState } from "react";

import API from "../lib/api";

function ListTemplate(props) {
  const size = {
    row: [12],
    grid: [4],
  };
  let [page, setPage] = useState(1);
  let [step, setStep] = useState(12);

  let [list, setList] = useState([]);
  let [ready, setReady] = useState(false);

  const self = {
    getHolder: (n) => {
      const arr = []
      for (let i = 0; i < n; i++) {
        arr.push({ name: "fake_" + i });
      }
      return arr;
    },
  }

  useEffect(() => {
    
    API.template(page, (res) => {
      if (res.data && res.data.length !== 0) {
        const nlist = self.getHolder(res.data.length);
        setList(nlist);

        
      }
    },step);
  }, [props.update]);

  return (
    <Row>
      {list.map((row, index) => (
        <Col className="justify-content-around pt-2" key={index} lg={size.grid[0]} xxl={size.grid[0]} md={size.grid[0]}>

          <Card hidden={!ready} style={{ width: '100%' }}>
            <a href={`/preview/${row.name}`}>
              <Card.Img variant="top" src={`${window.location.origin}/imgs/logo.png`} />
            </a>
            <Card.Body>
              <Card.Title>Template Name</Card.Title>
              <Card.Text>
                Desc about template
              </Card.Text>
            </Card.Body>

          </Card>

          <Card hidden={ready} style={{ width: '100%' }}>
            <Card.Img variant="top" src={`${window.location.origin}/imgs/logo.png`} />
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                <Placeholder xs={6} /> <Placeholder xs={8} />
              </Placeholder>
              <Placeholder.Button variant="primary" xs={6} />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
export default ListTemplate;