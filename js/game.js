let difficulty_presets = {
    easy: {
        rows: 9,
        cols: 9,
        mines: 10
    },
    intermediate: {
        rows: 16,
        cols: 16,
        mines: 40
    },
    expert: {
        rows: 16,
        cols: 30,
        mines: 99
    }
}

let difficulty = difficulty_presets.easy;
let playing = true

function setDifficulty(diff) {
    difficulty = diff
    resetGame()
}

function toggleHelp() {
    document.getElementById("get_help").classList.toggle("hidden")
}

function switchDifficulty() {
    switch (difficulty) {
        case difficulty_presets.easy:
            setDifficulty(difficulty_presets.intermediate)
            break
        case difficulty_presets.intermediate:
            setDifficulty(difficulty_presets.expert)
            break
        default:
            setDifficulty(difficulty_presets.easy)
            break
    }
}

class Cell {
    constructor() {
        this.isMine = false
        this.isExplodedMine = false
        this.isClicked = false
        this.isFlagged = false
        this.neighbormines = 0
    }
}

function createGrid() {
    for (let i = 0; i < difficulty.rows; i++) {
        grid[i] = []
        for (let j = 0; j < difficulty.cols; j++) {
            grid[i][j] = new Cell;
        }
    }
}

function placeMines() {
    let minesPlaced = 0
    while (minesPlaced < difficulty.mines) {
        let x = Math.floor(Math.random() * difficulty.rows)
        let y = Math.floor(Math.random() * difficulty.cols)
        if (!grid[x][y].isMine) {
            grid[x][y].isMine = true
            minesPlaced++
        }
    }
}

function countNeighborMines() {
    for (let i = 0; i < difficulty.rows; i++) {
        for (let j = 0; j < difficulty.cols; j++) {
            if (!grid[i][j].isMine) {
                let neighborMines = 0
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        if (i + k >= 0 && i + k < difficulty.rows && j + l >= 0 && j + l < difficulty.cols) {
                            if (grid[i + k][j + l].isMine) {
                                neighborMines++
                            }
                        }
                    }
                }
                grid[i][j].neighborMines = neighborMines
            }
        }
    }
}

function clickCell(x, y) {
    if (!grid[x][y].isClicked && !grid[x][y].isFlagged) {
        grid[x][y].isFlagged = false;
        grid[x][y].isClicked = true;
        if (grid[x][y].neighborMines == 0) {
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (x + k >= 0 && x + k < difficulty.rows && y + l >= 0 && y + l < difficulty.cols) {
                        if (!grid[x][y].isFlagged) {
                            clickCell(x + k, y + l)
                        }
                    }
                }
            }
        }
    }
}

function clickButton(x, y) {
    if (!grid[x][y].isFlagged) {
        clickCell(x, y)
        checkLose(x, y)
        checkWin()
        displayGrid()
    }
}

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
    }
}

function checkWin() {
    if (!playing) {
        return
    }
    if (noTilesLeft()) {
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
    }
}

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

function flagButton(x, y) {
    if (!grid[x][y].isClicked) {
        grid[x][y].isFlagged = !grid[x][y].isFlagged
        displayGrid()
    }
    updateFlagCounter()
}

function updateFlagCounter() {
    let mines_unflagged = difficulty.mines
    for (let i = 0; i < difficulty.rows; i++) {
        for (let j = 0; j < difficulty.cols; j++) {
            if (grid[i][j].isFlagged) {
                mines_unflagged--;
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
    }

    document.getElementById("flags100").src = "img/digits/digit" + mines[0] + ".png"
    document.getElementById("flags10").src = "img/digits/digit" + mines[1] + ".png"
    document.getElementById("flags1").src = "img/digits/digit" + mines[2] + ".png"
}

function startGame() {
    playing = true
    createGrid()
    placeMines()
    countNeighborMines()
    updateFlagCounter()
    displayGrid()
}

function resetGame() {
    document.getElementById("smiley").src = "img/ok.png"
    startGame()
}

startGame()