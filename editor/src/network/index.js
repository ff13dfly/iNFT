

const Network={
  set:(network_name)=>{   //设置到访问指定的网络

  },

  subcribe:(name,ck)=>{   //订阅网络的变化

  },
  block:(block,ck)=>{     //查看指定block的数据

  },
  transaction:(hash,ck)=>{  //查看指定交易的数据

  },

  template:(target,ck)=>{    //获取到iNFT对应的模版文件

  },
  mount:(tpl,pair,ck)=>{     //发布模版文件到网络

  },
  mint:(target,sign,ck)=>{    //实际的mint一次的操作

  },
}

export default Network;