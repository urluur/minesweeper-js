let difficulty_presets = {
    easy: {
        rows: 9,
        cols: 9,
        mines: 10,
        name: "Easy",
        width: 220
    },
    intermediate: {
        rows: 16,
        cols: 16,
        mines: 40,
        name: "Intermediate",
        width: 375
    },
    expert: {
        rows: 16,
        cols: 30,
        mines: 99,
        name: "Expert",
        width: 684
    }
}

let difficulty = difficulty_presets.easy
let playing = true
let firstClick = true
let unlucky = false

/**
 * Sets difficulty of the game.
 * Presets: easy, intermediate, expert
 * @param {*} diff Must be one of presets (e.g. difficulty_presets.easy)
 */
function setDifficulty(diff) {
    switch (difficulty) {
        case difficulty_presets.intermediate:
            if (window.innerWidth < 375) {
                return
            }
            break
        case difficulty_presets.expert:
            if (window.innerWidth < 684) {
                return
            }
            break
    }
    difficulty = diff
    resetGame()
}

/**
 * Opens or closes the help window
 */
function toggleHelp() {
    document.getElementById("get_help").classList.toggle("hidden")
}

class Square {
    constructor() {
        this.isClicked = false
        this.isFlagged = false
        this.isMine = false
        this.isExplodedMine = false
        this.numNeighborMines = 0
    }
}

/**
 * Creates a grid of Squares at the start of the game
 */
function createGrid() {
    for (let i = 0; i < difficulty.rows; i++) {
        grid[i] = []
        for (let j = 0; j < difficulty.cols; j++) {
            grid[i][j] = new Square
        }
    }
}

/**
 * Places mines at random squares when the game starts
 */
function placeMines() {
    let placedMines = 0
    while (placedMines < difficulty.mines) {

        //source: https://www.w3schools.com/js/js_random.asp
        let x = Math.floor(Math.random() * difficulty.rows)
        let y = Math.floor(Math.random() * difficulty.cols)
        if (!grid[x][y].isMine) {
            grid[x][y].isMine = true
            placedMines++
        }
    }
}

/**
 * Counts how many neighbors of a square are mines
 */
function countNeighborMines() {
    for (let i = 0; i < difficulty.rows; i++) {
        for (let j = 0; j < difficulty.cols; j++) {
            if (!grid[i][j].isMine) {
                let neighbors = 0
                for (let i_offset = -1; i_offset < 2; i_offset++) {
                    for (let j_offset = -1; j_offset < 2; j_offset++) {
                        if (
                            i + i_offset >= 0 &&
                            i + i_offset < difficulty.rows &&
                            j + j_offset >= 0 &&
                            j + j_offset < difficulty.cols
                        ) {
                            if (grid[i + i_offset][j + j_offset].isMine) {
                                neighbors++
                            }
                        }
                    }
                }
                grid[i][j].numNeighborMines = neighbors
            }
        }
    }
}

/**
 * Reveals what's under a square
 * @param {int} x horizontal position of the square
 * @param {int} y vertical position of the square
 */
function clickSquare(x, y) {
    let square = grid[x][y]
    if (!square.isClicked && !square.isFlagged) {
        square.isFlagged = false
        square.isClicked = true
        if (square.numNeighborMines == 0) {
            for (let i_offset = -1; i_offset < 2; i_offset++) {
                for (let j_offset = -1; j_offset < 2; j_offset++) {
                    if (
                        x + i_offset >= 0 &&
                        x + i_offset < difficulty.rows &&
                        y + j_offset >= 0 &&
                        y + j_offset < difficulty.cols
                    ) {
                        if (!square.isFlagged && !square.isMine) {
                            clickSquare(x + i_offset, y + j_offset)
                        }
                    }
                }
            }
        }
    }
}

/**
 * Called when any square is clicked
 * @param {int} x horizontal position of the button
 * @param {int} y vertical position of the button
 */
function clickButton(x, y) {
    if (firstClick) {
        while (unlucky != grid[x][y].isMine) {
            createGrid()
            placeMines()
        }
        countNeighborMines()
        updateFlagCounter()
        displayGrid()
        firstClick = false
    }
    if (!grid[x][y].isFlagged) {
        running = true
        clickSquare(x, y)
        checkLose(x, y)
        checkWin()
        displayGrid()
    }
}

/**
 * Checks if clicked square is a mine and ends the game
 * @param {int} x horizontal position of the square
 * @param {int} y vertical position of the square
 */
function checkLose(x, y) {
    if (grid[x][y].isMine) {
        grid[x][y].isExplodedMine = true
        document.getElementById("smiley").src = "img/dead.png"
        // reveal all mines
        for (let i = 0; i < difficulty.rows; i++) {
            for (let j = 0; j < difficulty.cols; j++) {
                if (grid[i][j].isMine) {
                    grid[i][j].isFlagged = false
                    grid[i][j].isClicked = true
                }
            }
        }
        playing = false
        stopTimer()
    }
}

/**
 * Checks the winning condition
 */
function checkWin() {
    if (playing && noTilesLeft()) {
        document.getElementById("smiley").src = "img/win.png"
        for (let i = 0; i < difficulty.rows; i++) {
            for (let j = 0; j < difficulty.cols; j++) {
                let el = grid[i][j]
                if (el.isMine) {
                    el.isFlagged = true
                }
            }
        }
        playing = false
        stopTimer()
    }
}

/**
 * Checks if there is no mines left to click and ends the game
 * @returns true if you won or false if game isn't finished yet
 */
function noTilesLeft() {
    for (let i = 0; i < difficulty.rows; i++) {
        for (let j = 0; j < difficulty.cols; j++) {
            let el = grid[i][j]
            if (!el.isMine && !el.isClicked) {
                return false
            }
        }
    }
    return true
}

/**
 * Adds or removes flag from a square
 * @param {int} x horizontal position of the square
 * @param {int} y vertical position of the square
 */
function flagButton(x, y) {
    if (!grid[x][y].isClicked) {
        grid[x][y].isFlagged = !grid[x][y].isFlagged
        displayGrid()
    }
    updateFlagCounter()
}

/**
 * Updates the counter to number of unflaged mines
 */
function updateFlagCounter() {
    let mines_unflagged = difficulty.mines
    for (let i = 0; i < difficulty.rows; i++) {
        for (let j = 0; j < difficulty.cols; j++) {
            if (grid[i][j].isFlagged) {
                mines_unflagged--
            }
        }
    }
    let str = mines_unflagged.toString()

    let mines = ["0", "0", "0"]
    switch (str.length) {
        case 1:
            mines[2] = str
            break
        case 2:
            mines[1] = str[0]
            mines[2] = str[1]
            break
        case 3:
            mines[0] = str[0]
            mines[1] = str[1]
            mines[2] = str[2]
            break
        case 4: // minus symbol is lost, but thats the best we can do
            mines[0] = str[1]
            mines[1] = str[2]
            mines[2] = str[3]
    }

    for (let i = 0; i < 3; i++) {
        document.getElementById("flags" + i).src = "img/digits/digit" + mines[i] + ".png"
    }
}

/**
 * Makes the game impossible to win
 */
function feelingLucky() {
    unlucky = true
    toggleHelp()
}

/**
 * Starts the game
 */
function startGame() {
    playing = true
    firstClick = true
    createGrid()
    placeMines()
    countNeighborMines()
    updateFlagCounter()
    displayGrid()
}

/**
 * Resets the game
 */
function resetGame() {
    resetTimer()
    document.getElementById("smiley").src = "img/ok.png"
    startGame()
}

startGame()