import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./entry/home";
import Template from "./entry/template";
import Playground from "./entry/playground";
import Editor from "./entry/editor";
import Minter from "./entry/minter";
import Market from "./entry/market";
import Bounty from "./entry/bounty";
import Explorer from "./entry/explorer";

import View from "./entry/view";
import InvalidPage from "./entry/404";
import Preview from "./entry/preview";
import Detail from "./entry/detail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="home" index element={<Home />} />
          <Route path="market" element={<Market />} />
          <Route path="market/:page" element={<Market />} />
          {/* <Route path="bounty" element={<Bounty />} />
          <Route path="bounty/:page" element={<Bounty />} /> */}
          <Route path="template" element={<Template />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="template/:page" element={<Template />} />
          <Route path="playground" element={<Playground />} />
          <Route path="playground/:cid" element={<Playground />} />
          <Route path="minter" element={<Minter />} />
          <Route path="editor" element={<Editor />} />
          
          <Route path="/" element={<Home />}></Route>

          <Route path="view/:anchor" element={<View />}></Route>
          <Route path="detail/:anchor" element={<Detail />}></Route>
          <Route path="preview/:cid" element={<Preview />}></Route>
          
          <Route path="*" element={<InvalidPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
