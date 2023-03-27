let difficulty = {
    "easy": [9, 9, 10],
    "intermediate": [16, 16, 40],
    "expert": [16, 30, 99]
}

function createGrid(dif) {
    let table = document.getElementById('grid')
    for (let i = 0; i < dif[0]; i++) {
        let t_row = document.createElement('tr')

        for (let j = 0; j < dif[1]; j++) {
            let t_data = document.createElement('td')
            let button = document.createElement('button')
            button.classList.add("field_button")
            if (i + 3 < j)
                button.classList.add("field_button_flagged")
            if (i == j)
                button.classList.add("field_button_mine")
            t_data.appendChild(button)
            t_row.appendChild(t_data)
        }
        table.appendChild(t_row)
    }
}

createGrid(difficulty.easy)