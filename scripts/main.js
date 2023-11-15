function getHeaderOptions(template) {
    const header = template.content.cloneNode(true);
    const options = Array.from(header.getElementById("defaultPlayers").options);
    return options.unshift("#");
}

function generateTableHead(table, columnNumber) {
    const thead = table.createTHead();
    const row = thead.insertRow();
    const template = document.querySelector("#header-cell");
    let header_model;
    for (let i = 0; i <= columnNumber; i++) {
        let th = document.createElement("th");
        if (i == 0)
            header_model = document.createTextNode("#");
        else
            header_model = template.content.cloneNode(true);
        th.append(header_model);
        row.appendChild(th);
    }
}

function generateTable(table, columnNumber) {
    const template = document.querySelector("#table-cell");
    for (let j = 1; j < 11; j++) {
        let row = table.insertRow();
        let cell_model;
        for (let i = 0; i <= columnNumber; i++) {
            let cell = row.insertCell();
            if (i == 0) {
                cell_model = document.createElement("span");
                cell_model.innerText = j
                // cell_model.style.color = "white"
            }

            else {
                cell_model = template.content.cloneNode(true);
                cell_model.querySelector(".bid-field").setAttribute("id", "bid_" + j + "-" + i);
                cell_model.querySelector(".won-field").setAttribute("id", "won_" + j + "-" + i);
                cell_model.querySelector(".bonus-field").setAttribute("id", "bonus_" + j + "-" + i);
                cell_model.querySelector(".bonus-field").readOnly = true;
                cell_model.querySelector(".total-field").setAttribute("id", "total_" + j + "-" + i);
                cell_model.querySelector(".score-field").setAttribute("id", "score_" + j + "-" + i);
                const tableCell = cell_model.querySelector(".table-cell-model").addEventListener('change', inputChangeListener);
            }

            cell.append(cell_model);
        }
    }
}

function inputChangeListener(e) {
    // console.log("Field Id: "+e.target.id);
    // console.log("Class: "+e.target.className);
    // console.log("Value: "+e.target.value);
    const fieldValue = parseInt(e.target.value);
    e.target.value = fieldValue;
    const targetId = e.target.id;
    const cellIndex = targetId.split("_")[1];
    const cellRow = cellIndex.split("-")[0];
    const cellCol = cellIndex.split("-")[1];
    const bid = document.getElementById('bid_' + cellIndex);
    const won = document.getElementById('won_' + cellIndex);
    const bonus = document.getElementById('bonus_' + cellIndex);
    const total = document.getElementById('total_' + cellIndex);
    const score = document.getElementById('score_' + cellIndex);
    const parent = e.target.parentNode;
    const total_nodes_cond = '[id^="total_"][id$=' + CSS.escape(cellCol) + ']';
    const all_totals = document.querySelectorAll(total_nodes_cond);
    if (targetId.startsWith('bonus')) {
        console.log("Bonus field entered");
        printFieldsValue();
        total.value = bid.value * 20 + parseInt(bonus.value);
    } else {
        console.log("Bid/Won field entered");
        printFieldsValue();
        if (e.target.value && (parseInt(e.target.value) > cellRow || parseInt(e.target.value) < 0)) {
            console.log('   Incorrect Bid/Won');
            e.target.style.backgroundColor = 'yellow';
            e.target.value = 0;
            return;
        }
        else {
            e.target.style.backgroundColor = "white";
        }
        if (won.value && bid.value && won.value == bid.value) {
            console.log("   Bid == Won");
            if (bid.value == 0) {
                console.log("   !!! Mizer !!!");
                bonus.value = 0;
                total.value = cellRow * 10;
            }
            else {
                bonus.readOnly = false;
                bonus.value = 0;
                total.value = bid.value * 20;
            }
        }
        else if (won.value && bid.value && won.value != bid.value) {
            console.log("   Bid != Won");
            if (bid.value == 0) {
                console.log("   !!! Mizer Fail !!!");
                bonus.value = 0;
                total.value = cellRow * -10;
            } else {
                bonus.value = 0;
                bonus.readOnly = true;
                total.value = Math.abs(bid.value - won.value) * -10;
            }
        }

    }
    if (won.value && bid.value && won.value == bid.value) {
        Array.from(parent.children).forEach(field =>
            field.style.backgroundColor = "lightgreen");
    }
    else if (won.value && bid.value && won.value != bid.value) {
        Array.from(parent.children).forEach(field =>
            field.style.backgroundColor = "orangered");
    }
    const valued_totals = Array.from(all_totals).filter(total => total.value);
    valued_totals.forEach(v_t => console.log("   Valued total:" + v_t.id));
    // for (const v_t of valued_totals) {
    //     console.log("   Valued total:" + v_t.id);
    // }
    score.value = valued_totals.reduce((acc, curVal) => acc + parseInt(curVal.value), 0);

    function printFieldsValue() {
        console.log("   Cell index:" + cellIndex);
        console.log("   Cell row:" + cellRow);
        console.log("   Cell col:" + cellCol);
        console.log("   Bid field value:" + bid.value);
        console.log("   Won field value:" + won.value);
        console.log("   Bonus field value:" + bonus.value);
        console.log("   Total field value:" + total.value);
        console.log("   Score field value:" + score.value);
    }

}
const numberOfPlayers = 4;
const table = document.querySelector("table");
console.log(table);
generateTable(table, numberOfPlayers);
generateTableHead(table, numberOfPlayers);
