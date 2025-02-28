const mysql=require("mysql2")
const { createConnection } = require("net")


const connection=createConnection({
    host:"localhost",
    user:"root",
    password:"Sagar#9550",
    database:"23_r"
})
connection.connect((err)=>{
    console.log("connect databse")
})


module.exports=connection