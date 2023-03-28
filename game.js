let difficulty_presets = {
    easy: [9, 9, 10],
    intermediate: [16, 16, 40],
    expert: [16, 30, 99]
}

let difficulty = difficulty_presets.easy;
let playing = true

function setDifficulty(diff) {
    difficulty = diff
    resetGame()
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
    // Create the grid
    for (let i = 0; i < difficulty[0]; i++) {
        grid[i] = []
        for (let j = 0; j < difficulty[1]; j++) {
            grid[i][j] = new Cell;
        }
    }
}

function placeMines() {
    // Place mines
    let minesPlaced = 0
    while (minesPlaced < difficulty[2]) {
        let x = Math.floor(Math.random() * difficulty[0])
        let y = Math.floor(Math.random() * difficulty[1])
        if (!grid[x][y].isMine) {
            grid[x][y].isMine = true
            minesPlaced++
        }
    }
}

function countNeighborMines() {
    // Count neighbor mines
    for (let i = 0; i < difficulty[0]; i++) {
        for (let j = 0; j < difficulty[1]; j++) {
            if (!grid[i][j].isMine) {
                let neighborMines = 0
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        if (i + k >= 0 && i + k < difficulty[0] && j + l >= 0 && j + l < difficulty[1]) {
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
    if (!grid[x][y].isClicked) {
        grid[x][y].isClicked = true;
        if (grid[x][y].neighborMines == 0) {
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (x + k >= 0 && x + k < difficulty[0] && y + l >= 0 && y + l < difficulty[1]) {
                        clickCell(x + k, y + l)
                    }
                }
            }
        }
    }
}

function clickButton(x, y) {
    clickCell(x, y)
    checkLose(x, y)
    checkWin()
    displayGrid()
}

function checkLose (x, y) {
    if (grid[x][y].isMine) {
        grid[x][y].isExplodedMine = true
        document.getElementById("smiley").src = "img/dead.png"
        // reveal all mines
        for (let i = 0; i < difficulty[0]; i++) {
            for (let j = 0; j < difficulty[1]; j++) {
                if (grid[i][j].isMine) {
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
    if(noTilesLeft()) {
        document.getElementById("smiley").src = "img/win.png"
        playing = false
        
    }
}

function noTilesLeft() {
    for (let i = 0; i < difficulty[0]; i++) {
        for (let j = 0; j < difficulty[1]; j++) {
            let el = grid[i][j]
            if (!el.isMine && !el.isClicked) {
                return false
            }
        }
    }
    return true
}

function flagCell(x, y) {
    grid[x][y].isFlagged = !grid[x][y].isFlagged
    displayGrid()
}

function flagButton(x, y) {
    flagCell(x, y)
    displayGrid()
}

function startGame() {
    playing = true
    createGrid()
    placeMines()
    countNeighborMines()
    displayGrid()
}

function resetGame() {
    document.getElementById("smiley").src = "img/ok.png"
    startGame()
}

startGame()