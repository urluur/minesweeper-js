let difficulty_presets = {
    easy: [9, 9, 10],
    intermediate: [16, 16, 40],
    expert: [16, 30, 99]
}

let difficulty = difficulty_presets.easy;

function displayGrid() {
    let table = document.getElementById('grid')
    if (table.hasChildNodes) {
        table.innerHTML = "";
    }
    for (let i = 0; i < difficulty[0]; i++) {
        let t_row = document.createElement('tr')
        for (let j = 0; j < difficulty[1]; j++) {
            let t_data = document.createElement('td')
            let button = document.createElement('button')
            
            button.classList.add("field_button")

            button.setAttribute("onclick", "clickButton(" + i + ", " + j + ")")
            button.setAttribute("oncontextmenu", "flagButton(" + i + ", " + j + "); return false;")

            if (grid[i][j].isFlagged) {
                button.classList.add("field_button_flagged")
            }
            if (grid[i][j].isBomb && grid[i][j].isClicked) {
                button.classList.add("field_button_mine")
                // reveal all bombs
                for (let k = 0; k < difficulty[0]; k++) {
                    for (let l = 0; l < difficulty[1]; l++) {
                        if (grid[k][l].isBomb) {
                            grid[k][l].isClicked = true
                        }
                    }
                }
                // end game
            }
            if (grid[i][j].isClicked) {
                if (grid[i][j].isBomb) {
                    button.classList.add("field_button")
                    button.classList.add("field_button_mine")
                }
                else if (grid[i][j].neighborBombs == 0) {
                    button.classList.remove("field_button")
                    button.classList.add("field_button_empty")

                }
                if (grid[i][j].neighborBombs > 0) {
                    button.classList.remove("field_button")
                    // add picture to button
                    let img = document.createElement('img')
                    img.src = "img/num_of_neighbors/open" + grid[i][j].neighborBombs + ".png"
                    button.classList.add("field_button_img")
                    button.appendChild(img)
                }
            }
            t_data.appendChild(button)
            t_row.appendChild(t_data)
        }
        table.appendChild(t_row)
    }
}

function closeWindow() {
    let window = document.getElementById("game_window")
    window.classList.toggle("hidden")

    // source: https://www.w3schools.com/jsref/prop_img_src.asp
    if (window.classList.contains("hidden")) {
        document.getElementById("start").src="img/taskbar_left_inactive.png";
    } else {
        document.getElementById("start").src="img/taskbar_left_active.png";
        startGame();
    }
}