// noinspection JSUnusedGlobalSymbols

// TODO surround with try-catch block showXValues functions in order to show a warning indicating no data

let energyValues = [];
let energyDayValues = [];
let energyHourValues = [];

/**
 * Makes an efficient search of the input day inside energyValues
 * @param day "mm/dd/yy" string
 * @returns {number} index of one of the lines corresponding to the selected day inside energy values
 */
function dateStringBinarySearch(day) {
    let start = 0, end = energyValues.length-1;
    while (start<=end){
        const mid = start + Math.floor((end - start) / 2);
        const foundDate = energyValues[mid]["data"];
        if(foundDate === day) return mid;
        if(dateCompare(foundDate, day) === -1)
            start = mid + 1;
        else
            end = mid - 1;
    }
    return -1;
}

/**
 *
 * @param day "mm/dd/yy" {@code String} representing the selected day
 * @param hSt "hh:mm:ss" {@code String} representing the starting hour
 * @returns {*[]} array of key-value pair of minute and kWh, grouped every 5 minutes
 */
function showHourValues(day, hSt) {
    const approximateDayIndex = dateStringBinarySearch(day);
    let result = [];
    if(approximateDayIndex === -1){
        for (let min = 0; min < 60; min+=5) {
            const key = getStringFromNumber(min) + "-" + getStringFromNumber(min+4);
            result.push([
                key, 0
            ]);
        }
        return result;
    }
    let firstHourIndex = approximateDayIndex;
    while (firstHourIndex >= 0 && energyValues[firstHourIndex]["ora"] >= hSt && !dateCompare(energyValues[firstHourIndex]["data"], day)) {
        firstHourIndex--
    }
    firstHourIndex++
    while (firstHourIndex < energyValues.length && energyValues[firstHourIndex]["ora"] < hSt && !dateCompare(energyValues[firstHourIndex]["data"], day)) {
        firstHourIndex++;
    }
    if (energyValues[firstHourIndex] === undefined) {
        firstHourIndex--;
    }
    if (energyValues[firstHourIndex]["ora"].split(":")[0] !== hSt.split(":")[0]) {
        for (let min = 0; min < 60; min += 5) {
            const key = getStringFromNumber(min) + "-" + getStringFromNumber(min + 4);
            result.push([
                key, 0
            ]);
        }
    }
    for (let min = 0; min < 60; min += 5) {
        const key = getStringFromNumber(min) + "-" + getStringFromNumber(min + 4);
        let sum = 0;
        const firstHour = changeMinuteAndSecondOfHour(hSt, min, 0);
        const lastHour = changeMinuteAndSecondOfHour(hSt, min + 4, 59);
        while (energyValues[firstHourIndex] !== undefined && energyValues[firstHourIndex]["ora"] >= firstHour && energyValues[firstHourIndex]["ora"] <= lastHour) {
            sum += energyValues[firstHourIndex]["watt"];
            firstHourIndex++;
        }
        const value = (sum * MISURATION_INTERVAL) / (1000 * 3600);
        result.push([
            key, value
        ]);
    }
    return result;
}

/**
 * Aggregates measures and calculates kWh of an hour
 * @param day "mm/dd/yy" string indicating the considered day
 * @returns {*[]} array containing key-value pairs of the hours
 */
function showDayValues(day) {
    const approximateDayIndex = dateStringBinarySearch(day);
    if(approximateDayIndex === -1){
        let result = [];
        for (let i = 0; i < 24; i++) {
            const key = getStringFromNumber(i) + "-" + getStringFromNumber(i+1);
            const elementToAdd = [
                key, 0
            ];
            result.push(elementToAdd);
        }
        return result
    }
    let result = [];
    let firstDayIndex = approximateDayIndex;
    for (; firstDayIndex >= 0 ; firstDayIndex--) {
        if(dateCompare(energyValues[firstDayIndex]["data"], day))
            break;
    }
    firstDayIndex++;
    for (let hour = 0; hour < 24; hour++) {
        let totalKwh = 0;
        let firstTime, lastTime;
        if(parseInt(energyValues[firstDayIndex]["ora"].split(":")[0]) === hour) {
            let hourlyWatts = 0, count=0;
            firstTime = energyValues[firstDayIndex]["ora"].split(":");
            for (; firstDayIndex < energyValues.length; firstDayIndex++) {
                hourlyWatts += energyValues[firstDayIndex]["watt"];
                count++;
                if (energyValues[firstDayIndex + 1] === undefined) {
                    lastTime = energyValues[firstDayIndex]["ora"].split(":");
                    break;
                } else if (parseInt(energyValues[firstDayIndex + 1]["ora"].split(":")[0]) !== hour) {
                    lastTime = energyValues[firstDayIndex]["ora"].split(":");
                    firstDayIndex++;
                    break;
                }
            }
            const deltaTime = (lastTime[0] - firstTime[0])*3600 + (lastTime[1] -  firstTime[1])*60 + (lastTime[2] - firstTime[2]);
            totalKwh = (hourlyWatts/count)*deltaTime/(3600*1000);
        }
        const key = getStringFromNumber(hour)+"-"+getStringFromNumber(hour+1)
        result.push([
            key, totalKwh
        ]);
    }
    return result;
}

/**
 *
 * @param week array of "mm/dd/yy" strings from Monday to Sunday
 * @returns {*[]} array of key-value pair of daily kWh
 */
const showWeekValues = (week) => {
    let arrayRes = [];
    for (let i = 0; i < 7; i++) {
        const searchResult = energyDayValues.find(({data}) => data === week[i]);
        let result = 0;
        if(searchResult !== undefined && searchResult !== null)
            result = searchResult.kWh
        const key = italianDayOfTheWeek(i);
        arrayRes.push([
            key, result
        ]);
    }
    return arrayRes;
}

/**
 *
 * @param month "mm" string
 * @param year "yy" string
 * @returns {*[]} array of key-value pair of daily kWh
 */
const showMonthValues = (month, year) => {
    //I giorni considerati sono month/day/year
    let arrayRes = [];
    const numOfDays = new Date(parseInt(year)+2000, parseInt(month), 0).getDate();
    for(let i = 0; i< numOfDays; i++){
        const dayConsidered = month + "/" + getStringFromNumber(i+1) + "/" + year;
        const searchResult = energyDayValues.find(({data}) => data === dayConsidered);
        let result = 0;
        if(searchResult !== undefined && searchResult !== null)
            result = searchResult.kWh
        const key = getStringFromNumber((i+1).toString()) + "/" + month;
        arrayRes.push([
            key, result
        ]);
    }
    return arrayRes;
}


/**
 *
 * @param year "yy" string
 * @returns {*[]} array of key-value pair of monthly kWh
 */
const showYearValues = (year) => {
    let arrayRes = []
    for (let month = 1; month <= 12; month++) {
        let monthlyKwh = 0;
        const numOfDays = new Date(parseInt(year)+2000, month, 0).getDate();
        for (let day = 1; day <= numOfDays; day++) {
            const dayConsidered = getStringFromNumber(month) + "/" + getStringFromNumber(day) + "/" + year;
            const searchResult = energyDayValues.find(({data}) => data === dayConsidered);
            if (searchResult !== undefined && searchResult !== null)
                monthlyKwh += searchResult.kWh;
        }
        const key = getStringFromNumber(month) + "/" + year;
        arrayRes.push([
            key, monthlyKwh
        ]);
    }
    return arrayRes;
}

// {data:"11/07/22",hours:[0:12.45,1:123,...]}
// {
//      date: "11/07/22", hour:0, value: 12.45
//      key: "11/07/22.1, value: 1.89
/**
 * Parses input into a structure
 * @returns {Promise<void>}
 */
async function initializeEnergyValues() {
    const file = await fetch('./csv/energy.csv');
    const blob = await file.blob();
    Papa.parse(blob, {
        header: true,
        worker: true,
        dynamicTyping : true,
        step : function (row) {
            const day = row.data["data"];
            const value = row.data["watt"];
            if(value < 20000) {
                if (energyDayValues.length === 0 || energyDayValues[energyDayValues.length - 1].data !== day) {
                    energyDayValues.push({
                        data: day,
                        watt: value
                    });
                } else {
                    energyDayValues[energyDayValues.length - 1].watt += value;
                }
                energyValues.push(row.data);

                if (row.data["ora"] === undefined) {
                    return;
                }
                const hour = parseInt(row.data["ora"].split(":")[0]);

                if (energyHourValues.length === 0 || energyHourValues[energyHourValues.length - 1].hour !== hour) {
                    energyHourValues.push({
                        data: day,
                        hour: hour,
                        watt: value
                    });
                } else {
                    energyHourValues[energyHourValues.length - 1].watt += value;
                }
            }
        },
        complete : function () {
            console.log('Ho finito di analizzare i dati');
            energyDayValues.forEach((day) => {
                day.kWh = (day.watt * MISURATION_INTERVAL) / (3600 * 1000);
            });
            showWeekChart(fromDatePickerToFormat(datePicker.value));
            updateIndexes();
            showPage();

            showRates();
            initNewRateForm();
        }
    });
}

/**
 * Hides the "loading..." div and displays the main page
 */
function showPage() {
    const loading = document.getElementById("loading");
    const main = document.getElementById("main");
    loading.style.display = "none";
    main.style.display = "";
}

initializeEnergyValues();


