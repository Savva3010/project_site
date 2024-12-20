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

export const application_leave_status = {
    "REVIEW": Symbol(),
    "DENIED": Symbol(),
    "CANCELLED": Symbol(),
    "ACCEPTED": Symbol(),
    "ACTIVE": Symbol(),
    "EXPIRED": Symbol(),

    "getInfo": (val) => {
        switch (val) {
            case "REVIEW":
            case "review":
            case location.REVIEW:
                return ["Рассматривается", "review"]
            case "DENIED":
            case "denied":
            case location.DENIED:
                return ["Отказано", "denied"]
            case "CANCELLED":
            case "cancelled":
            case location.CANCELLED:
                return ["Аннулировано", "cancelled"]
            case "ACCEPTED":
            case "accepted":
            case location.ACCEPTED:
                return ["Ещё не активно", "accepted"]
            case "ACTIVE":
            case "active":
            case location.ACTIVE:
                return ["Активно", "active"]
            case "EXPIRED":
            case "expired":
            case location.EXPIRED:
                return ["Истекло", "expired"]
            default:
                return ["Нет информации ¯\\_(ツ)_/¯", ""]
        }
    },
    "toEnum": (val) => {
        switch (val) {
            case "review":
                return location.REVIEW
            case "denied":
                return location.DENIED
            case "cancelled":
                return location.CANCELLED
            case "accepted":
                return location.ACCEPTED
            case "active":
                return location.ACTIVE
            case "expired":
                return location.EXPIRED
            default:
                return null
        }
    }
}