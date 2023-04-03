// source: https://www.geeksforgeeks.org/how-to-create-stopwatch-using-html-css-and-javascript/

let running = false
timer()

// t represents: hundreds, tens and ones
let t = [0, 0, 0]

function timer() {
    if (running) {
        t[2]++
        if (t[2] == 10) {
            t[2] = 0
            t[1]++
            if (t[1] == 10) {
                t[1] = 0
                t[0]++
                if (t[0] == 10) {
                    t[0] = 0
                }
            }
        }

        let path = "img/digits/digit"
        let ext = ".png"

        for (let i = 0; i < 3; i++) {
            document.getElementById("timer" + i).src = path + t[i] + ext
        }
    }
    setTimeout(timer, 1000)
}

function stopTimer() {
    running = false
}

function resetTimer() {
    stopTimer()
    let path = "img/digits/digit0.png"

    t = [0, 0, 0]

    for (let i = 0; i < 3; i++) {
        document.getElementById("timer" + i).src = path
    }
}