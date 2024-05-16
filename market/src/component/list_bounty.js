import { Row, Col, Card, Placeholder } from 'react-bootstrap';
import { useEffect, useState } from "react";

function ListBounty(props) {
  const size = {
    row: [12],
    grid: [3, 6, 6],
  };

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
    const nlist = self.getHolder(6);
    setList(nlist);

    setTimeout(() => {
      setReady(true);
    }, 15000)
  }, [props.update]);

  return (
    <Row>
      {list.map((row, index) => (
        <Col className="justify-content-around pt-2" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
          <Row>
            <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
              <Card hidden={!ready} style={{ width: '100%' }}>
                <a href={`/playground/${row.name}`}>
                  <Card.Img variant="top" src={`${window.location.origin}/imgs/logo.png`} />
                </a>
                <Card.Body>
                  <Card.Title>Bounty Title</Card.Title>
                  <Card.Text>
                    1 BTC to buy the treasure tree.
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
                </Card.Body>
              </Card>
            </Col>
            <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
              <h6>1 BTC ( 3,000 $INFT )</h6>
              <Placeholder hidden={ready} xs={6} animation="glow"></Placeholder>
            </Col>
            <Col md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
            </Col>
          </Row>

        </Col>
      ))}
    </Row>
  );
}
export default ListBounty;