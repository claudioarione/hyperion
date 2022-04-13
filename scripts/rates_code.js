const exampleRate = {
    nome: "Tariffa ENEL E light",
    tva: 79,
    prezzi: [0.23473, 0.21269],
    fasce: [
        {
            dayType: "feriali",
            from: "19:00",
            to: "24:00",
            prezzo: 1
        },
        {
            dayType: "feriali",
            from: "00:00",
            to: "08:00",
            prezzo: 1
        },
        {
            dayType: "festivi",
            from: "00:00",
            to: "24:00",
            prezzo: 1
        }
    ]
}

rates = [];
rates.push(exampleRate);

localStorage.setItem("rates", rates)