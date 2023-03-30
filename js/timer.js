// source: https://www.geeksforgeeks.org/how-to-create-stopwatch-using-html-css-and-javascript/

let running = false
timer()

let t100 = 0
let t10 = 0
let t1 = 0

function timer() {
    if (running) {
        t1++
        if (t1 == 10) {
            t1 = 0
            t10++
            if (t10 == 10) {
                t10 = 0
                t100++
                if (t100 == 10) {
                    t100 = 0
                }
            }
        }

        let path = "img/digits/digit"
        let ext = ".png"

        document.getElementById("timer100").src = path + t100 + ext
        document.getElementById("timer10").src = path + t10 + ext
        document.getElementById("timer1").src = path + t1 + ext
    }
    setTimeout(timer, 1000)
}

function startTimer() {
    running = true
}

function stopTimer() {
    running = false
}

function resetTimer() {
    stopTimer()
    let path = "img/digits/digit0.png"

    t100 = 0
    t10 = 0
    t1 = 0

    document.getElementById("timer100").src = path
    document.getElementById("timer10").src = path
    document.getElementById("timer1").src = path
}