class Cell {
    constructor() {
        this.isBomb = false;
        this.isClicked = false;
        this.isFlagged = false;
        this.neighborBombs = 0;
    }
    
}

function createGrid() {
    // Create the grid
    for (let i = 0; i < difficulty[0]; i++) {
        grid[i] = [];
        for (let j = 0; j < difficulty[1]; j++) {
            grid[i][j] = new Cell;
        }
    }
}

function placeBombs() {
    // Place bombs
    let bombsPlaced = 0;
    while (bombsPlaced < difficulty[2]) {
        let x = Math.floor(Math.random() * difficulty[0]);
        let y = Math.floor(Math.random() * difficulty[1]);
        if (!grid[x][y].isBomb) {
            grid[x][y].isBomb = true;
            bombsPlaced++;
        }
    }
}

function countNeighborBombs() {
    // Count neighbor bombs
    for (let i = 0; i < difficulty[0]; i++) {
        for (let j = 0; j < difficulty[1]; j++) {
            if (!grid[i][j].isBomb) {
                let neighborBombs = 0;
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        if (i + k >= 0 && i + k < difficulty[0] && j + l >= 0 && j + l < difficulty[1]) {
                            if (grid[i + k][j + l].isBomb) {
                                neighborBombs++;
                            }
                        }
                    }
                }
                grid[i][j].neighborBombs = neighborBombs;
            }
        }
    }
}

function clickCell(x, y) {
    if (!grid[x][y].isClicked) {
        grid[x][y].isClicked = true;
        if (grid[x][y].neighborBombs == 0) {
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (x + k >= 0 && x + k < difficulty[0] && y + l >= 0 && y + l < difficulty[1]) {
                        clickCell(x + k, y + l);
                    }
                }
            }
        }
    }
}

function clickButton(x, y) {
    clickCell(x, y);
    displayGrid();
}

function flagCell(x, y) {
    grid[x][y].isFlagged = !grid[x][y].isFlagged;
    displayGrid();
}

function flagButton(x, y) {
    flagCell(x, y);
    displayGrid();
}

function startGame() {
    createGrid();
    placeBombs();
    countNeighborBombs();
    displayGrid();
}

function resetGame() {
    startGame();
}

startGame();