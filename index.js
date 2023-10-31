const express = require('express')
const bodyParser = require('body-parser') 
const cors = require('cors')
const { MongoClient } = require('mongodb');
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('dist'));
/* mongoDB연결 */
const url = 'mongodb+srv://skyg00700:X7OBmfyrxEoCBzP0@cluster0.ia7qlez.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url);
let collection; /* 전역변수로 설정해줘서 모든곳에서 사용할수있게  */
const dbConnect = async()=>{
    await client.connect();
    const db = client.db('portfolio');
    console.log('접속성공');
    collection = db.collection('count_collection');
}

app.get('/api',async function (req, res) {
    const result = await collection.find().toArray(); /*데이터 찾아오는 코드 find안에 {찾고자하는값} 을 사용하면 찾고 싶은것만 찾을 수 있음  */
    res.send(result)  
})
app.post('/api/insert',async function (req, res) {
    await collection.insertOne(req.body); /*데이터를 입력/저장하는 법  */
    const result = await collection.find().toArray();
    res.send(result)  
})
app.delete('/api/delete',async function (req, res) { /* app.delete('/api/delete?date=123135152' */
    const {date} = req.query
    await collection.deleteOne({date:Number(date)}); /* 삭제하고자 하는 데이터를 삭제 하는 법  */
    const result = await collection.find().toArray();
    res.send(result)  
})
app.put('/api/update',async function (req, res) { /* app.delete('/api/delete?date=123135152' */
    const {date} = req.query
    const {count} = req.body
    await collection.updateOne({date:Number(date)},{$set:{count}}); /* 데이터를 수정하는 하는 법  */
    const result = await collection.find().toArray();
    res.send(result)  
})

app.listen(3000,dbConnect) /* 디비접속한 후 get을 작동시키려면 포트번호 뒤에 콜백함수 작성해줘야 함 */