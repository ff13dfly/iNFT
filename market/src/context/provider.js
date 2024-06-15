import React, { createContext, useState } from 'react';

import TPL from "../lib/tpl";
import Network from "../network/router";

const INFTFramework = createContext();

let count_a=0;

export const INFTProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState("Initial Data");
  const [count,setCount]=useState(0);

  const sharedFunction = () => {
    setCount(count+1);
    count_a++;
    console.log(`[${count},${count_a}]This is a shared function`);
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
