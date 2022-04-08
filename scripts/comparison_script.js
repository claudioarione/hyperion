/**
 * Sets the charge level of the provided battery
 * @param charge an integer representing the % of kWh consumed in addiction (in subraction if negative) to
 * @param batteryId
 */
function setContentOfBattery(charge, batteryId) {
    let index = 0;
    let classToChange = "active";
    if (charge < 0) {
        classToChange = "active_negative";
        charge = 0 - charge;
    }
    else if (charge < 20)
        classToChange = "active_medium";
    document.querySelectorAll("#"+ batteryId +" .bar").forEach( (element) => {
        const power = Math.round(charge / 10);
        $(element).removeClass();
        $(element).addClass('bar');
        if (index !== power) {
            $(element).addClass(classToChange);
            index++;
        }
    });


}


// First index: comparison with the same day of the previous week
// Second index: comparison with the previous 7 days
// Third index: comparison of the week in the previous 4 weeks
// Fourth index: comparison of the month with the previous month

// IDEA: absolute indexes - show in which day of the week/month the kWh consumed are greater

/**
 * Compares the energy used on the day selected on the DatePicker at the top of the website to the energy used
 * the same day of the week before
 */
function compareWithLastDayOfWeek(){
    const actualDate = document.getElementById('datePicker').value;
    let  previousDate = new Date(actualDate);
    previousDate.setDate(previousDate.getDate()-7);
    previousDate = getStringFromNumber(previousDate.getMonth() + 1) + "/" + getStringFromNumber(previousDate.getDate()) + "/" + (previousDate.getFullYear()-2000).toString()

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
        if (result > 0){
            plusOrMinus = 'meno';
        }
        textToShow = 'Nel giorno selezionato hai consumato il ' + Math.abs(result) + '% in ' + plusOrMinus + ' di ' + previousDate;
        if (result === 0)
            textToShow = 'Nel giorno selezionato hai consumato esattamente quanto ' + previousDate;
    }

    document.getElementById('firstIndex').textContent = textToShow;

    setContentOfBattery(result, 'firstIndexBattery')

}