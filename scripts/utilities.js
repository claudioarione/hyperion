const misurationInterval = 17.9
const green = {
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
        [0, '#00ff80'],
        [1, '#9cffb8']
    ]
};
const red ={
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
        [0, '#ff0030'],
        [1, '#e17a3b']
    ]
}
const yellow = {
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
        [0, 'rgb(255,233,9)'],
        [1, 'rgba(255,240,107,0.68)']
    ]
}

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
 * @param type an integer representing the selected interval of time: 0 for "5 minutes", 1 for "1 hour", 2 for "1 day"
 *             and 3 for "1 month"
 * @returns {{linearGradient: {y1: number, x1: number, y2: number, x2: number}, stops: (number|string)[][]}}
 */
function getColorByKwh(kwh, type){
    switch (type) {
        case 0:
            if(kwh >= (1/12)) return red;
            if(kwh >= (0.4/12)) return yellow;
            return green;
        case 2:
            if(kwh >= 6.8) return red;
            if(kwh >= 4.2) return yellow;
            return green;
        case 3:
            if(kwh >= 190) return red;
            if(kwh >= 150) return yellow;
            return green;
        default:
            if(kwh >= 1) return red;
            if(kwh >= 0.4) return yellow;
            return green;
    }
}

function fromDatePickerToFormat(date) {
    const partsOfDate = date.split("-");
    return partsOfDate[1] + "/" + partsOfDate[2] + "/" + getStringFromNumber(parseInt(partsOfDate[0])-2000);
}

function fromFormatToItalian(date) {
    const partsOfDate = date.split("/");
    const dayToPass = new Date(parseInt(partsOfDate[2])+2000, parseInt(partsOfDate[0])-1, parseInt(partsOfDate[1]));
    const dayOfTheWeek = italianDayOfTheWeek((dayToPass.getDay()+6)%7).toLowerCase();
    return dayOfTheWeek + " " + partsOfDate[1] + " " + italianMonth(parseInt(partsOfDate[0])) + " 20" + partsOfDate[2];
}

function changeMinuteAndSecondOfHour(hour, minute, second) {
    const partsOfHour = hour.split(":");
    return partsOfHour[0] + ":" + getStringFromNumber(minute) + ":" + getStringFromNumber(second)
}

function checkImageCompatibility(name) {
    const nameToCheck = name.toLowerCase();
    if(nameToCheck.includes("lavastovigl"))
        return "dishwasher";
    if(nameToCheck.includes("ferro") || nameToCheck.includes("stir"))
        return "iron";
    if (nameToCheck.includes("forn"))
        return "oven";
    if (nameToCheck.includes("tv") || nameToCheck.includes("tele"))
        return "television";
    if (nameToCheck.includes("lavatrice") || nameToCheck.includes("lavabianch"))
        return "washing_machine";
    if (nameToCheck.includes("aspira") || nameToCheck.includes("polvere"))
        return "vacuum_cleaner";
    if (nameToCheck.includes("phon") || nameToCheck.includes("asciugacap"))
        return "hair_dryer";
    return "general";
}

function enableOrDisableBtn(btn, enable) {
    if(enable)
        btn.classList.add("active");
    else
        btn.classList.remove("active");
}


