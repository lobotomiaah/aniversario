let = require('mysql');
let con = mysql.createConnection({
   host:'',
   user:'',
   password:'',
   database:''
});
con.connect(function(err){
    if (err) throw err;
    console.log('conectado')
}
const express = require('express')
const app = express()
const port = 3000

app.post('/confirmar', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
