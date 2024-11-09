import 'dotenv/config'
import express from 'express'
import methodOverride from 'method-override'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import residents from "./data/residents.json" assert {type: "json"}
import journals_cleaing from "./data/journals_cleaning.json" assert {type: "json"}

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
    let data = []
    residents.forEach(resident => {
        let push = {
            "id": resident.id,
            "full_name": resident.full_name,
            "room": resident.room,
            "class": resident.class,
            "mobile": resident.mobile,
            "email": resident.email,
            "telegram": resident.telegram,
            "status": {
                "status": resident.status.status
            }
        }
        data.push(push)
    })

    res
    .status(200)
    .json({
        "success": true,
        "data": data
    })
})

app.get("/residents/:id", (req, res) => {
    let { id } = req.params

    id = Number(id)

    let resident = residents.find(resident => resident.id == id)

    if(!resident) {
        res
        .status(404)
        .json({
            "success": false,
            "data": {
                "message": "Пользователь не найден",
                "error_id": -9999309
            }
        })
        return
    }

    let data = {
        "profile_image": {
            "src": resident.profile_image.src,
            "blur_hash": resident.profile_image.blur_hash
        },
        "full_name": resident.full_name,
        "age": resident.age,
        "room": resident.room,
        "class": resident.class,
        "class_teacher": resident.class_teacher,
        "class_mentor": resident.class_mentor,
        "mobile": resident.mobile,
        "email": resident.email,
        "telegram": resident.telegram,
        "status": {
            "status": resident.status.status
        },
        "parents": []
    }

    if (resident.status.status == "outside" ||
        resident.status.status == "school" ) {

        data["status"]["until"] = resident.status.until
        data["status"]["lateness"] = resident.status.lateness
    }

    if (resident.status.status == "outside") {
        data["status"]["place"] = resident.status.place
    }

    resident["parents"].forEach(parent => {
        let push = {
            "full_name": parent.full_name,
            "mobile": parent.mobile,
            "email": parent.email,
            "telegram": parent.telegram
        }

        data["parents"].push(push)
    })

    res
    .status(200)
    .json({
        "success": true,
        "data": data
    })

})

app.get('/journals/cleaning', (req, res) => {
    let data = journals_cleaing
    
    res
    .status(200)
    .json({
        "success": true,
        "data": data
    })
})

app.use((req, res) => {
    res
    .status(404)
    .json({
        "success": false,
        "data": {
            "message": "Бубубу не найдено",
            "error_id": -10293011203
        }
    })
})