/**
 * Fills the given battery with the given charge
 * @param batteryId id of the provided battery
 * @param classToChange a {@code String} which can be "active", "active_medium" or "active_negative"
 * @param charge an integer representing the charge level of the battery
 */
function fillBarsInBattery(batteryId, classToChange, charge) {
    let index = 0;
    document.querySelectorAll("#" + batteryId + " .energyBar").forEach((element) => {
        const power = Math.ceil(charge / 10);
        $(element).removeClass();
        $(element).addClass('energyBar');
        if (index !== power) {
            $(element).addClass(classToChange);
            index++;
        }
    });
}

/**
 * Sets the percentage charge level of the provided battery
 * @param charge an integer representing the % of kWh consumed in addiction (in subtraction if negative) to
 * @param batteryId
 */
function setContentOfBattery(charge, batteryId) {
    let classToChange = "active";
    if (charge < 0) {
        classToChange = "active_negative";
        charge = 0 - charge;
    } else if (charge < 20)
        classToChange = "active_medium";
    fillBarsInBattery(batteryId, classToChange, charge)
}

/**
 * Sets the absolute charge level of the provided battery
 * @param charge an integer representing the % of kWh consumed in addiction (in subtraction if negative) to
 * @param batteryId
 */
function setAbsoluteContentOfBattery(charge, batteryId) {
    let classToChange = "active_medium";
    if (charge > 100) {
        classToChange = "active_negative";
        charge = 100;
    } else if (charge < 40)
        classToChange = "active";
    fillBarsInBattery(batteryId, classToChange, charge);
}

/**
 * Updates the indexes in the "Indici e confronti" page
 */
function updateIndexes() {
    compareWithLastDayOfWeek();
    findWorstDays();
    compareWithPreviousMonth();
    compareWithPreviousWeek();
    compareSamePeriodInDifferentMonths();
}


// First index: comparison with the same day of the previous week
// Second index: comparison of the week with the previous week
// Third index: worst day of the week
// Fourth index: comparison of the month with the previous month
// Fifth index: worst day of month

// IDEA: absolute indexes - show in which day of the week/month the kWh consumed are greater

/**
 * Compares the energy used on the day selected on the DatePicker at the top of the website to the energy used
 * the same day of the week before
 */
function compareWithLastDayOfWeek() {
    const actualDate = document.getElementById('datePicker').value;
    let previousDate = new Date(actualDate);
    previousDate.setDate(previousDate.getDate() - 7);
    previousDate = getStringFromNumber(previousDate.getMonth() + 1) + "/" + getStringFromNumber(previousDate.getDate()) + "/" + (previousDate.getFullYear() - 2000).toString()

    const previousDateKwh = energyDayValues.find(
        ({data}) => data === previousDate
    );
    const actualDateKwh = energyDayValues.find(
        ({data}) => data === fromDatePickerToFormat(actualDate)
    );

    previousDate = fromFormatToItalian(previousDate);

    let result = 0;
    let textToShow = '';

    if (actualDateKwh === undefined || actualDateKwh === null)
        textToShow = 'Non sono disponibili dati per il giorno selezionato';
    else if (previousDateKwh === undefined || previousDateKwh === null)
        textToShow = 'Non sono disponibili dati per ' + previousDate;
    else {
        result = 100 - (actualDateKwh.kWh / previousDateKwh.kWh) * 100;
        let plusOrMinus = 'più';
        if (result > 0) {
            plusOrMinus = 'meno';
        }
        textToShow = 'Nel giorno selezionato hai consumato il ' + Math.abs(result).toFixed(ROUND_TO_DIGITS) + '% in ' + plusOrMinus + ' rispetto a ' + previousDate;
        if (result === 0)
            textToShow = 'Nel giorno selezionato hai consumato esattamente quanto ' + previousDate;
    }

    document.getElementById('firstIndex').textContent = textToShow;

    setContentOfBattery(result, 'firstIndexBattery')

}

/**
 * Compares the 7 days before the selected day with the 7 days before them
 */
function compareWithPreviousWeek() {
    const currentDate = new Date(document.getElementById('datePicker').value);
    const firstDayOfCurrent7Days = new Date(currentDate);
    firstDayOfCurrent7Days.setDate(firstDayOfCurrent7Days.getDate() - 6);

    // const lastDayOfPrevious7 = new Date(firstDayOfCurrent7Days);
    // lastDayOfPrevious7.setDate(lastDayOfPrevious7.getDate()-1);
    const firstDayOfPrevious7 = new Date(currentDate);
    firstDayOfPrevious7.setDate(firstDayOfPrevious7.getDate() - 7);

    const kWhOfCurrentWeek = getTotalKwhOfPrevious7Days(currentDate).toFixed(2);
    const kWhOfPastWeek = getTotalKwhOfPrevious7Days(firstDayOfPrevious7).toFixed(2);

    let textToShow = 'Nei sette giorni da ' + fromFormatToItalian(fromDateObjectToFormat(firstDayOfCurrent7Days)) + ' a ' +
        fromFormatToItalian(fromDateObjectToFormat(currentDate)) + ' hai consumato ' + kWhOfCurrentWeek + ' kWh';

    let result = 0;

    if (parseFloat(kWhOfCurrentWeek) !== 0 && parseFloat(kWhOfPastWeek) !== 0) {
        result = 100 - (kWhOfCurrentWeek / kWhOfPastWeek) * 100;
        let plusOrMinus = 'più';
        if (result > 0) {
            plusOrMinus = 'meno';
        }

        textToShow += ', il ' + Math.abs(result).toFixed(ROUND_TO_DIGITS) + '% in ' + plusOrMinus + ' dei sette giorni precedenti'
    }

    setContentOfBattery(result, 'secondIndexBattery')

    document.getElementById('secondIndex').textContent = textToShow;

}

/**
 * Compares the selected month with the previous one
 */
function compareWithPreviousMonth() {
    const actualDate = document.getElementById('datePicker').value;
    const supportDate = new Date(actualDate);
    const actualMonthValues = getMonthSubArray(energyDayValues, fromDatePickerToFormat(actualDate));

    let previousDate;
    if (supportDate.getMonth() === 0)
        previousDate = "12/01/" + (supportDate.getFullYear() - 2001).toString();
    else
        previousDate = getStringFromNumber(supportDate.getMonth()) + "/01/" + (supportDate.getFullYear() - 2000).toString();

    const previousMonthValues = getMonthSubArray(energyDayValues, previousDate);

    let actualMonthTotal = 0;
    for (let i = 0; i < actualMonthValues.length; i++)
        if (actualMonthValues[i].kWh !== undefined && actualMonthValues[i].kWh !== null)
            actualMonthTotal += actualMonthValues[i].kWh;

    let previousMonthTotal = 0;
    for (let i = 0; i < previousMonthValues.length; i++)
        if (previousMonthValues[i].kWh !== undefined && previousMonthValues[i].kWh !== null)
            previousMonthTotal += previousMonthValues[i].kWh;

    previousDate = italianMonth(parseInt(previousDate.split('/')[0])) + ' ' + (parseInt(previousDate.split('/')[2]) + 2000).toString();

    let result = 0;
    let textToShow = '';

    if (actualMonthTotal === undefined || actualMonthTotal === 0)
        textToShow = 'Non sono disponibili dati per il mese selezionato';
    else if (previousMonthTotal === undefined || previousMonthTotal === null || previousMonthTotal === 0)
        textToShow = 'Non sono disponibili dati per ' + previousDate;
    else {
        result = (actualMonthTotal / previousMonthTotal) * 100;
        textToShow = 'Nel mese selezionato hai consumato il ' + result.toFixed(ROUND_TO_DIGITS) + '% dell\'energia consumata nel mese precedente';
    }

    document.getElementById('fourthIndex').textContent = textToShow;

    setAbsoluteContentOfBattery(result, 'fourthIndexBattery');
}

/**
 * Finds the day of the selected week and month when more KWh were consumed
 */
function findWorstDays() {
    const selectedDay = fromDatePickerToFormat(document.getElementById('datePicker').value);
    const monthValues = getMonthSubArray(energyDayValues, selectedDay);
    const weekValues = getWeekSubArray(energyDayValues, selectedDay);

    const worstMonthDay = findWorstDay(monthValues);    // is null if monthValues is empty
    const worstWeekDay = findWorstDay(weekValues);      // is null if weekValues is empty

    const ul = document.getElementById('worstDay');
    ul.innerHTML = '';      // remove precedent indexes

    if (worstWeekDay != null || worstMonthDay != null) {
        if (worstWeekDay) {
            const weekText = 'Consumo più elevato nella settimana di ' +
                fromFormatToItalian(selectedDay) +
                ': ' +
                fromFormatToItalian(worstWeekDay.data) +
                ' (' +
                worstWeekDay.kWh.toFixed(ROUND_TO_DIGITS) +
                'kWh)';
            const li = document.createElement('li')
            li.textContent = weekText;
            ul.appendChild(li);
        }
        if (worstMonthDay) {
            const monthText = 'Consumo più elevato nel mese di ' +
                italianMonth(parseInt(selectedDay.split('/')[0])) + ' ' +
                (parseInt(selectedDay.split('/')[2]) + 2000).toString() +
                ': ' +
                fromFormatToItalian(worstMonthDay.data) +
                ' (' +
                worstMonthDay.kWh.toFixed(ROUND_TO_DIGITS) +
                'kWh)';
            const li = document.createElement('li')
            li.textContent = monthText;
            ul.appendChild(li);
        }
    }
}

/**
 * Compares the kWh consumed between the selected day and the first day of this month with the kWh consumed
 * in the same range of the previous month
 */
function compareSamePeriodInDifferentMonths() {
    const currentDate = document.getElementById('datePicker').value;
    const supportDate = new Date(currentDate);

    const curMonthValues = showMonthValues(getStringFromNumber(supportDate.getMonth() + 1), (supportDate.getFullYear() - 2000).toString());
    const numberOfDaysOfCurrentMonth = new Date(supportDate.getFullYear(), supportDate.getMonth() + 1, 0).getDate();
    supportDate.setDate(supportDate.getDate() - numberOfDaysOfCurrentMonth);
    const pastMonthValues = showMonthValues(getStringFromNumber(supportDate.getMonth() + 1), (supportDate.getFullYear() - 2000).toString());

    const curDayOfMonth = parseInt(currentDate.split("-")[2]);
    const currentMonth = currentDate.split("-")[1];
    const currDate = getStringFromNumber(curDayOfMonth) + "/" + currentMonth

    let curMonthKWh = 0;
    for (let i = 0; curMonthValues[i][0] <= currDate; i++) {
        curMonthKWh += curMonthValues[i][1];
    }

    const pastDate = getStringFromNumber(curDayOfMonth) + '/' + (supportDate.getMonth() + 1).toString();
    let pastMonthKWh = 0;
    for (let i = 0; i < pastMonthValues.length && pastMonthValues[i][0] <= pastDate; i++) {
        pastMonthKWh += pastMonthValues[i][1];
    }

    let result = 0;
    let textToShow = 'Da inizio mese al giorno selezionato (' + fromFormatToItalian(fromDateObjectToFormat(new Date(currentDate))) +
        ') hai consumato ' + curMonthKWh.toFixed(ROUND_TO_DIGITS) + ' kWh';

    if (curMonthKWh !== 0 && pastMonthKWh !== 0) {
        result = 100 - (curMonthKWh / pastMonthKWh) * 100;
        let plusOrMinus = 'più';
        if (result > 0) {
            plusOrMinus = 'meno';
        }
        textToShow += ', il ' + Math.abs(result).toFixed(ROUND_TO_DIGITS) + '% in ' + plusOrMinus + ' dello stesso periodo di tempo nel mese precedente'
    }

    document.getElementById('thirdIndex').textContent = textToShow;

    setContentOfBattery(result, 'thirdIndexBattery');
}