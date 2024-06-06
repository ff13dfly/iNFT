exports.config = {
    'name':'history',
    'node':'wss://dev2.metanchor.net',
    'redis':{
        'host':'localhost',
        'port':6379,
        'auth':'',
    },
    'keys':{
        'entry':'history_entry',
    },
};