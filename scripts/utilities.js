/** Return 1 if date1 is greater than date2
 *  Return -1 if date2 is greater than date1
 *  Else return 0 */
const dateCompare = (date1, date2) => {
    if(date1 === null || date2 === null) return 1;
    const slices1 = date1.split("/");
    const slices2 = date2.split("/");
    if(slices1[2] > slices2[2]) return 1;
    if(slices1[2] === slices2[2] && slices1[0] > slices2[0]) return 1;
    if(slices1[2] === slices2[2] && slices1[0] === slices2[0] && slices1[1] > slices2[1]) return 1;
    if(slices1[2] === slices2[2] && slices1[0] === slices2[0] && slices1[1] === slices2[1]) return 0;
    return -1;
}

const getStringFromNumber = (num) => {
    if(num<10) return '0'+num.toString();
    return num.toString();
}

function italianMonth(month){
    switch (month) {
        case 1: return "Gennaio";
        case 2: return "Febbraio";
        case 3: return "Marzo";
        case 4: return "Aprile";
        case 5: return "Maggio";
        case 6: return "Giugno";
        case 7: return "Luglio";
        case 8: return "Agosto";
        case 9: return "Settembre";
        case 10: return "Ottobre";
        case 11: return "Novembre";
        default : return "Dicembre";
    }
}

function italianDayOfTheWeek(day) {
    switch(day){
        case 0: return "Lunedì"
        case 1: return "Martedì"
        case 2: return "Mercoledì"
        case 3: return "Giovedì"
        case 4: return "Venerdì"
        case 5: return "Sabato"
        case 6: return "Domenica"
    }
    throw new Error("Not valid day of the week")
}

/**
 * @param date a generic Date
 * @returns an array containing all days of the input date's week, formatted as String "mm/dd/yy"
 */
function getWeekArrayFromDate(date){
    let week = [];
    // Starting Monday not Sunday obviously
    let first = date.getDate() - date.getDay() + 1;
    let dateToAdd = new Date(date.setDate(first));
    for (let i = 0; i < 7; i++) {
        const dateString = getStringFromNumber((dateToAdd.getMonth() + 1)) + "/" +
            getStringFromNumber(dateToAdd.getDate()) + "/" +
            getStringFromNumber(dateToAdd.getFullYear()-2000);
        week.push(dateString)
        dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate()+1));
    }
    return week;
}

