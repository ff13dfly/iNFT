
const cache={
    address:"",
}

const RUNTIME={
    account:{
        set:(addr)=>{
            cache.address=addr;
        },
        get:()=>{
            return cache.address;
        },
    },

}

export default RUNTIME