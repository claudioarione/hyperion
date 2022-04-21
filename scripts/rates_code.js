// ------------- TEST CODE ------------------------
// creates two rates and saves to local storage
// TODO: delete this code after implementation
const exampleRate1 = {
    nome: "Tariffa ENEL E light",
    tva: 79,
    prezzi:
        [{
            prezzo: 0.23473,
            colore: "#ff0000"
        },
            {
                prezzo: 0.21269,
                colore: "#ffdd00"
            }],
    fasce: {
        feriali:
            [{
                from: 19,
                to: 24,
                prezzo: 1
            },
                {
                    from: 0,
                    to: 8,
                    prezzo: 1
                },
            ],
        festive: [{
            dayType: "festivi",
            from: 0,
            to: 24,
            prezzo: 1
        }]
    }
};

const exampleRate2 = {
    nome: "Tariffa A2A",
    tva: 79,
    prezzi:
        [{
            prezzo: 0.23473,
            colore: "#ff0000"
        },
            {
                prezzo: 0.21269,
                colore: "#ffdd00"
            }],
    fasce: {
        feriali:
            [
                {
                    from: 18,
                    to: 24,
                    prezzo: 1
                },
                {
                    from: 0,
                    to: 7,
                    prezzo: 1
                },
            ],
        festive: [{
            dayType: "festivi",
            from: 0,
            to: 24,
            prezzo: 1
        }]
    }
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

    // Create the button to add new rates
    const newRateButton = createAddRateButton()
    ratesList.appendChild(newRateButton);
}

showRates();        // TODO: move this to PapaParse "complete" section

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

    const removeButton = document.createElement("div");
    removeButton.innerText = "X";
    removeButton.className = "removeButton";
    removeButton.onclick = () => removeRate(index);
    div.appendChild(removeButton);

    const rateName = document.createElement("h3");
    rateName.style.margin = "0";
    rateName.innerText = rate.nome;
    div.appendChild(rateName);

    for (let j = 0; j < rate.prezzi.length; j++) {
        const value = rate.prezzi[j]
        const p = document.createElement("p");
        p.innerHTML = "<p><span style=\"color: " + value.colore + "\">● </span>" + value.prezzo + " €/Kwh</p>";

        div.appendChild(p);
    }

    div.appendChild(generatePriceBars(rate.fasce.feriali, rate.prezzi, "Feriali"));
    div.appendChild(generatePriceBars(rate.fasce.festive, rate.prezzi, "Festivi"));

    li.appendChild(div)
    return li;
}

/**
 * Generate a bar containing multiple bars which show the different price band during a day
 * @param fasce array of price bands
 * @param prezzi array of prices
 * @param tipo tipe of day (feriale, festivo, ...)
 * @returns {HTMLDivElement}
 */
function generatePriceBars(fasce, prezzi, tipo) {
    const res = document.createElement("div");
    res.style.display = "flex";

    const title = document.createElement("p");
    title.innerText = tipo;
    res.appendChild(title)

    const barWrapper = document.createElement("div");
    barWrapper.className = "barWrapper";

    for (let cursor = 0; cursor < 24; cursor++) {
        const fascia = fasce.find((f) => (f.from <= cursor && cursor < f.to));
        let prezzo;
        if (fascia) {
            prezzo = prezzi[fascia.prezzo];
        } else {
            prezzo = prezzi[0];
        }
        barWrapper.appendChild(createBar(prezzo, cursor))
    }

    res.appendChild(barWrapper);

    return res;
}

/**
 * Creates a rateBar associated with a price
 * @param price the price
 * @param i number from 0 to 23, for border-radius
 */
function createBar(price, i) {
    const res = document.createElement("div");
    res.className = "rateBar";
    res.style.width = (100.0 / 24.0) + "%";
    res.style.backgroundColor = price.colore;
    if (i === 0) {
        res.style.borderBottomLeftRadius = "0.1rem";
        res.style.borderTopLeftRadius = "0.1rem";
    } else if (i === 23) {
        res.style.borderBottomRightRadius = "0.1rem";
        res.style.borderTopRightRadius = "0.1rem";
    }

    return res;
}

/**
 * Creates and return a "li" element which serves as an "add rate" button
 * When clicked, the button renders the form to add a new rate
 * @returns {HTMLLIElement} "add rate" button
 */
function createAddRateButton() {
    const addButtonDiv = document.createElement("div");
    addButtonDiv.className = "addButton";
    addButtonDiv.innerText = "Aggiungi Tariffa";
    addButtonDiv.onclick = () => displayNewRateForm(addButtonDiv);
    const addButtonLi = document.createElement("li");
    addButtonLi.style.padding = "0";
    addButtonLi.appendChild(addButtonDiv);
    return addButtonLi;
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
 * Shows the form to add a new rate
 * @param div the div which contained the "Add rate" button and which will contain the form
 */
function displayNewRateForm(div) {
    div.innerHTML = "";
    div.className = "";
    div.onclick = "";
    div.style.padding = "10px 15px";

    div.appendChild(createNewRateTitleDiv());
}

/**
 * Creates a new div containing the rate name and tva input forms
 * @returns {HTMLDivElement} the created div
 */
function createNewRateTitleDiv() {
    const titleDiv = document.createElement("div");
    titleDiv.className = "inputRateContainer";
    const nameLabel = document.createElement("label");
    nameLabel.for = "name";
    nameLabel.style.padding = "0.2rem 0.3rem 0.2rem 0";
    nameLabel.innerText = "Nome";

    const nameInput = document.createElement("input");
    nameInput.id = "name";
    nameInput.name = "name";
    nameInput.placeholder = "es: Tariffa ENEL, ...";

    const tvaLabel = document.createElement("label");
    tvaLabel.for = "tva";
    tvaLabel.style.padding = "0.2rem 0.3rem 0.2rem 1rem";
    tvaLabel.innerText = "TVA";

    const tvaInput = document.createElement("input");
    tvaInput.id = "tva";
    tvaInput.name = "tva";
    tvaInput.placeholder = "es: 79";
    tvaInput.style.width = "5rem";

    const eurP = document.createElement("p");
    eurP.style.padding = "0.2rem 0.5rem 0.2rem 0.2rem";
    eurP.innerText = "€";

    titleDiv.appendChild(nameLabel);
    titleDiv.appendChild(nameInput);
    titleDiv.appendChild(tvaLabel);
    titleDiv.appendChild(tvaInput);
    titleDiv.appendChild(eurP);

    return titleDiv;
}