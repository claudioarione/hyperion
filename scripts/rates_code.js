let rates;

/**
 * Takes the list of rates from local storage and creates the rate items
 */
function showRates() {
    let getLocalStorageData = localStorage.getItem("rates");
    if (getLocalStorageData === null || getLocalStorageData === undefined) {
        rates = [];
        localStorage.setItem("rates", JSON.stringify(rates))
    } else {
        rates = JSON.parse(getLocalStorageData);
    }

    const ratesList = document.getElementById("ratesList");
    ratesList.innerHTML = "";

    // TODO: "Nessuna tariffa" se array vuoto
    // Create a list item for every rate in rates
    for (let i = 0; i < rates.length; i++) {
        const rateLi = createRateLi(rates[i], i)
        ratesList.appendChild(rateLi);
    }

    // Change day, month and year labels
    const [year, month, day] = datePicker.value.split('-')
    document.querySelector("#dayCostId > span").textContent = day;
    document.querySelector("#monthCostId > span").textContent = italianMonth(parseInt(month));
    document.querySelector("#yearCostId > span").textContent = year;
}

const newRateTitle = document.getElementById("newRateTitle");
const newRatePrice = document.getElementById("newRatePrice");
const newRatePriceStart = document.getElementById("start");
const newRatePriceEnd = document.getElementById("end");
const addPriceBtn = document.getElementById("addPriceToRate");
const addRateButton = document.getElementById("addRateButtonId");

let newRate = {
    nome: "",
    prezzi: []
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

    // When the user clicks on the "X" in the new rate form, close it and reset price table
    document.getElementById("closeNewRateForm").onclick = () => {
        newRateForm.style.display = "none";
        resetForm();
    }

    // When the user clicks anywhere outside the new rate form, close it WITHOUT resetting the price table
    window.onclick = (event) => {
        if (event.target === newRateForm) {
            newRateForm.style.display = "none";
        }
    }

    addPriceBtn.addEventListener("click", function () {
        // Report non valid input
        if (!newRatePrice.reportValidity() || !newRatePriceStart.reportValidity() || !newRatePriceEnd.reportValidity()) {
            return;
        }

        if (document.querySelectorAll("#newPriceId input[type=checkbox]:checked").length === 0) {
            alert("Selezionare almeno un giorno della settimana")
            return;
        }

        let newPrice = {
            prezzo: newRatePrice.value,
            inizio: newRatePriceStart.value,
            fine: newRatePriceEnd.value,
            giorni: getCheckedDays()
        }

        newRate.prezzi.push(newPrice);

        const newTable = createPriceTable(newRate.prezzi);
        newTable.id = "prices";
        document.getElementById("prices").replaceWith(newTable);

        suggestNextValues();
    });

    // Confirm and add new rate to list
    addRateButton.addEventListener("click", function () {
        if (!newRateTitle.checkValidity()) {
            return;
        }

        if (newRate.prezzi.length === 0) {
            alert("Aggiungere almeno una fascia di prezzo");
        }

        // TODO: controllo di completezza delle fasce di prezzo
        // TODO: devono poter esistere due tariffe con lo stesso nome?

        newRate.nome = newRateTitle.value;

        const rates = JSON.parse(localStorage.getItem("rates"));
        rates.push(newRate);
        localStorage.setItem("rates", JSON.stringify(rates));

        resetForm();
        newRateForm.style.display = "none";
        showRates();
    })
}

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
    li.appendChild(div);

    // Total cost estimate
    const costDiv = document.createElement("div");
    costDiv.className = "costContainer";
    const costDivDay = document.createElement("div");
    const costDivMonth = document.createElement("div");
    const costDivYear = document.createElement("div");
    costDivDay.className = "cost";
    costDivMonth.className = "cost";
    costDivYear.className = "cost";
    costDivDay.textContent = computeDailyCost(rate) + " €";
    costDivMonth.textContent = computeMonthlyCost(rate) + " €";
    costDivYear.textContent = computeYearlyCost(rate) + " €";

    costDiv.append(costDivDay, costDivMonth, costDivYear);
    li.appendChild(costDiv);

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
 * Returns a string like "Lun-Ven" or "Sab" or "" from an array of booleans
 * @param giorni an array of booleans with 7 elements, representing the week days
 * @returns {string} a string representing the array; empty string if all elements are "false"
 */
function boolArrayToString(giorni) {
    let res = "";

    if (giorni[0] && giorni[1] && giorni[2] && giorni[3] && giorni[4] && !giorni[5] && !giorni[6]) {
        return "Lun-Ven ";
    }

    if (!giorni[0] && !giorni[1] && !giorni[2] && !giorni[3] && !giorni[4] && giorni[5] && !giorni[6]) {
        return "Sab ";
    }

    if (!giorni[0] && !giorni[1] && !giorni[2] && !giorni[3] && !giorni[4] && !giorni[5] && giorni[6]) {
        return "Dom ";
    }

    if (!giorni[0] && !giorni[1] && !giorni[2] && !giorni[3] && !giorni[4] && giorni[5] && giorni[6]) {
        return "Sab-Dom ";
    }

    if (giorni[0] && giorni[1] && giorni[2] && giorni[3] && giorni[4] && giorni[5] && !giorni[6]) {
        return "Lun-Sab ";
    }

    if (giorni[0] && giorni[1] && giorni[2] && giorni[3] && giorni[4] && giorni[5] && giorni[6]) {
        return "Lun-Dom ";
    }

    // Less common week combinations
    if (giorni[0]) res += "L "
    if (giorni[1]) res += "M "
    if (giorni[2]) res += "M "
    if (giorni[3]) res += "G "
    if (giorni[4]) res += "V "
    if (giorni[5]) res += "S "
    if (giorni[6]) res += "D "
    return res;
}

/**
 * Checks which days have been selected and returns an array of boolean values
 * @returns {(boolean|boolean|*)[]} a boolean array of 7 elements
 */
function getCheckedDays() {
    return [
        document.getElementById("L").checked,
        document.getElementById("Mar").checked,
        document.getElementById("Mer").checked,
        document.getElementById("G").checked,
        document.getElementById("V").checked,
        document.getElementById("S").checked,
        document.getElementById("D").checked,
    ];
}

/**
 * Suggests the next values for price start, end and days of the week to select
 */
function suggestNextValues() {
    // end hour becomes start hour of next price
    // TODO: try to fill in the next values in a "smart" way (try to fill the voids in the price table),
    // i.e if I add 19-8 then suggest 8-19 next (of the same days)
    // magari consultando newRate.prezzi

    if (parseInt(newRatePriceEnd.value) !== 24) {
        newRatePriceStart.value = newRatePriceEnd.value;
        newRatePriceEnd.value = 24;
        return;
    }

    newRatePriceStart.value = 0;

    // Suggest next days if one period of days is done
    let selectedDays = boolArrayToString(getCheckedDays());
    // Uncheck all days
    document.getElementById("L").checked = false;
    document.getElementById("Mar").checked = false;
    document.getElementById("Mer").checked = false;
    document.getElementById("G").checked = false;
    document.getElementById("V").checked = false;
    document.getElementById("S").checked = false;
    document.getElementById("D").checked = false;

    if (selectedDays === "Lun-Ven ") {
        document.getElementById("S").checked = true;
    } else if (selectedDays === "Sab ") {
        document.getElementById("D").checked = true;
    }
}

/**
 * Resets the form to add a new rate
 */
function resetForm() {
    newRate = {
        nome: "",
        prezzi: []
    }

    newRateTitle.value = "";

    newRatePrice.value = "";
    newRatePriceStart.value = "0";
    newRatePriceEnd.value = "24";

    document.getElementById("L").checked = true;
    document.getElementById("Mar").checked = true;
    document.getElementById("Mer").checked = true;
    document.getElementById("G").checked = true;
    document.getElementById("V").checked = true;
    document.getElementById("S").checked = false;
    document.getElementById("D").checked = false;

    const newTable = createPriceTable(newRate.prezzi);
    newTable.id = "prices";
    document.getElementById("prices").replaceWith(newTable);
}

/**
 * Computes and returns the estimated cost of a given rate in the selected year
 * @param rate a rate, containing an array of prices
 * @returns {string} the estimated cost
 */
function computeDailyCost(rate) {

    const dayArray = getDaySubArray(energyHourValues, fromDatePickerToFormat(datePicker.value));

    return getTotalCostFromArray(dayArray, rate);
}

/**
 * Computes and returns the estimated cost of a given rate in the selected month
 * @param rate a rate, containing an array of prices
 * @returns {string} the estimated cost
 */
function computeMonthlyCost(rate) {

    const monthArray = getMonthSubArray(energyHourValues, fromDatePickerToFormat(datePicker.value));

    return getTotalCostFromArray(monthArray, rate);
}

/**
 * Computes and returns the estimated cost of a given rate in the selected year
 * @param rate a rate, containing an array of prices
 * @returns {string} the estimated cost
 */
function computeYearlyCost(rate) {

    const yearArray = getYearSubArray(energyHourValues, fromDatePickerToFormat(datePicker.value));

    return getTotalCostFromArray(yearArray, rate);
}

/**
 * Returns the total cost of kWh consumed accordingly to the provided array.
 * It is assumed that the rate is correct, meaning that for each hour there is one and only one price
 * @param array array of objects of type {data:"MM/DD/YY",hour:integer[0-23],watt:double}
 * @param rate a rate, containing an array of prices
 * @returns {string} the estimated cost
 */
function getTotalCostFromArray(array, rate) {
    let res = 0;
    array.forEach((element) => {
        const dayOfTheWeek = fromFormatToDayInWeekIndex(element.data);
        rate.prezzi.forEach((priceElement) => {
            if (priceElement.giorni[dayOfTheWeek] === true) {
                if (hourIsInPriceRate(element.hour, priceElement)) {
                    res += ((element.watt * MISURATION_INTERVAL) / (1000 * 3600)) * priceElement.prezzo;
                }
            }
        });
    });

    return res.toFixed(ROUND_TO_DIGITS);
}

/**
 * Checks whether a given hour is included in a price element.
 * If priceElement.inizio > priceElement.fine (ES: from 19 to 8) it is assumed that the time slot is "from 0 to 8 or from 19 to 24"
 * @param hour {number} a number from 0 to 23
 * @param priceElement an object with both an "inizio" and a "fine" fields
 * @returns {boolean} whether the given hour is included in the given price element
 */
function hourIsInPriceRate(hour, priceElement) {
    // ES: from 8 to 19
    if (priceElement.inizio <= priceElement.fine) {
        return (priceElement.inizio <= hour && hour < priceElement.fine);     // (  inizio <= hour < fine  )
    }

    // ES: from 19 to 8 ----> from 0 to 8 OR from 19 to 24
    return (hour < priceElement.fine || hour >= priceElement.inizio);
}
