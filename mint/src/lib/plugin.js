const map={};
const self={

}

const plugin = {
  reg:(key,fun)=>{  
    map[key]=fun;
  },
  run:(key,params)=>{
    map[key](...params);
  },
  remove:(key)=>{
    delete map[key];
  }
};

module.exports = plugin;