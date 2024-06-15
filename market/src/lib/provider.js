import React, { createContext, useState } from 'react';

import TPL from "./tpl";
import Network from "../network/router";

const INFTFramework = createContext();

export const INFTProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState("Initial Data");

  const sharedFunction = () => {
    console.log("This is a shared function");
    setSharedData("Data updated by shared function");
  };

  const exps={
    sharedData, 
    setSharedData, 
    sharedFunction, 
    TPL,
    Network
  }

  return (
    <INFTFramework.Provider value={exps}>
      {children}
    </INFTFramework.Provider>
  );
};

export default INFTFramework;
