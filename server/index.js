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
app.use(express.static("public"))
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
                room: "201",
                class: "9A",
                mobile: "+7 111 111 11 11",
                email: "111111@111.111",
                telegram: "@111111",
                status: {
                    status: "inside"
                }
            },
            {
                id: 2,
                full_name: "BBBBBBBBB BBB BBBBBB",
                room: "202",
                class: "9B",
                mobile: "+7 222 222 22 22",
                email: "222222@222.222",
                telegram: "@222222",
                status: {
                    status: "isolator"
                }
            },
            {
                id: 3,
                full_name: "CCCCCCCCC CCC CCCCCC",
                room: "211/1",
                class: "9C",
                mobile: "+7 333 333 33 33",
                email: "333333@333.333",
                telegram: "@333333",
                status: {
                    status: "outside"
                }
            },
            {
                id: 4,
                full_name: "DDDDDDDDD DDD DDDDDD",
                room: "211/2",
                class: "9D",
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

app.get("/residents/:id", (req, res) => {
    let { id } = req.params

    id = Number(id)

    let json = {}

    switch (id) {
        case 1:
            json = {
                "profile_image": {
                    "src": "/no_img.png",
                    "blur_hash" : "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj["
                },
                "full_name": "AAAAAAAAA AAA AAAAAA",
                "age": 15,
                "room": "201",
                "class": "9A",
                "class_teacher": "yes cuz ok 1",
                "class_mentor": "mentor cool 1",
                "mobile": "+7 111 111 11 11",
                "email": "111111@111.111",
                "telegram": "@111111",
                "status": {
                    "status": "inside"
                },
                "parents": [

                ]
            }
            break;

        case 2:
            json = {
                "profile_image": {
                    "src": "/no_img.png",
                    "blur_hash" : "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj["
                },
                "full_name": "BBBBBBBBB BBB BBBBBB",
                "age": 25,
                "room": "202",
                "class": "9B",
                "class_teacher": "yes cuz ok 2",
                "class_mentor": "mentor cool 2",
                "mobile": "+7 222 222 22 22",
                "email": "222222@222.222",
                "telegram": "@222222",
                "status": {
                    "status": "isolator"
                },
                "parents": [
                    {
                        "full_name": "PARENT OF 2_1",
                        "mobile": "+7 021 021 21 21",
                        "email": "parent_of_2@parent_1.com",
                        "telegram": "@2_parent_1"
                    }
                ]
            }
            break;

        case 3:
            json = {
                "profile_image": {
                    "src": "/no_img.png",
                    "blur_hash" : "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj["
                },
                "full_name": "CCCCCCCCC CCC CCCCCC",
                "age": 35,
                "room": "211/1",
                "class": "9C",
                "class_teacher": "yes cuz ok 3",
                "class_mentor": "mentor cool 3",
                "mobile": "+7 333 333 33 33",
                "email": "333333@333.333",
                "telegram": "@333333",
                "status": {
                    "status": "outside",
                    "place": "Ну где-т там да 3",
                    "until": "31.10.2024 17:45",
                    "lateness": 0
                },
                "parents": [
                    {
                        "full_name": "PARENT OF 3_1",
                        "mobile": "+7 031 031 31 31",
                        "email": "parent_of_3@parent_1.com",
                        "telegram": "@3_parent_1"
                    },
                    {
                        "full_name": "PARENT OF 3_2",
                        "mobile": "+7 032 032 32 32",
                        "email": "parent_of_3@parent_2.com",
                        "telegram": "@3_parent_2"
                    }
                ]
            }
            break;
    
        case 3:
            json = {
                "profile_image": {
                    "src": "/no_img.png",
                    "blur_hash" : "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj["
                },
                "full_name": "DDDDDDDDD DDD DDDDDD",
                "age": 35,
                "room": "211/2",
                "class": "9D",
                "class_teacher": "yes cuz ok 4",
                "class_mentor": "mentor cool 4",
                "mobile": "+7 444 444 44 44",
                "email": "444444@444.444",
                "telegram": "@444444",
                "status": {
                    "status": "school",
                    "until": "01.11.2024 19:52",
                    "lateness": 0
                },
                "parents": [
                    {
                        "full_name": "PARENT OF 4_1",
                        "mobile": "+7 041 041 41 41",
                        "email": "parent_of_4@parent_1.com",
                        "telegram": "@4_parent_1"
                    },
                    {
                        "full_name": "PARENT OF 4_2",
                        "mobile": "+7 042 042 42 42",
                        "email": "parent_of_4@parent_2.com",
                        "telegram": "@4_parent_2"
                    }
                ]
            }
            break;

        default:
            res
            .status(404)
            .json({
                success: false,
                data: {
                    message: "Пользователь не найден",
                    error_id: -9999309
                }
            })
            return
    }
    res
    .status(200)
    .json({
        success: true,
        data: json
    })
})

app.use((req, res) => {
    res
    .status(404)
    .json({
        success: false,
        data: {
            message: "Бубубу не найдено",
            error_id: -10293011203
        }
    })
})