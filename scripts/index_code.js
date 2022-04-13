/*==== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

/**
 * Updates navbar indicator section according to page scroll
 */
function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        let sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active')
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}

window.addEventListener('scroll', scrollActive)
//DatePicker
const datePicker = document.getElementById('datePicker');
const timePicker = document.getElementById('timePicker');
const curDate = new Date();
//curDate.setMinutes(curDate.getMinutes()-curDate.getTimezoneOffset());
datePicker.value = curDate.toJSON().slice(0, 10);
datePicker.max = curDate.toJSON().slice(0, 10);
timePicker.value = (curDate.getHours() + 1).toString()
timePicker.style.display = 'none';

datePicker.addEventListener('change', ()=> {
    const selectedDate = fromDatePickerToFormat(datePicker.value);
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        switch (active.id) {
            case "hourBtn" :
                const selectedHour = (timePicker.options[timePicker.selectedIndex].textContent).split("-")[0] + ":00";
                showHourChart(selectedDate, selectedHour !== undefined ? selectedHour : "17:00:00")
                break;
            case "dayBtn" :
                showDayChart(selectedDate);
                break;
            case "weekBtn" :
                showWeekChart(selectedDate);
                break;
            case "monthBtn" :
                showMonthChart(selectedDate);
                break;
            case "yearBtn" :
                showYearChart(selectedDate.split("/")[2]);
                break;
            default :
                console.log('Invalid button');
                break;
        }
    });
    updateIndexes();
    compareWithLastDayOfWeek();
    compareWithPreviousWeek();
});

timePicker.addEventListener('change', () => {
    const selectedHour = (timePicker.options[timePicker.selectedIndex].textContent).split("-")[0] + ":00";
    showHourChart(fromDatePickerToFormat(datePicker.value), selectedHour + ":00");
})
