import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./entry/home";
import Template from "./entry/template";
import Editor from "./entry/editor";
import Minter from "./entry/minter";
import Market from "./entry/market";

import View from "./entry/view";
import InvalidPage from "./entry/404";
import Preview from "./entry/preview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="home" index element={<Home />} />
          <Route path="market" element={<Market />} />
          <Route path="template" element={<Template />} />
          <Route path="editor" element={<Editor />} />
          <Route path="minter" element={<Minter />} />
          <Route path="/" element={<Home />}></Route>
          <Route path="view/:anchor" element={<View />}></Route>
          <Route path="template/:cid" element={<Preview />}></Route>
          <Route path="*" element={<InvalidPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
