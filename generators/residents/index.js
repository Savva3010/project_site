const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const fs = require('fs');
const randoms = require("./randoms.json")

let residents = []
let rooms = []

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

function GenerateResident(id) {
    let push = {
        "id": id,
        "profile_image": {
            "src": "/no_img.png",
            "blur_hash": "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj["
        },
        "full_name": randoms.full_names[Random(0, randoms.full_names.length - 1)],
        "age": randoms.ages[Random(0, randoms.ages.length - 1)],
        "room": null,
        "class": parseInt(randoms.class_numbers[Random(0, randoms.class_numbers.length - 1)]) + randoms.class_letters[Random(0, randoms.class_letters.length - 1)],
        "class_teacher": randoms.full_names[Random(0, randoms.full_names.length - 1)],
        "class_mentor": randoms.full_names[Random(0, randoms.full_names.length - 1)],
        "mobile": randoms.mobiles[Random(0, randoms.mobiles.length - 1)],
        "email": randoms.emails[Random(0, randoms.emails.length - 1)],
        "telegram": randoms.telegrams[Random(0, randoms.telegrams.length - 1)],
        "status": {
            "status": randoms.statuses[Random(0, randoms.statuses.length - 1)]
        },
        "parents": [],
        "notes": [],
        "warns": []
    }

    if (push.status.status === "school" || push.status.status === "outside") {
        push.status.until = RandomDate(-60 * 4, 60 * 8).getTime()
    }
    if (push.status.status === "outside") {
        push.status.place = randoms.places[Random(0, randoms.places.at.length - 1)]
    }

    let parents = randoms.parents[Random(0, randoms.parents.length - 1)]
    for (let i = 0; i < parents; ++i) {
        let parent = {
            "full_name": randoms.full_names[Random(0, randoms.full_names.length - 1)],
            "mobile": randoms.mobiles[Random(0, randoms.mobiles.length - 1)],
            "email": randoms.emails[Random(0, randoms.emails.length - 1)],
            "telegram": randoms.telegrams[Random(0, randoms.telegrams.length - 1)]
        }
        push.parents.push(parent)
    }

    let notes = Random(0, randoms.notes.length)
    for (let i = 0; i < notes; ++i) {
        push.notes.push(randoms.notes[Random(0, randoms.notes.length - 1)])
        push.notes[0].id = i + 1
    }

    let warns = Random(0, randoms.warns.length)
    for (let i = 0; i < warns; ++i) {
        push.warns.push(randoms.warns[Random(0, randoms.warns.length - 1)])
        push.warns[0].id = i + 1
    }

    residents.push(push)
}

let availabeRooms = []
randoms.rooms.forEach(room => {
    let residents_in_rooms = randoms.residents_in_room[Random(0, randoms.residents_in_room.length - 1)]
    for (let i = 0; i < residents_in_rooms; ++i) {
        availabeRooms.push(room)
    }
    rooms.push({
        "room_number": room,
        "is_living": true,
        "residents": []
    })
})

const rl = readline.createInterface({ input, output });

rl.question(`Введите кол-во проживающих(макс ${availabeRooms.length}): `, (need) => {

    if (need > availabeRooms.length) {
        console.log("No no no Mr.Fish")
        return
    }

    for (let id = 0; id < need; ++id) {
        GenerateResident(id + 1)
    }

    for (let i = 0; i < need; ++i) {
        residents[i].room = availabeRooms[i]
        rooms.find(room => room.room_number === availabeRooms[i]).residents.push({
            "id": i + 1,
            "full_name": residents[i].full_name,
            "class": residents[i].class
        })
    }

    fs.writeFileSync("output/residents.json", JSON.stringify(residents), (err) => {
        if (err) {
            console.log(err)
        }
    });
    
    fs.writeFileSync("output/rooms.json", JSON.stringify(rooms), (err) => {
        if (err) {
            console.log(err)
        }
    });

    console.log(`Сгенерировано ${need} проживающих в output/residents.json`);
    console.log(`Сгенерировано ${rooms.length} комнат в output/rooms.json`);

    rl.close();
});