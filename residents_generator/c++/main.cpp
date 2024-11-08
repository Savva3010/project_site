#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <set>
#include <map>
#include <fstream>
#include <sstream>
#include <random>

using namespace std;

vector<string> full_names;
vector<string> mobiles;
vector<string> emails;
vector<string> telegrams;
vector<string> statuses = {
    "inside",
    "isolator",
    "outside",
    "school"
};
vector<int> ages = {
    14,
    15,
    16,
    17,
    18
};
vector<int> latenesses;
vector<string> times;
vector<string> dates;
vector<string> places;
vector<int> class_numbers = {
    8,
    9,
    10,
    11
};
vector<string> class_letters;
vector<int> parents = {
    2,
    2,
    2,
    2,
    2,
    2,
    1,
    1,
    0,
    0
};
vector<string> rooms = {
    "201",
    "203",
    "205/1",
    "205/2",
    "207/1",
    "207/2",
    "209/1",
    "209/2",
    "211/1",
    "211/2"
};

void ReadFullNames() {
    ifstream file = ifstream("full_names.txt");
    string curr;
    while (getline(file, curr)) {
        full_names.push_back(curr);
    }
    file.close();
}
void ReadMobiles() {
    ifstream file = ifstream("mobiles.txt");
    string curr;
    while (getline(file, curr)) {
        mobiles.push_back(curr);
    }
    file.close();
}
void ReadEmails() {
    ifstream file = ifstream("emails.txt");
    string curr;
    while (getline(file, curr)) {
        emails.push_back(curr);
    }
    file.close();
}
void ReadTelegrams() {
    ifstream file = ifstream("telegrams.txt");
    string curr;
    while (getline(file, curr)) {
        telegrams.push_back(curr);
    }
    file.close();
}
void ReadLatenesses() {
    ifstream file = ifstream("latenesses.txt");
    string curr;
    while (getline(file, curr)) {
        latenesses.push_back(stoi(curr));
    }
    file.close();
}
void ReadTimes() {
    ifstream file = ifstream("times.txt");
    string curr;
    while (getline(file, curr)) {
        times.push_back(curr);
    }
}
void ReadDates() {
    ifstream file = ifstream("dates.txt");
    string curr;
    while (getline(file, curr)) {
        dates.push_back(curr);
    }
    file.close();
}
void ReadPlaces() {
    ifstream file = ifstream("places.txt");
    string curr;
    while (getline(file, curr)) {
        places.push_back(curr);
    }
    file.close();
}
void ReadClassLetters() {
    ifstream file = ifstream("class_letters.txt");
    string curr;
    while (getline(file, curr)) {
        class_letters.push_back(curr);
    }
    file.close();
}

void Read() {
    ReadFullNames();
    ReadMobiles();
    ReadEmails();
    ReadTelegrams();
    ReadLatenesses();
    ReadTimes();
    ReadDates();
    ReadPlaces();
    ReadClassLetters();
}

struct ResidentStatus {
    string status;
    string until;
    string place;
    int lateness;
};

struct ResidentParent {
    string full_name;
    string mobile;
    string email;
    string telegram;
};

struct Resident {
    int id;
    string full_name;
    int age;
    string room;
    string class_;
    string class_teacher;
    string class_mentor;
    string mobile;
    string email;
    string telegram;
    ResidentStatus status;
    vector<ResidentParent> parents;
};

random_device dev;
mt19937 rng(dev());

Resident Generate(int id) {
    static uniform_int_distribution<std::mt19937::result_type> dist_full_name(0, full_names.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_mobile(0, mobiles.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_email(0, emails.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_telegram(0, telegrams.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_status(0, statuses.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_age(0, ages.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_lateness(0, latenesses.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_time(0, times.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_date(0, dates.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_place(0, places.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_class_number(0, class_numbers.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_class_letter(0, class_letters.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_parent(0, parents.size() - 1);
    static uniform_int_distribution<std::mt19937::result_type> dist_room(0, rooms.size() - 1);

    Resident resident;
    resident.id = id;
    resident.full_name = full_names[dist_full_name(rng)];
    resident.age = ages[dist_age(rng)];
    resident.room = rooms[dist_room(rng)];
    resident.class_ = to_string(class_numbers[dist_class_number(rng)]) + class_letters[dist_class_letter(rng)];
    resident.class_teacher = full_names[dist_full_name(rng)];
    resident.class_mentor = full_names[dist_full_name(rng)];
    resident.mobile = mobiles[dist_mobile(rng)];
    resident.email = emails[dist_email(rng)];
    resident.telegram = telegrams[dist_telegram(rng)];

    resident.status.status = statuses[dist_status(rng)];
    if (resident.status.status == "outside" || resident.status.status == "school") {
        resident.status.lateness = latenesses[dist_lateness(rng)];
        resident.status.until = dates[dist_date(rng)] + " " + times[dist_time(rng)];
    }
    if (resident.status.status == "outside") {
        resident.status.place = places[dist_place(rng)];
    }

    resident.parents.resize(parents[dist_parent(rng)]);
    for (auto& parent : resident.parents) {
        parent.full_name = full_names[dist_full_name(rng)];
        parent.mobile = mobiles[dist_mobile(rng)];
        parent.email = emails[dist_email(rng)];
        parent.telegram = telegrams[dist_telegram(rng)];
    }

    return resident;
}

ofstream out("residents.txt");

void OutputResident(Resident resident, bool isLast) {
    out << "\t" << "{" << "\n";

    out << "\t\t" << '"' << "id" << '"' << ": " << resident.id << "," << "\n";
    out << "\t\t" << '"' << "profile_image" << '"' << ": {" << "\n";
    out << "\t\t\t" << '"' << "src" << '"' << ": " << '"' << "/no_img.png" << '"' << "," << "\n";
    out << "\t\t\t" << '"' << "blur_hash" << '"' << ": " << '"' << "|RRMb$of_3ay-;j[WBt7M{xuayRjofj[ayoffQay~qWBIUofIUj[j[Rjt7IUof%MRjayofRjayj[%Mj[M{WBj[j[ofoft7-;WBM{t7j[Rjt7j[ay9Fay%Moft7WBWBj[RjWBofofRjj[t7WBayj[ofj[ayWBj[ofWBWBj[" << '"' << "\n";
    out << "\t\t" << "}," << "\n";

    out << "\t\t" << '"' << "full_name" << '"' << ": " << '"' << resident.full_name << '"' << "," << "\n";
    out << "\t\t" << '"' << "age" << '"' << ": " << resident.age << "," << "\n";
    out << "\t\t" << '"' << "room" << '"' << ": " << '"' << resident.room << '"' << "," << "\n";
    out << "\t\t" << '"' << "class" << '"' << ": " << '"' << resident.class_ << '"' << "," << "\n";
    out << "\t\t" << '"' << "class_teacher" << '"' << ": " << '"' << resident.class_teacher << '"' << "," << "\n";
    out << "\t\t" << '"' << "class_mentor" << '"' << ": " << '"' << resident.class_mentor << '"' << "," << "\n";
    out << "\t\t" << '"' << "mobile" << '"' << ": " << '"' << resident.mobile << '"' << "," << "\n";
    out << "\t\t" << '"' << "email" << '"' << ": " << '"' << resident.email << '"' << "," << "\n";
    out << "\t\t" << '"' << "telegram" << '"' << ": " << '"' << resident.telegram << '"' << "," << "\n";

    ResidentStatus& status = resident.status;

    out << "\t\t" << '"' << "status" << '"' << ": {" << "\n";
    out << "\t\t\t" << '"' << "status" << '"' << ": " << '"' << status.status << '"' << (status.status == "outside" || status.status == "school" ? "," : "") << "\n";
    if (status.status == "outside" || status.status == "school") {
        out << "\t\t\t" << '"' << "until" << '"' << ": " << '"' << status.until << '"' << "," << "\n";
        out << "\t\t\t" << '"' << "lateness" << '"' << ": " << status.lateness << (status.status == "outside" ? "," : "") << "\n";
    }
    if (status.status == "outside") {
        out << "\t\t\t" << '"' << "place" << '"' << ": " << '"' << status.place << '"' << "\n";
    }
    out << "\t\t" << "}," << "\n";

    out << "\t\t" << '"' << "parents" << '"' << ": [" << "\n";
    for (int i = 0; i < resident.parents.size(); ++i) {
        ResidentParent& parent = resident.parents[i];

        out << "\t\t\t" << "{" << "\n";

        out << "\t\t\t\t" << '"' << "full_name" << '"' << ": " << '"' << parent.full_name << '"' << "," << "\n";
        out << "\t\t\t\t" << '"' << "mobile" << '"' << ": " << '"' << parent.mobile << '"' << "," << "\n";
        out << "\t\t\t\t" << '"' << "email" << '"' << ": " << '"' << parent.email << '"' << "," << "\n";
        out << "\t\t\t\t" << '"' << "telegram" << '"' << ": " << '"' << parent.telegram << '"' << "\n";

        out << "\t\t\t" << "}" << (i < resident.parents.size() - 1 ? "," : "") << "\n";
    }
    out << "\t\t" << "]" << "\n";

    out << "\t" << "}" << (!isLast ? "," : "") << "\n";
}

int main() {
    setlocale(LC_ALL, "Russian");

    Read();

    int need;
    cout << "Введите кол-во проживающих: ";
    cin >> need;

    out << "[\n";
    for (int i = 1; i <= need; ++i) {
        Resident resident = Generate(i);
        OutputResident(resident, i == need);
    }
    out << "]\n";
    out.close();
}
