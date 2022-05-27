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
    if (date.getDay() === 0)
        first = first - 7;
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

function fromDateObjectToFormat(date) {
    return  getStringFromNumber((date.getMonth() + 1)) + "/" +
        getStringFromNumber(date.getDate()) + "/" +
        getStringFromNumber(date.getFullYear()-2000);
}

/**
 * Changes the format of the date from "dd-mm-yyyy" to "mm/dd/yy"
 * @param date the date from the date picker
 * @returns {string} a string representing the date in the csv format "mm/dd/yy"
 */
function fromDatePickerToFormat(date) {
    const partsOfDate = date.split("-");
    return partsOfDate[1] + "/" + partsOfDate[2] + "/" + getStringFromNumber(parseInt(partsOfDate[0])-2000);
}

/**
 * Translates a date in the format "mm/dd/yy" in the corresponding italian date
 * @param date the date in the csv format "mm/dd/yy"
 * @returns {string} the date written in italian
 */
function fromFormatToItalian(date) {
    const partsOfDate = date.split("/");
    const dayOfTheWeek = italianDayOfTheWeek(fromFormatToDayInWeekIndex(date)).toLowerCase();
    return dayOfTheWeek + " " + parseInt(partsOfDate[1]) + " " + italianMonth(parseInt(partsOfDate[0])) + " 20" + partsOfDate[2];
}

/**
 * Sets the minutes and seconds of a selected hour
 * @param hour the selected hour
 * @param minute the minute we want to set
 * @param second the second we want to set
 * @returns {string} a string in the form "hh:mm:ss" where mm and ss are picked from the input
 */
function changeMinuteAndSecondOfHour(hour, minute, second) {
    const partsOfHour = hour.split(":");
    return partsOfHour[0] + ":" + getStringFromNumber(minute) + ":" + getStringFromNumber(second)
}

/**
 * Returns the correct appliance name accordingly to the input string
 * @param name the string representing the appliance
 * @returns {string} the complete name of the correct appliance
 */
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

/**
 * If enable is true, the function adds to the selected button the "active" class
 * @param btn the selected button
 * @param enable a boolean signal
 */
function enableOrDisableBtn(btn, enable) {
    if(enable)
        btn.classList.add("active");
    else
        btn.classList.remove("active");
}

/**
 * Returns the cumulative cost of the 7 days before the day provided in input
 * @param date a generic {@code Date}
 * @returns a number representing the cumulative cost of the 7 days before the day provided in input
 */
function getTotalKwhOfPrevious7Days(date){
    let totalKWhOfWeek = 0;
    for (let i = 0; i < 7; i++) {
        const dayInCurrent7Days = new Date(date);
        dayInCurrent7Days.setDate(dayInCurrent7Days.getDate()-i);
        const searchDate = fromDateObjectToFormat(dayInCurrent7Days);
        const result = energyDayValues.find(
            ({data}) => data === searchDate
        );
        let kWhOfDay = 0;
        if (result !== undefined && result != null)
            kWhOfDay = result.kWh;
        totalKWhOfWeek += kWhOfDay;
    }
    return totalKWhOfWeek;
}

/**
 * Returns an array containing the days of the given month
 * @param array an array of objects which have a "data" field
 * @param date a MM/DD/YY string
 * @returns {*} an array containing the days of the given month
 */
function getDaySubArray(array, date) {
    return array
        .filter(({data}) =>
            (data.split('/')[0] === date.split('/')[0]) &&
            (data.split('/')[1] === date.split('/')[1]) &&
            (data.split('/')[2] === date.split('/')[2])
        )
}

/**
 * Returns an array containing the days of the given month
 * @param array an array of objects which have a "data" field
 * @param date a MM/DD/YY string
 * @returns {*} an array containing the days of the given month
 */
function getMonthSubArray(array, date) {
    return array
        .filter(({data}) =>
            (data.split('/')[0] === date.split('/')[0]) &&
            (data.split('/')[2] === date.split('/')[2])
        )
}

/**
 * Returns an array containing the days of the given year
 * @param array an array of objects which have a "data" field
 * @param date a MM/DD/YY string
 * @returns {*} an array containing the days of the given year
 */
function getYearSubArray(array, date) {
    return array
        .filter(({data}) =>
            (data.split('/')[2] === date.split('/')[2])
        )
}

/**
 * Returns an array containing the days of the given week starting from monday
 * @param array an array of objects who have a "data" field
 * @param date a MM/DD/YY string
 * @returns {*} an array containing the days of the given week
 */
function getWeekSubArray(array, date) {
    const arrByDate = date.split('/');
    const dayToPass = new Date(parseInt(arrByDate[2]) + 2000, parseInt(arrByDate[0]) - 1, parseInt(arrByDate[1]));
    const week = getWeekArrayFromDate(dayToPass);

    const res = [];
    for (let i = 0; i < week.length; i++) {
        const value = array.find(({data}) => (data === week[i]));
        if (value) res.push(value);
    }

    return res;
}

/**
 * Finds the day when the most kWh were consumed
 * @param array an array of days containing both a "data" and a "kWh" field
 * @returns {*} the day object when the most kWh were consumed, or null if the array is empty
 */
function findWorstDay(array) {
    if (array.length === 0) {
        return null;
    }

    return array.reduce((prev, curr) => (prev.kWh > curr.kWh) ? prev : curr);
}

/**
 * Rounds the input hour to the given precision (e.g. rounds 22:43 into 22:45 and 22:42 into 22:40)
 * @param hour hh:mm {@code String}
 * @param precision integer indicating the time interval into which the hour is divided (e.g. 5 minutes)
 * @return {string} the "rounded" output hour
 */
function roundHourToPrecision(hour, precision) {
    const partsOfHour = hour.split(":");
    const minutes = parseInt(partsOfHour[1]);
    let newMinutes = Math.round(minutes / precision) * precision;
    let h = partsOfHour[0];
    if (newMinutes === 60) {
        newMinutes = 0;
        h = getStringFromNumber(parseInt(h) + 1);
    }
    return h + ":" + getStringFromNumber(newMinutes);
}

/**
 * Converts the selected time value in an integer representing how many intervals are present from 00:00 to it -
 * e.g. time = "04:05", interval = 5 => 49, because there are 49 interval of 5 minutes each from 00:00 to 04:05
 * @param time hh:mm {@code String}
 * @param interval an integer
 * @returns an integer
 */
function fromTimeStringToTotal(time, interval) {
    const partsOfHour = time.split(":");
    const intervalInOneHour = 60 / interval;
    return parseInt(partsOfHour[0]) * intervalInOneHour + Math.floor(parseInt(partsOfHour[1]) / interval);
}

/**
 * Converts the total amount of interval into an hour string - e.g. total = 10, interval = 5 => "00:50"
 * @param total an integer - in interval
 * @param interval an integer - in minutes
 * @returns {string} "hh:mm"
 */
function fromTotalToTimeString(total, interval) {
    const totalHour = Math.floor(total * interval / 60);
    const totalMinutes = total * interval - totalHour * 60;
    return getStringFromNumber(totalHour) + ":" + getStringFromNumber(totalMinutes);
}

/**
 * Calculates the value in kwh associated to an appliance whose power is {watt} W turned on for {minutes} min
 * @param watt integer
 * @param minutes integer
 * @return {number} integer representing the result [in kWh]
 */
function fromWattAndMinutesToKwh(watt, minutes) {
    return (watt / 1000) * (minutes / 60);
}


/**
 * Returns an integer representing the day of the week, from 0 (Monday) to 6 (Sunday)
 * @param date "mm/dd/yy" string
 * @return {number} an integer representing the day of the week, from 0 (Monday) to 6 (Sunday)
 */
function fromFormatToDayInWeekIndex(date) {
    const partsOfDate = date.split("/");
    const dayToPass = new Date(parseInt(partsOfDate[2]) + 2000, parseInt(partsOfDate[0]) - 1, parseInt(partsOfDate[1]));
    return (dayToPass.getDay() + 6) % 7;
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