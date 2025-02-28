const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const fs = require('fs');
const randoms = require("./randoms.json")

let apps = []

let currDate = Date.now()

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// dist_before and dist_after in minutes
function RandomDate(dist_before, dist_after) {
    let min = currDate + dist_before * 60 * 1000
    let max = currDate + dist_after * 60 * 1000
    return new Date(Random(min, max))
}

function GenerateApp(id, max_id, max_app_id) {
    let leaveDate = RandomDate(-60 * 24 * 3, 60 * 24 * 2).getTime()
    let returnDateStart = Math.floor((leaveDate - currDate) / 60 / 1000)

    let push = {
        "id": id,
        "resident_id": Random(1, max_id),
        "leave": leaveDate,
        "leave_marked": null,
        "return": RandomDate(returnDateStart, returnDateStart + 60 * 24 * 6).getTime(),
        "return_marked": null,
        "address": randoms.places[Random(0, randoms.places.length - 1)],
        "status": randoms.statuses[Random(0, randoms.statuses.length - 1)],
        "comment": randoms.comments[Random(0, randoms.comments.length - 1)],
        "type": randoms.types[Random(0, randoms.types.length - 1)],
        "application_id": null,
        "created_at": RandomDate(-60 * 24 * 5, -60 * 24 * 2).getTime()
    }

    if (push.status != "inside") {
        push.leave_marked = RandomDate(-20, 20).getTime()
    }

    if (push.status === "returned") {
        push.return_marked = RandomDate(-20, 20).getTime()
    }

    if (push.type === "application") {
        push.application_id = Random(1, max_app_id)
    }

    apps.push(push)
}

const rl = readline.createInterface({ input, output });

rl.question(`Введите кол-во записей: `, (need) => {

    rl.question(`Введите кол-во проживающих: `, (max_id) => {
    

        rl.question(`Введите кол-во заявлений: `, (max_app_id) => {

            for (let id = 0; id < need; ++id) {
                GenerateApp(id + 1, max_id, max_app_id)
            }
            
            fs.writeFileSync("output/journals_leave.json", JSON.stringify(apps), (err) => {
                if (err) {
                    console.log(err)
                }
            });
        
            console.log(`Сгенерировано ${apps.length} заявлений в output/journals_leave.json`);
        
            rl.close();

        })
    })
});