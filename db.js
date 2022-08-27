
const mysql = require("mysql");

const conn = mysql.createConnection({
    host: "asya11001.duckdns.org",
    user: "telegram_bot",
    database: "mytestbase",
    password: "qwertyuiop1234567890"
})

conn.connect(err => {
    if (err){
        console.error(err);
        return err;
    }
    console.log('Database is OK')
})