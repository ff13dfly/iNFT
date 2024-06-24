import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaHome,FaUserFriends,FaGlobe,FaDatabase } from "react-icons/fa";

function SettingSidebar(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const self={
    getColor:(mod)=>{
      return props.active===mod?'#FFFFFF':'#666666'
    },
  }

  const menu = [
    {
      name: "basic",
      icon: <FaHome size={20}  className='mr-5' color={self.getColor("basic")}/>,
      param: ["basic"],
      title: "Basic",
      desc:"",
    },
    {
      name: "account",
      icon: <FaUserFriends size={20}  className='mr-5' color={self.getColor("account")}/>,
      param: ["basic"],
      title: "Account",
      desc:"Manage your accounts",
    },
    {
      name: "network",
      icon: <FaGlobe size={20}  className='mr-5' color={self.getColor("network")}/>,
      param: ["basic"],
      title: "Network",
    },
    {
      name: "storage",
      icon: <FaDatabase size={20}  className='mr-5' color={self.getColor("storage")}/>,
      param: ["basic"],
      title: "Storage",
    }
  ];

  useEffect(() => {
    setList(menu);
  }, [props.active]);

  return (
    <Row className='pt-4'>
      <Col className='pb-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        iNFT Setting
      </Col>
      {list.map((row, index) => (
        <Col key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <button className={`sidebar text-start btn btn-md ${(props.active!==row.name?'btn-default':'btn-warning')}`} onClick={(ev) => {
            props.link("setting", [row.name]);
          }}><p>{row.icon}</p>  <h4>{row.title}</h4></button>
        </Col>
      ))}
    </Row>
  );
}
export default SettingSidebar;