export const location = {
    "INSIDE": Symbol(),
    "ISOLATOR": Symbol(),
    "OUTSIDE": Symbol(),
    "SCHOOL": Symbol(),

    "getInfo": (val) => {
        switch (val) {
            case "INSIDE":
            case "inside":
            case location.INSIDE:
                return ["Сейчас в интернате", "inside"]
            case "ISOLATOR":
            case "isolator":
            case location.ISOLATOR:
                return ["Сейчас в изоляторе", "isolator"]
            case "OUTSIDE":
            case "outside":
            case location.OUTSIDE:
                return ["Сейчас не в интернате", "outside"]
            case "SCHOOL":
            case "school":
            case location.SCHOOL:
                return ["Сейчас в ФТЛ", "school"]
            default:
                return ["Нет информации ¯\\_(ツ)_/¯", ""]
        }
    },
    "toEnum": (val) => {
        switch (val) {
            case "inside":
                return location.INSIDE
            case "isolator":
                return location.ISOLATOR
            case "outside":
                return location.OUTSIDE
            case "school":
                return location.SCHOOL
            default:
                return null
        }
    }
}