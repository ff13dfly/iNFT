exports.config = {
    'name':'robot_minter',
    'node':'wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network',
    'template':'bafkreigkauu4hjwhzi3q6ar5jqfgh55b3exfxpoymasl4gt7wsbsw3nr4y',       
    'account':[     //select the account by day%account.length
        ['5D5LpGNEzW9nh3sQvz4d5FUQYuCXUhQMWTqHFZ8DMHRWzio8','123456'],
        ['5D89fyaog8qoY381YHgAPitsMoMBzvZwqcSpCG7JhehzmAa5','123456'],
        ['5FeBqbCmcQez9ZgBa1Sd6jDS4gAJg5v2KecBGF1dTNZHiJZD','123456'],
        ['5HNMtQjBnhAkEMZXxSqtw2v6RUuQfWXimpu3W84QY5f2LzbL','123456'],
    ],
    'low':10000000,         //low balance
    'interval':40000,
    'autosave':5,           //how many rounds to save setting
    'prefix':'abc_',
    'folder':'log',
    'basic':'robot_setting.json',
    'version':'1.0.0',
    'gateway':'.ipfs.w3s.link',
};