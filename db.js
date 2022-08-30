
const mysql = require("mysql2");

// GRANT ALL ON mytestbase.* TO telegram__bot@'%' IDENTIFIED BY 'qwertyuiop1234567890'

const conn = mysql.createConnection({
    host: "asya11001.duckdns.org",
    user: "telegram_bot",
    database: "mytestbase",
    password: "qwertyuiop1234567890"
})

let asdasdas = "asdasdad"

conn.connect(err => {
    if (err){
        console.error(err);
        return err;
    }
    console.log('Database is OK')
})