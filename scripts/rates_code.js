// ------------- TEST CODE ------------------------
// creates two rates and saves to local storage
// TODO: delete this code after implementation
const exampleRate1 = {
    nome: "Tariffa ENEL E light",
    prezzi: [
        {
            giorni: [true, true, true, true, true, false, false],
            prezzo: 0.23473,
            inizio: 0,
            fine: 8
        },
        {
            giorni: [true, true, true, true, true, false, false],
            prezzo: 0.23890,
            inizio: 8,
            fine: 19
        },
        {
            giorni: [true, true, true, true, true, false, false],
            prezzo: 0.23890,
            inizio: 19,
            fine: 24
        },
        {
            giorni: [false, false, false, false, false, true, false],
            prezzo: 0.23890,
            inizio: 0,
            fine: 19
        },
        {
            giorni: [false, false, false, false, false, true, false],
            prezzo: 0.21321,
            inizio: 19,
            fine: 24
        },
        {
            giorni: [false, false, false, false, false, false, true],
            prezzo: 0.21321,
            inizio: 0,
            fine: 17
        },
        {
            giorni: [false, false, false, false, false, false, true],
            prezzo: 0.21321,
            inizio: 17,
            fine: 24
        },

    ],
};

const exampleRate2 = {
    nome: "Tariffa A2A",
    prezzi: [
        {
            giorni: [true, true, true, true, true, false, false],
            prezzo: 0.23573,
            inizio: 0,
            fine: 8
        },
        {
            giorni: [true, true, true, true, true, false, false],
            prezzo: 0.23890,
            inizio: 8,
            fine: 19
        },
        {
            giorni: [true, true, true, true, true, false, false],
            prezzo: 0.23890,
            inizio: 19,
            fine: 24
        },
        {
            giorni: [false, false, false, false, false, true, false],
            prezzo: 0.23890,
            inizio: 0,
            fine: 19
        },
        {
            giorni: [false, false, false, false, false, true, false],
            prezzo: 0.20321,
            inizio: 19,
            fine: 24
        },
        {
            giorni: [false, false, false, false, false, false, true],
            prezzo: 0.20321,
            inizio: 0,
            fine: 17
        },
        {
            giorni: [false, false, false, false, false, false, true],
            prezzo: 0.20321,
            inizio: 17,
            fine: 24
        },

    ],
};

rates = [];
rates.push(exampleRate1);
rates.push(exampleRate2);

localStorage.setItem("rates", JSON.stringify(rates))

// ------------------ END TEST CODE ------------------------

/**
 * Takes the list of rates from local storage and creates the rate items
 */
function showRates() {
    const rates = JSON.parse(localStorage.getItem("rates"));
    const ratesList = document.getElementById("ratesList");
    ratesList.innerHTML = "";

    // Create a list item for every rate in rates
    for (let i = 0; i < rates.length; i++) {
        const rateLi = createRateLi(rates[i], i)
        ratesList.appendChild(rateLi);
    }
}

/**
 * Sets the event listeners for the new rate form
 */
function initNewRateForm() {
    const newRateForm = document.getElementById("newRateFormId");

    // Display new rate form when user clicks "Aggiungi Tariffa"
    document.getElementById("openNewRateForm").onclick = () => {
        newRateForm.style.display = "block";
    }

    // When the user clicks on the "X" in the new rate form, close it
    document.getElementById("closeNewRateForm").onclick = () => {
        newRateForm.style.display = "none";
    }

    // When the user clicks anywhere outside the new rate form, close it
    window.onclick = (event) => {
        if (event.target === newRateForm) {
            newRateForm.style.display = "none";
        }
    }
}

showRates();        // TODO: move this to PapaParse "complete" section
initNewRateForm()

/**
 * Creates an HTML "li" element containing the rate information
 * @param rate rate object containing all the information
 * @param index rate index in the rates array
 * @returns {HTMLLIElement} "li" element containing the rate information
 */
function createRateLi(rate, index) {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.style.position = "relative";

    // Remove button
    const removeButton = document.createElement("div");
    removeButton.innerText = "X";
    removeButton.className = "removeButton";
    removeButton.onclick = () => removeRate(index);
    div.appendChild(removeButton);

    // Rate title
    const rateName = document.createElement("h3");
    rateName.style.margin = "0";
    rateName.innerText = rate.nome;
    div.appendChild(rateName);

    // Prices
    const table = createPriceTable(rate.prezzi);
    div.appendChild(table);
    li.appendChild(div)
    return li;
}

/**
 * Creates and returns an HTML table displaying the prices of the given rate
 * @param prezzi an array of prices (with a day, hour start and end and value)
 * @returns {HTMLTableElement} an HTML table with 3 columns: fascia, ora, prezzo
 */
function createPriceTable(prezzi) {
    const table = document.createElement("table");
    table.className = "rateTable";
    for (let j = 0; j < prezzi.length; j++) {
        const value = prezzi[j];
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = boolArrayToString(value.giorni);
        const td2 = document.createElement("td");
        td2.innerText = value.inizio + ":00" + " - " + value.fine + ":00";
        const td3 = document.createElement("td");
        td3.innerText = value.prezzo + " €/Kwh";
        tr.append(td1, td2, td3);
        table.appendChild(tr);
    }
    return table;
}

/**
 * Removes the Rate from the local storage and from the page
 * @param index the index of the rate to remove
 */
function removeRate(index) {
    const rates = JSON.parse(localStorage.getItem("rates"));
    rates.splice(index, 1);     // remove from rates list
    localStorage.setItem("rates", JSON.stringify(rates));

    showRates();
}

/**
 * Returns a string like "L M M G V " or "S D " or "" from an array of booleans
 * @param giorni an array of booleans with 7 elements, representing the week days
 * @returns {string} a string representing the array; empty string if all elements are "false"
 */
function boolArrayToString(giorni) {
    let res = "";

    if (giorni[0] && giorni[1] && giorni[2] && giorni[3] && giorni[4] && !giorni[5] && !giorni[6]) {
        return "Lun-Ver ";
    }

    if (!giorni[0] && !giorni[1] && !giorni[2] && !giorni[3] && !giorni[4] && giorni[5] && !giorni[6]) {
        return "Sab ";
    }

    if (!giorni[0] && !giorni[1] && !giorni[2] && !giorni[3] && !giorni[4] && !giorni[5] && giorni[6]) {
        return "Dom ";
    }

    if (giorni[0]) res += "L "
    if (giorni[1]) res += "M "
    if (giorni[2]) res += "M "
    if (giorni[3]) res += "G "
    if (giorni[4]) res += "V "
    if (giorni[5]) res += "S "
    if (giorni[6]) res += "D "
    return res;
}

// Quando clicco su "Aggiungi prezzo":
// se la fascia finisce NON alle 24 la fascia dopo inizia all'orario di fine di quella prima e mantiene gli stessi giorni
// se la fascia finisce alle 24 la fascia dopo inizia alle zero [e viene spuntato il giorno successivo?]
// in entrambi i casi mantiene lo stesso prezzo
