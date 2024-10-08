exports.config = {
    "name":"robot_minter",
    //"node":"wss://dev2.metanchor.net",
    "node":"ws://localhost:9944",
    //"template":"bafkreigkauu4hjwhzi3q6ar5jqfgh55b3exfxpoymasl4gt7wsbsw3nr4y",
    "template":"bafkreibtt7ciqypa3vogodmdmvyd3trwajv3l7cqi43yk4hrtgpyopn2e4",       
    "account":[     //select the account by day%account.length
        ["5D5LpGNEzW9nh3sQvz4d5FUQYuCXUhQMWTqHFZ8DMHRWzio8","123456"],
        ["5D89fyaog8qoY381YHgAPitsMoMBzvZwqcSpCG7JhehzmAa5","123456"],
        ["5FeBqbCmcQez9ZgBa1Sd6jDS4gAJg5v2KecBGF1dTNZHiJZD","123456"],
        ["5HNMtQjBnhAkEMZXxSqtw2v6RUuQfWXimpu3W84QY5f2LzbL","123456"],
        ["5CVbGZUQUChbH1NCTt392uJheYuvjeujzmUrqfA7ykvremry","123456"],
        ["5DcxUMX4kUy94cXtt9ASPaztYA1iDyqmioNTLxvamxEZssch","123456"],
        ["5DhSQwEKYr5rwcEHagj4APs8VZWbz96ppkWoacGQKDfpsfQh","123456"],
        ["5Dkd9akdmkGz3kiDDgdD5aQ9s4bq3wLBZi7WSB16397UHfk2","123456"],
        ["5DoLc2nFaRKi9etuwU4wzztJRP9zeEEK9oAtzA3zfjriSqr5","123456"],
        ["5DvhF8us1Zwkeu9F5e4Dk625BpGGPoTGLH9xAYU5nYDvzFkJ","123456"],
        ["5EJPx31e4UDw7Sk5kXj87VswEvxrdqZGZNZUicxXsCqn1RtZ","123456"],
        ["5FbMcSTBMie1L6qo12ChrLmoUaq9N5YrsMTbkUe1TwcDiMVP","123456"],
        ["5FsemaDhGeRB33TcqePS6ym6ZgQrZmYpL5WXBqv6n32Y92He","123456"],
        ["5GerM9GDsmazgHg8zq9GHH9qeEeC7vJnPEJv4BseHATts3L8","123456"],
        ["5GnWZEWmWTjcP2Qb6jCA6eQJPfm2Mqnk2tMhzmG8LuxFb84J","123456"],
        ["5GsDosJPHvALmzzwN7V3N5UURVAEJPdMfu4rahjW8bRcMLCS","123456"],
        ["5GWNLJ7WSpSwgiLqthdVDde8aWY5x2tdJmW9XPwvyCoBYjEa","123456"],
        ["5HMy4ULuRS15DveBH1Nbe6F45jinXQyVup9kpj6jYXnte7KH","123456"],
        ["5HptTZcjGoQkGqybXqspUynvtQU1brvieRZHMSkvU2PQuyPa","123456"],
    ],
    "low":3000,             //low balance
    "interval":12000,
    "autosave":5,           //how many rounds to save setting
    "prefix":"im_",
    "folder":"log",
    "basic":"anchor_setting.json",
    "version":"1.0.0",
    "gateway":".ipfs.w3s.link",
};