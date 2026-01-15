const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/User')


app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World!')
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

app.post( '/login', async (req, res) => {
    try {
        //DB 조회
        const user = await User.findOne( { email: req.body.email } );

        if(!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'User not found.'
                });
        }

        //비밀번호 체크
        const isMatch = await user.comparePassword(req.body.password);

        if(!isMatch) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Invalid Password'
                }
            )
        }

        const userInfo = await user.generateAuthToken();

        res.cookie('x_auth', userInfo.token, { httpOnly: true })

        return res.status(200).json({
            success: true
            , userId: userInfo._id
        });
    } catch (err) {
        return res.status(500).json(
            {
                success: false, err
            });
    }
} )

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})