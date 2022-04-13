/*const exampleRate = {
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

rates = [];
rates.push(exampleRate);

localStorage.setItem("rates", JSON.stringify(rates))*/

/**
 * Takes the list of rates from local storage and creates the rate items
 */
function showRates() {
    const rates = JSON.parse(localStorage.getItem("rates"));
    const ratesList = document.getElementById("ratesList");

    for (let i = 0; i < rates.length; i++) {
        const rate = rates[i];
        const li = document.createElement("li");
        const div = document.createElement("div");
        div.style.position = "relative";

        const removeButton = document.createElement("div");
        removeButton.innerText = "X";
        removeButton.className = "removeButton";
        removeButton.onclick = () => removeRate(i);
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

        div.appendChild(generateBars(rate.fasce.feriali, rate.prezzi, "Feriali"));
        div.appendChild(generateBars(rate.fasce.festive, rate.prezzi, "Festivi"));

        li.appendChild(div)
        ratesList.appendChild(li);
    }
}

showRates();

function generateBars(fasce, prezzi, tipo) {
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
 * Removes the Rate from the local storage and from the page
 * @param index the index of the rate to remove
 */
function removeRate(index) {
    console.log(index)
    console.log("Frero");
}