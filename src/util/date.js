export const date = (d, b = '/', isTime = true) => {
    var date = new Date(d)
    var Y = date.getFullYear() + b
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + b
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())

    if (isTime) {
        return Y + M + D + h + m
    } else {
        return Y + M + D
    }
}