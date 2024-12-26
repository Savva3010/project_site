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

function GenerateApp(id, max_id) {
    let leaveDate = RandomDate(-60 * 24 * 3, 60 * 24 * 2).getTime()
    let returnDateStart = Math.floor((leaveDate - currDate) / 60 / 1000)

    let push = {
        "id": id,
        "resident_id": Random(1, max_id),
        "leave": leaveDate,
        "return": RandomDate(returnDateStart, returnDateStart + 60 * 24 * 6).getTime(),
        "address": randoms.places[Random(0, randoms.places.length - 1)],
        "accompany": randoms.accompany[Random(0, randoms.accompany.length - 1)],
        "status": randoms.statuses[Random(0, randoms.statuses.length - 1)],
        "comment": randoms.comments[Random(0, randoms.comments.length - 1)],
        "created_at": RandomDate(-60 * 24 * 5, -60 * 24 * 2).getTime(),
        "files": []
    }

    let files = Random(0, 4);
    for (let i = 0; i < files; ++i) {
        push["files"].push({
            "filename": randoms.file_names[Random(0, randoms.file_names.length - 1)],
            "src": "/no_img.png",
        	"blur_hash": "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj["
        })
    }

    apps.push(push)
}

const rl = readline.createInterface({ input, output });

rl.question(`Введите кол-во заявлений: `, (need) => {

    rl.question(`Введите кол-во проживающих: `, (max_id) => {
    
        for (let id = 0; id < need; ++id) {
            GenerateApp(id + 1, max_id)
        }
        
        fs.writeFileSync("output/applications_leave.json", JSON.stringify(apps), (err) => {
            if (err) {
                console.log(err)
            }
        });
    
        console.log(`Сгенерировано ${apps.length} заявлений в output/applications_leave.json`);
    
        rl.close();

    })
});