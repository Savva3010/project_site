import 'dotenv/config'
import express from 'express'
import methodOverride from 'method-override'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import http from 'http'

import WebSocket, { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'

import residents from "./data/residents.json" assert {type: "json"}
import journals_cleaing from "./data/journals_cleaning.json" assert {type: "json"}
import applications_leave from "./data/applications_leave.json" assert {type: "json"}
import rooms from "./data/rooms.json" assert {type: "json"}

//heplers start
import { errorMsg, successMsg } from './helpers/msg.js'
//helpers end

const app = express();

const httpServer = http.createServer(app)

const wsServerJournalsCleaning = new WebSocketServer({ noServer: true })
const wsServerRedients = new WebSocketServer({ noServer: true })

httpServer.listen(process.env.PORT, "127.0.0.1", (error) => {
    error? console.log(errorMsg(error)) : console.log(successMsg(`listening port ${process.env.PORT}`))
})

//middlewares start
app.use(morgan(":method :url (:status) :res[content-length] - :response-time ms"))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(methodOverride("_method"))
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', ['http://localhost:3000'])
    res.set("Access-Control-Allow-Methods", "*")
    res.set("Access-Control-Allow-Headers", "Content-Type")
    next()
})
//middlewares end

app.options("/*", (req, res) => {
    res
    .status(200)
    .send()
})






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

    let resident = residents.find(resident => resident.id === id)

    if(!resident) {
        res
        .status(400)
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
        "id": id,
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
        "status": resident.status,
        "parents": []
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

/*
    error ids:
    -1 - csrf token expired
    -2 - not enough data
    -3 - resident is not found
    -4 - no such status

    THIS IS TEMP REQUEST TO CHECK WEBSOCKETS WORK
*/
app.put("/residents/:id/status", (req, res) => {
    let { id } = req.params
    id = Number(id)

    let {status} = req.body

    if (!status || !status.status) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Не хватает данных",
                "error_id": -2
            }
        })
        return
    }

    let resident = residents.findIndex(resident => resident.id === id)

    if (resident === -1) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Проживающий не найден",
                "error_id": -3
            }
        })
        return
    }

    switch (status.status) {
        case "inside":
            residents[resident].status = {
                "status": "inside"
            }
            break
        case "isolator":
            residents[resident].status = {
                "status": "isolator"
            }
            break
        case "outside":
            if (!status.place || !status.until) {
                res
                .status(400)
                .json({
                    "success": false,
                    "data": {
                        "message": "Не хватает данных",
                        "error_id": -2
                    }
                })
                return
            }
            residents[resident].status = {
                "status": "outside",
                "until": status.until,
                "place": status.place,
                "lateness": 0
            }
            break
        case "school":
            if (!status.until) {
                res
                .status(400)
                .json({
                    "success": false,
                    "data": {
                        "message": "Не хватает данных",
                        "error_id": -2
                    }
                })
                return
            }
            residents[resident].status = {
                "status": "school",
                "until": status.until,
                "lateness": 0
            }
            break
        default:
            res
            .status(400)
            .json({
                "success": false,
                "data": {
                    "message": "Не существует статус",
                    "error_id": -4
                }
            })
            return
    }

    wsServerRedients.clients.forEach(client => {
        if (client.readyState != WebSocket.OPEN) return
        client.send(JSON.stringify({
            "op": "status:update",
            "data": {
                "id": id,
                "status": residents[resident].status
            }
        }))
    })

    res
    .status(200)
    .json({
        "success": true,
        "data": null
    })
})






app.get("/rooms", (req, res) => {
    res
    .status(200)
    .json({
        "success": true,
        "data": rooms
    })
})

/*
    error ids:
    -1 - csrf token expired
    -2 - not enough data
    -3 - room is not found
*/
app.get("/rooms/:id/:subid", (req, res) => {
    let { id, subid } = req.params
    let roomid = id
    if (subid != "0") roomid += `/${subid}`

    let room = rooms.find(room => room.room_number === roomid)

    if (!room) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Комната не найдена",
                "error_id": -3
            }
        })
        return
    }

    let data = {
        "room_number": roomid,
        "residents": []
    }
    room.residents.forEach(resident => {
        let found = residents.find(curr => curr.id === resident.id)
        if (!found) return
        data.residents.push({
            "id": found.id,
            "profile_image": found.profile_image,
            "full_name": found.full_name,
            "age": found.age,
            "room": found.room,
            "class": found.class,
            "class_mentor": found.class_mentor,
            "status": found.status
        })
    })

    res
    .status(200)
    .json({
        "success": true,
        "data": data
    })
})

app.get("/rooms/:id", (req, res) => {
    let { id } = req.params
    res.redirect(`/rooms/${id}/0`)
})





app.get("/applications/leave", (req, res) => {
    let data = []
    applications_leave.forEach(application => {
        let resident = residents.find(resident => resident.id === application.resident_id)
        let push = {
            "id": application.id,
            "resident_id": application.resident_id,
            "full_name": resident.full_name,
            "class": resident.class,
            "room": resident.room,
            "leave": application.leave,
            "return": application.return,
            "address": application.address,
            "accompany": application.accompany,
            "status": application.status
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

/*
    error ids:
    -1 - csrf token expired
    -2 - not enough data
    -3 - application is not found
*/
app.get("/applications/leave/:id", (req, res) => {
    let { id } = req.params
    id = Number(id)

    let application = applications_leave.find(application => application.id === id)

    if (!application) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Заявление не найдено",
                "error_id": -3
            }
        })
        return
    }

    let resident = residents.find(resident => resident.id === application.resident_id)

    let data = {
        "id": application.id,
        "resident": {
            "id": resident.id,
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
            "status": resident.status,
            "parents": []

        },
        "leave": application.leave,
        "return": application.return,
        "address": application.address,
        "accompany": application.accompany,
        "status": application.status,
        "comment": application.comment,
        "created_at": application.created_at
    }

    resident["parents"].forEach(parent => {
        let push = {
            "full_name": parent.full_name,
            "mobile": parent.mobile,
            "email": parent.email,
            "telegram": parent.telegram
        }

        data["resident"]["parents"].push(push)
    })

    res
    .status(200)
    .json({
        "success": true,
        "data": data
    })
})

/*
    error ids:
    -1 - csrf token expired
    -2 - not enough data
    -3 - application is not found
*/
app.put("/applications/leave/:id/comment", (req, res) => {   
    let { id } = req.params
    id = Number(id)
    let {content} = req.body
    
    let application = applications_leave.findIndex(application => application.id === id)

    if (application === -1) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Заявление не найдено",
                "error_id": -3
            }
        })
        return
    }

    if (content === null) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Не хватает данных",
                "error_id": -2
            }
        })
        return
    }

    applications_leave[application].comment = content

    res
    .status(200)
    .json({
        "success": true,
        "data": null
    })
})

app.put("/applications/leave/:id/status", (req, res) => {
    res
    .status(500)
    .json({
        "success": false,
        "data": {
            "message": "В работе",
            "error_id": -10010
        }
    })
    return
})




app.get('/journals/cleaning', (req, res) => {res
    let data = journals_cleaing
    
    res
    .status(200)
    .json({
        "success": true,
        "data": data
    })
})

/*
    error ids:
    -1 - csrf token expired
    -2 - not enough data
    -3 - room is not found
    -4 - date is not found
*/
app.put("/journals/cleaning/marks", (req, res) => {
    let {date, room, mark} = req.body

    if (!date || !room || mark != 0 && !mark) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Не хватает данных",
                "error_id": -2
            }
        })
        return
    }

    let found_room = journals_cleaing.rooms.findIndex(find_room => find_room.room_number === room)
    if (found_room === -1) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Комната не найдена",
                "error_id": -3
            }
        })
        return
    }
    if (!journals_cleaing.dates.find(find_date => find_date === date)) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Дата не найдена",
                "error_id": -4
            }
        })
        return
    }
    let found_date = journals_cleaing.rooms[found_room].marks.findIndex(find_date => find_date.date === date)
    if (mark === 0) {
        if (found_date != -1) {
            journals_cleaing.rooms[found_room].marks.splice(found_date, 1)
        }
    } else {
        if (found_date != -1) {
            journals_cleaing.rooms[found_room].marks[found_date].mark = mark
        } else {
            journals_cleaing.rooms[found_room].marks.push({"date": date, "mark": mark})
        }
    }
    
    wsServerJournalsCleaning.clients.forEach(client => {
        if (client.readyState != WebSocket.OPEN) return
        client.send(JSON.stringify({
            "op": "mark:update",
            "data": {
                "room": room,
                "date": date,
                "mark": mark
            }
        }))
    })

    res
    .status(200)
    .json({
        "success": true,
        "data": null
    })
})

/*
    error ids:
    -1 - csrf token expired
    -2 - not enough data
    -3 - date is alerady created
*/
app.post("/journals/cleaning/dates", (req, res) => {
    let {month, day} = req.body

    if (!month || !day) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Не хватает данных",
                "error_id": -2
            }
        })
        return
    }

    const parseMonth = [
        "",
        "ЯНВ",
        "ФЕВ",
        "МАР",
        "АПР",
        "МАЯ",
        "ИЮН",
        "ИЮЛ",
        "АВГ",
        "СЕН",
        "ОКТ",
        "НОЯ",
        "ДЕК"
    ]

    const monthToIdxSorted = {
        "ЯНВ": 5,
        "ФЕВ": 6,
        "МАР": 7,
        "АПР": 8,
        "МАЯ": 9,
        "ИЮН": 10,
        "ИЮЛ": 11,
        "АВГ": 12,
        "СЕН": 1,
        "ОКТ": 2,
        "НОЯ": 3,
        "ДЕК": 4
    }

    let need_date = `${day} ${parseMonth[month]}`

    let found_date = journals_cleaing.dates.findIndex(date => date === need_date)
    if (found_date != -1) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Дата уже существует",
                "error_id": -3
            }
        })
        return
    }

    journals_cleaing.dates.push(need_date)
    journals_cleaing.dates.sort((a, b) => {
        let [l_d, l_m] = a.split(" ")
        let [r_d, r_m] = b.split(" ")
        l_d = parseInt(l_d)
        l_m = monthToIdxSorted[l_m]
        r_d = parseInt(r_d)
        r_m = monthToIdxSorted[r_m]

        if (l_m > r_m) return 1
        if (l_m < r_m) return -1
        if (l_d > r_d) return 1
        if (l_d < r_d) return -1
        return 0;
    })
    
    wsServerJournalsCleaning.clients.forEach(client => {
        if (client.readyState != WebSocket.OPEN) return
        client.send(JSON.stringify({
            "op": "date:add",
            "data": {
                "date": need_date
            }
        }))
    })
    
    res
    .status(200)
    .json({
        "success": true,
        "data": null
    })
})

/*
    error ids:
    -1 - csrf token expired
    -2 - not enough data
    -3 - date does not exist
*/
app.delete("/journals/cleaning/dates", (req, res) => {
    let {date} = req.body

    if (!date) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Не хватает данных",
                "error_id": -2
            }
        })
        return
    }

    let found_date = journals_cleaing.dates.findIndex(find_date => find_date === date)
    if (found_date === -1) {
        res
        .status(400)
        .json({
            "success": false,
            "data": {
                "message": "Дата не найдена",
                "error_id": -3
            }
        })
        return
    }

    journals_cleaing.dates.splice(found_date, 1)
    journals_cleaing.rooms.forEach((room, idx) => {
        let found = journals_cleaing.rooms[idx].marks.findIndex(mark => mark.date === date)
        while (found != -1) {
            journals_cleaing.rooms[idx].marks.splice(found, 1)
            found = journals_cleaing.rooms[idx].marks.findIndex(mark => mark.date === date)
        }
    })

    wsServerJournalsCleaning.clients.forEach(client => {
        if (client.readyState != WebSocket.OPEN) return
        client.send(JSON.stringify({
            "op": "date:delete",
            "data": {
                "date": date
            }
        }))
    })
    
    res
    .status(200)
    .json({
        "success": true,
        "data": null
    })
})





app.use((req, res) => {
    res
    .status(404)
    .json({
        "success": false,
        "data": {
            "message": "Не найдено",
            "error_id": 1
        }
    })
})





wsServerJournalsCleaning.on("connection", ws => {
    ws.id = uuidv4()

    //TODO: make anti CSRF (check initiator is localhost:3000)

    let heartbeatCloseTimeout
    let heartbeatInterval = setInterval(() => {
        //ws.ping()
        ws.send(JSON.stringify({"op": "ping"}))
        heartbeatCloseTimeout = setTimeout(() => {
            ws.terminate()
        }, 5000)
    }, 10000)

    // DONT FORGET TO REMOVE LINE BELOW
    clearInterval(heartbeatInterval)

    ws.on("message", m => {
        if (!m) return
        m = JSON.parse(m)
        if (!m || !m.op) return
        switch (m.op) {
            case "ping":
                ws.send(JSON.stringify({"op": "pong"}))
                return
            case "pong":
                if (heartbeatCloseTimeout) {
                    clearTimeout(heartbeatCloseTimeout)
                }
                return
            default:
                return
        }
    })

    ws.on("error", err => {
        console.log(err)
    })

    ws.on("close", () => {
        clearInterval(heartbeatInterval)
    })

    ws.on("ping", () => {
        ws.pong("pong")
    })

    ws.on("pong", () => {
        if (heartbeatCloseTimeout) {
            clearTimeout(heartbeatCloseTimeout)
        }
    })
})

wsServerRedients.on("connection", ws => {
    ws.id = uuidv4()

    //TODO: make anti CSRF (check initiator is localhost:3000)

    let heartbeatCloseTimeout
    let heartbeatInterval = setInterval(() => {
        //ws.ping()
        ws.send(JSON.stringify({"op": "ping"}))
        heartbeatCloseTimeout = setTimeout(() => {
            ws.terminate()
        }, 5000)
    }, 10000)

    // DONT FORGET TO REMOVE LINE BELOW
    clearInterval(heartbeatInterval)

    ws.on("message", m => {
        if (!m) return
        m = JSON.parse(m)
        if (!m || !m.op) return
        switch (m.op) {
            case "ping":
                ws.send(JSON.stringify({"op": "pong"}))
                return
            case "pong":
                if (heartbeatCloseTimeout) {
                    clearTimeout(heartbeatCloseTimeout)
                }
                return
            default:
                return
        }
    })

    ws.on("error", err => {
        console.log(err)
    })

    ws.on("close", () => {
        clearInterval(heartbeatInterval)
    })

    ws.on("ping", () => {
        ws.pong("pong")
    })

    ws.on("pong", () => {
        if (heartbeatCloseTimeout) {
            clearTimeout(heartbeatCloseTimeout)
        }
    })
})

httpServer.on('upgrade', (request, socket, head) => {
    const headers = request.headers

    if (headers['upgrade'] != 'websocket') {
        socket.destroy()
        return
    }
    
    const { pathname } = new URL(request.url, 'ws://127.0.0.1')
  
    if (pathname === '/residents') {
        wsServerRedients.handleUpgrade(request, socket, head, ws => {
            wsServerRedients.emit('connection', ws, request)
        })
    } else if (pathname === '/journals/cleaning') {
        wsServerJournalsCleaning.handleUpgrade(request, socket, head, ws => {
            wsServerJournalsCleaning.emit('connection', ws, request)
        })
    } else {
        socket.destroy()
    }
})