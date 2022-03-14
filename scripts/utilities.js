/**
 * Compares two dates in the "mm/dd/yy" string format
 * @param date1 "mm/dd/yy" string indicating the first date of the comparison
 * @param date2 "mm/dd/yy" string indicating the second date of the comparison
 * @returns 1 if date1 is after date2; -1 if date2 is after date1; 0 otherwise
 * */
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

/**
 * Converts a number into a "xx" string
 * @param num a number
 * @returns {string} "xx" string
 */
const getStringFromNumber = (num) => {
    if(num<10) return '0'+num.toString();
    return num.toString();
}

/**
 * Maps a number into the corresponding Italian month
 * @param month a number between 1 and 12
 * @returns {string} string indicating the corresponding Italian month
 */
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

/**
 * Maps a number into the corresponding Italian day of the week
 * @param day a number between 0 and 6
 * @returns {string} string indicating the corresponding Italian day of the week
 */
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

/**
 * Associate a color gradient to a given kwh value
 * @param kwh energy value to associate with a linear gradient
 * @returns {{linearGradient: {y1: number, x1: number, y2: number, x2: number}, stops: (number|string)[][]}}
 */
function getColorByKwh(kwh){
    const green = {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
            [0, '#73d003'],
            [1, '#9cffee']
        ]
    };
    const red ={
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
            [0, '#ff0030'],
            [1, '#9cffee']
        ]
    }
    const yellow = {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
            [0, 'rgba(234,221,33,0.73)'],
            [1, 'rgba(64,145,8,0.68)']
        ]
    }
    if(kwh >= 1) return red;
    if(kwh >= 0.4) return yellow;
    return green;
}



