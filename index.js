const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User')

const config = require('./config/key');

app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World! 쨔쓰5235235325')
})

app.post('/register', async (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 DB에 넣는다.
    const user = new User(req.body);

    try {
        const userInfo = await user.save();
        return res.status(200).json({
            success: true,
            userInfo
        });
    } catch (err) {
        return res.status(200).json({
            success: false,
            message: err
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})