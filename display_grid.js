function createGrid(size) {
    var table = document.getElementById('grid')
    for (let i = 0; i < size; i++) {
        let t_row= document.createElement('tr')

        for (let j = 0; j < size; j++) {
            let t_data= document.createElement('td')
            let button = document.createElement('button')
            button.classList.add("field_button")
            t_data.appendChild(button)
            t_row.appendChild(t_data)
        }
        table.appendChild(t_row)
    }
}

createGrid(9)