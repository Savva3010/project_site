export default function unixToString(date) {
    if (typeof date === "number") {
        date = new Date(date)
    }
    return `${date.getDate() < 10 && "0" || ""}${date.getDate()}.${date.getMonth() < 9 && "0" || ""}${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours() < 10 && "0" || ""}${date.getHours()}:${date.getMinutes() < 10 && "0" || ""}${date.getMinutes()}`
}
