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

    rl.question(`Введите кол-во комнат(макс ${randoms.rooms.length}): `, (need_rooms) => {
    
        if (need_dates > 30 * randoms.months.length ||
            need_rooms > randoms.rooms.length) {

            console.log("No no no Mr.Fish")
            return
        }
    
        for (let date = 0; date < need_dates; ++date) {
            let push = date % 30 + 1 + " " + randoms.months[Math.floor(date / 30)]
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

                let add = {
                    "date": date % 30 + 1 + " " + randoms.months[Math.floor(date / 30)],
                    "mark": mark
                }
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