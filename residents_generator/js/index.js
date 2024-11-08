const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const fs = require('fs');
const randoms = require("./randoms.json")

let data = []

function Generate(id) {
    let push = {
        "id": id,
        "profile_image": {
            "src": "/no_img.png",
            "blur_hash": "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj["
        },
        "full_name": randoms.full_names[Math.floor(Math.random() * randoms.full_names.length)],
        "age": randoms.ages[Math.floor(Math.random() * randoms.ages.length)],
        "room": randoms.rooms[Math.floor(Math.random() * randoms.rooms.length)],
        "class": parseInt(randoms.class_numbers[Math.floor(Math.random() * randoms.class_numbers.length)]) + randoms.class_letters[Math.floor(Math.random() * randoms.class_letters.length)],
        "class_teacher": randoms.full_names[Math.floor(Math.random() * randoms.full_names.length)],
        "class_mentor": randoms.full_names[Math.floor(Math.random() * randoms.full_names.length)],
        "mobile": randoms.mobiles[Math.floor(Math.random() * randoms.mobiles.length)],
        "email": randoms.emails[Math.floor(Math.random() * randoms.emails.length)],
        "telegram": randoms.telegrams[Math.floor(Math.random() * randoms.telegrams.length)],
        "status": {
            "status": randoms.statuses[Math.floor(Math.random() * (randoms.statuses.length))]
        },
        "parents": []
    }

    if (push.status.status == "school" || push.status.status == "outside") {
        push.status.lateness = randoms.latenesses[Math.floor(Math.random() * randoms.latenesses.length)]
        push.status.until = randoms.dates[Math.floor(Math.random() * randoms.dates.length)] + " " + randoms.times[Math.floor(Math.random() * randoms.times.length)]
    }
    if (push.status.status == "outside") {
        push.status.place = randoms.places[Math.floor(Math.random() * randoms.places.length)]
    }

    let parents = randoms.parents[Math.floor(Math.random() * randoms.parents.length)]
    for (let i = 0; i < parents; ++i) {
        let parent = {
            "full_name": randoms.full_names[Math.floor(Math.random() * randoms.full_names.length)],
            "mobile": randoms.mobiles[Math.floor(Math.random() * randoms.mobiles.length)],
            "email": randoms.emails[Math.floor(Math.random() * randoms.emails.length)],
            "telegram": randoms.telegrams[Math.floor(Math.random() * randoms.telegrams.length)]
        }
        push.parents.push(parent)
    }

    data.push(push)
}

const rl = readline.createInterface({ input, output });

rl.question("Введите кол-во проживающих: ", (need) => {

    for (let id = 1; id <= need; ++id) {
        Generate(id)
    }

    fs.writeFileSync("output/residents.json", JSON.stringify(data), (err) => {
        if (err) {
            console.log(err)
        }
    });

    console.log(`Сгенерировано ${need} проживающих в output/residents.json`);

     rl.close();
});