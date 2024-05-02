const map={};

const self={
  decode:(hash)=>{

  },
}

const plugin = {
  reg:(key,fun)=>{  
    map[key]=fun;
  },
  run:(key,params)=>{
    map[key](...params);
  },
};

module.exports = plugin;