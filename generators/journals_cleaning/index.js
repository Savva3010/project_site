let token = "Bearer "

fetch("http://localhost:3001/token", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": "admin",
        "password": "admin"
    }),
    mode: "cors"
})
.then(res => res.json())
.then(data => token += data.data.access_token)

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const fs = require('fs');
const randoms = require("./randoms.json")

let data = {
    "dates": [],
    "rooms": []
}

const rl = readline.createInterface({ input, output });

rl.question(`Введите кол-во дат(макс ${30 * randoms.months.length}): `, (need_dates) => {

    rl.question(`Введите кол-во комнат(макс ${randoms.rooms.length}): `, async (need_rooms) => {
    
        if (need_dates > 30 * randoms.months.length ||
            need_rooms > randoms.rooms.length) {

            console.log("No no no Mr.Fish")
            return
        }
    
        for (let date = 0; date < need_dates; ++date) {
            let day = date % 30 + 1
            let month = Math.floor(date / 30) + 1
            let push = day + " " + randoms.months[month - 1]
            await fetch("http://localhost:3001/journals/cleaning/dates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Authorization": token
                },
                body: JSON.stringify({
                    "day": day,
                    "month": (month + 8) % randoms.months.length
                }),
                mode: "cors"
            })
            data.dates.push(push)
        }

        for (let room = 0; room < need_rooms; ++room) {
            let push = {
                "room_number": randoms.rooms[room],
                "marks": []
            }

            for (let date = 0; date < need_dates; ++date) {
                if (!randoms.mark_chances[Math.floor(Math.random() * randoms.mark_chances.length)]) continue;

                let mark = randoms.marks[Math.floor(Math.random() * randoms.marks.length)]

                let day = date % 30 + 1
                let month = Math.floor(date / 30) + 1

                let add = {
                    "date": day + " " + randoms.months[month - 1],
                    "mark": mark
                }

                await fetch("http://localhost:3001/journals/cleaning/marks", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Key": "Authorization",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        "date": day + " " + randoms.months[month - 1],
                        "room": push.room_number,
                        "mark": mark
                    }),
                    mode: "cors"
                })
                push.marks.push(add)
            }

            data.rooms.push(push)
        }

        fs.writeFileSync("output/journals_cleaning.json", JSON.stringify(data), (err) => {
            if (err) {
                console.log(err)
            }
        });

        console.log(`Сгенерировано ${need_dates} дат и ${need_rooms} комнат в output/residents.json`);

        rl.close();
    })

});