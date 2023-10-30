/**
 * Displays the game grid
 * Should be called on every change in the grid
 */
function displayGrid() {
    let table = document.getElementById('grid')

    // clear the table
    if (table.hasChildNodes) {
        table.innerHTML = ""
    }

    for (let i = 0; i < difficulty.rows; i++) {
        let t_row = document.createElement('tr')
        for (let j = 0; j < difficulty.cols; j++) {
            let t_data = document.createElement('td')
            let button = document.createElement('button')

            button.classList.add("field_button")
            if (playing) {
                button.setAttribute("onclick", "clickButton(" + i + ", " + j + ")")
                button.setAttribute("oncontextmenu", "flagButton(" + i + ", " + j + "); return false;")
                button.setAttribute("onmousedown", 'smiley("img/wow.png")')
                button.setAttribute("onmouseup", 'smiley("img/ok.png")')
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
                else if (grid[i][j].numNeighborMines == 0) {
                    button.classList.remove("field_button")
                    button.classList.add("field_button_empty")

                }
                if (grid[i][j].numNeighborMines > 0) {
                    button.classList.remove("field_button")
                    // add picture to button
                    let img = document.createElement('img')
                    img.src = "img/num_of_neighbors/open" + grid[i][j].numNeighborMines + ".png"
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

/**
 * Hides or shows the game window
 */
function closeWindow() {
    resetGame()
    unlucky = false
    let window = document.getElementById("game_window")
    window.classList.toggle("hidden")
    difficulty = difficulty_presets.easy

    if (window.classList.contains("hidden")) {
        document.getElementById("start").src = "img/taskbar_left_inactive.png"
    } else {
        document.getElementById("start").src = "img/taskbar_left_active.png"
        startGame()
    }
}

/**
 * Change the picture of similey face
 * @param {string} img Path to image
 */
function smiley(img) {
    document.getElementById("smiley").src = img
}

/**
 * Updates the time in the bottom right corner
 * Called once on page load
 */
function displayTime() {
    const date = new Date()
    let h = ("0" + date.getHours()).slice(-2)
    let m = ("0" + date.getMinutes()).slice(-2)
    time = (h + ":" + m)
    document.getElementById("clock").innerHTML = time
    setTimeout(displayTime, 2000)
}

/**
 * Opens a dropdown for selecting difficulty
 */
function enableDropdown() {
    let dropdown = document.getElementById("difficulty_dropdown")
    dropdown.classList.toggle("show")
    let buttons = dropdown.querySelectorAll("button")
    for (const i in buttons) {
        if (Object.hasOwnProperty.call(buttons, i)) {
            const element = buttons[i]
            if (element.innerHTML == "Intermediate" && window.innerWidth < 375 || element.innerHTML == "Expert" && window.innerWidth < 684) {
                element.disabled = true
            }
            else {
                element.disabled = false
            }

            if (element.innerHTML == difficulty.name) {
                element.classList.add("checkmark")
            } else {
                element.classList.remove("checkmark")
            }
        }
    }
}

/**
 * Close the dropdown if the user clicks outside of it
 * Source: https://www.w3schools.com/howto/howto_js_dropdown.asp
 */
window.onclick = function (event) {
    if (!event.target.matches('#difficulty_button')) {
        let dropdowns = document.getElementsByClassName("dropdown-content")
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i]
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show')
            }
        }
    }
}

/**
 * Changes to easier difficulty if the window is too small
 * Called automatically when the window is resized
 */
window.onresize = function () {
    if (window.innerWidth < difficulty.width) {
        switch (difficulty.name) {
            case "Intermediate":
                difficulty = difficulty_presets.easy
                break
            case "Expert":
                difficulty = difficulty_presets.intermediate
        }
        resetGame()
    }
}

/**
 * Pauses the game and hides the game window
 * Called when the user clicks the minimize button or taskbar icon
 */
function toggleWindowVisibility() {
    let window = document.getElementById("game_window")
    window.classList.toggle("hidden")
    if (window.classList.contains("hidden")) {
        document.getElementById("start").src = "img/taskbar_left_inactive.png"
        running = false
    } else {
        document.getElementById("start").src = "img/taskbar_left_active.png"
        if (playing && !firstClick) { // resumes the game if it was running before
            running = true
        } else if (playing && firstClick) { // ensures the window is correctly displayed after it is reopened
            resetGame()
        }
    }
}


/**
 * Source: https://www.w3schools.com/howto/howto_js_draggable.asp
 * @param {*} elmnt 
 */
function dragElement(elmnt) {
    var pos1, pos2, pos3, pos4
    document.getElementById("window_top").onmousedown = dragMouseDown

    function dragMouseDown(e) {
        e.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
    }

    function elementDrag(e) {
        e.preventDefault()

        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY

        let top = (elmnt.offsetTop - pos2)
        let left = (elmnt.offsetLeft - pos1)

        let width = difficulty.width
        switch (difficulty.name) {
            case "Easy":
                
                if (top < 170) {
                    top = 170
                }
                else if (top > window.innerHeight - 170) {
                    top = window.innerHeight - 170
                }
                if (left < width/2) {
                    elmnt.style.top = top
                    return
                }
                else if (left > window.innerWidth - width/2) {
                    left = window.innerWidth - width/2
                }
                break
        }

        elmnt.style.top = top
        elmnt.style.left = left

        console.log("top: " + top + " left: " + left);
        
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
    }
}

dragElement(document.getElementById("game_window"))