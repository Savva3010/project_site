import 'dotenv/config'
import express from 'express'
import methodOverride from 'method-override'
import bodyParser from 'body-parser'
import morgan from 'morgan'

//heplers start
import { errorMsg, successMsg } from './helpers/msg.js'
//helpers end

const app = express();

app.listen(process.env.PORT, "localhost", (error) => {
    error? console.log(errorMsg(error)) : console.log(successMsg(`listening port ${process.env.PORT}`))})

//middlewares start
app.use(morgan(":method :url (:status) :res[content-length] - :response-time ms"))
//app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(methodOverride("_method"))
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', ['http://localhost:3000'])
    next()
})
//middlewares end

app.get('/residents', (req, res) => {
    res
    .status(200)
    .json({
        success: true,
        data: [
            {
                id: 1,
                full_name: "AAAAAAAAA AAA AAAAAA",
                mobile: "+7 111 111 11 11",
                email: "111111@111.111",
                telegram: "@111111",
                status: {
                    status: "inside"
                }
            },
            {
                id: 1,
                full_name: "BBBBBBBBB BBB BBBBBB",
                mobile: "+7 222 222 22 22",
                email: "222222@222.222",
                telegram: "@222222",
                status: {
                    status: "isolator"
                }
            },
            {
                id: 1,
                full_name: "CCCCCCCCC CCC CCCCCC",
                mobile: "+7 333 333 33 33",
                email: "333333@333.333",
                telegram: "@333333",
                status: {
                    status: "outside"
                }
            },
            {
                id: 1,
                full_name: "DDDDDDDDD DDD DDDDDD",
                mobile: "+7 444 444 44 44",
                email: "444444@444.444",
                telegram: "@444444",
                status: {
                    status: "school"
                }
            },
        ]
    })
})

app.use((req, res) => {
    res
    .status(404)
    .json({
        success: false,
        data: {
            message: "Абубубубубубуб не найдено",
            error_id: -10293011203
        }
    })
})