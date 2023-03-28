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
            if (playing) {
                button.setAttribute("onclick", "clickButton(" + i + ", " + j + ")")
                button.setAttribute("oncontextmenu", "flagButton(" + i + ", " + j + "); return false;")
            }

            if (grid[i][j].isFlagged) {
                button.classList.add("field_button_flagged")
            }

            if (grid[i][j].isClicked) {
                if (grid[i][j].isMine) {
                    button.classList.add("field_button")
                    button.classList.add("field_button_mine")
                    if (grid[i][j].isExplodedMine) {
                        button.setAttribute("style", "background-color: red")
                    }
                }
                else if (grid[i][j].neighborMines == 0) {
                    button.classList.remove("field_button")
                    button.classList.add("field_button_empty")

                }
                if (grid[i][j].neighborMines > 0) {
                    button.classList.remove("field_button")
                    // add picture to button
                    let img = document.createElement('img')
                    img.src = "img/num_of_neighbors/open" + grid[i][j].neighborMines + ".png"
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
    playing = false
    let window = document.getElementById("game_window")
    window.classList.toggle("hidden")

    // source: https://www.w3schools.com/jsref/prop_img_src.asp
    if (window.classList.contains("hidden")) {
        document.getElementById("start").src = "img/taskbar_left_inactive.png"
    } else {
        document.getElementById("start").src = "img/taskbar_left_active.png"
        startGame()
    }
}