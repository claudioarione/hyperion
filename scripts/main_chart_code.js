const initialValues = {
    Settimana1: [
        ['Lunedì', 0],
        ['Martedì', 0],
        ['Mercoledì', 0],
        ['Giovedì', 0],
        ['Venerdì', 0],
        ['Sabato', 0],
        ['Domenica', 0]
    ]
};


/**
 * Maps the input in an object in the format required by HighCharts library
 * @param data An nx2 matrix containing keys and values
 * @param type an integer representing the selected interval of time: 0 for "5 minutes", 1 for "1 hour", 2 for "1 day"
 *             and 3 for "1 month"
 * @returns the object required by HighCharts
 */
function getData(data, type) {
    return data.map(function (element) {
        return {
            name: element[0],
            y: element[1],
            color: getColorByKwh(element[1], type)
        };
    });
}

// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols
let chart = new Highcharts.Chart({
    chart: {
        renderTo : 'chartContainer',
        type: 'column'
    },
    title: {
        text: 'Consumi energetici della settimana corrente',
        align: 'center'
    },
    subtitle: {
        text: 'Grafico dei consumi energetici della settimana',
        align: 'center'
    },
    plotOptions: {
        series: {
            grouping: false,
            borderWidth: 0
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        shared: true,
        headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
        // pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} kWh</b><br/>',
        pointFormatter: function () {
            return '<span style="color:' + this.color + '">\u25CF</span>' + this.series.name + ': <b>' + this.y.toFixed(2) + ' kWh</b><br/>'
        }
    },
    xAxis: {
        type: 'category',
        max: 6,
        labels: {
            useHTML: true,
            animate: true,
            formatter: function () {
                let value = this.value;

                return '<span>' + value + '<br></span>';
            }
        }
    },
    yAxis: [{
        title: {
            text: 'kWh consumati'
        },
        showFirstLabel: false
    }],
    series: [{
        name : 'Consumo',
        color: 'rgb(158, 159, 163)',
        pointPlacement: -0.2,
        linkedTo: 'main',
        data: initialValues["Settimana1"].slice()
    }],
    exporting: {
        allowHTML: true
    }
});

function showHourChart(day, hourStart) {
    const values = showHourValues(day, hourStart);

    chart.update({
        title: {
            text: 'Consumi energetici dell\'ora'
        },
        subtitle: {
            text: 'Grafico dei consumi energetici di ' + fromFormatToItalian(day) + ' tra le ' + hourStart.split(":")[0] + ':00 e le ' + getStringFromNumber(parseInt(hourStart.split(":")[0])+1) + ':00',
            align: 'center'
        },
        xAxis : {
            max : 11
        },
        series: [{
            name: "Consumo",
            data: getData(values, 0).slice()
        }]
    }, true, false, {
        duration: 800
    });
}

/**
 * Renders a bar chart showing daily consumes [in kWh]
 * @param day "mm/dd/yy" string
 */
function showDayChart(day){
    const values = showDayValues(day);

    chart.update({
        title: {
            text: 'Consumi energetici del giorno'
        },
        subtitle: {
            text: 'Grafico dei consumi energetici di ' + fromFormatToItalian(day),
            align: 'center'
        },
        xAxis : {
            max : 23
        },
        series: [{
            name: "Consumo",
            data: getData(values, 1).slice()
        }]
    }, true, false, {
        duration: 800
    });
}

/**
 * Renders a bar chart showing weekly consumes [in kWh]
 * @param day "mm/dd/yy" string
 */
function showWeekChart(day) {
    const arrByDate = day.split('/');
    const dayToPass = new Date(parseInt(arrByDate[2])+2000, parseInt(arrByDate[0])-1, parseInt(arrByDate[1]));
    const week = getWeekArrayFromDate(dayToPass);
    const values = showWeekValues(week);

    chart.update({
        title : {
            text : 'Consumi energetici della settimana corrente'
        },
        subtitle: {
            text: 'Grafico dei consumi energetici della settimana da ' + fromFormatToItalian(week[0]) + ' a ' + fromFormatToItalian(week[6]),
            align: 'center'
        },
        xAxis : {
            max : 6
        },
        series: [{
            data: getData(values, 2).slice()
        }]
    }, true, false, {
        duration: 800
    });
}

/**
 * Renders a bar chart showing monthly consumes [in kWh]
 * @param day "mm/dd/yy" string
 */
function showMonthChart(day) {
    const arrByDate = day.split('/');
    // const day = parseInt(arrByDate[0]);
    const values = showMonthValues(arrByDate[0], arrByDate[2]);

    chart.update({
        title : {
            text : 'Consumi energetici del mese'
        },
        subtitle: {
            text: 'Grafico dei consumi energetici di ' + italianMonth(parseInt(arrByDate[0])) + ' ' + (parseInt(arrByDate[2])+2000).toString(),
            align: 'center'
        },
        xAxis : {
            max : new Date(parseInt(arrByDate[2])+2000, parseInt(arrByDate[0]), 0).getDate() - 1
        },
        series: [{
            //name: "" ,
            data: getData(values, 2).slice()
        }]
    }, true, false, {
        duration: 800
    });
}

/**
 * Renders a bar chart showing yearly consumes [in kWh]
 * @param year "yy" string
 */
function showYearChart(year) {
    const values = showYearValues(year);

    chart.update({
        title : {
            text : 'Consumi energetici dell\'anno'
        },
        subtitle: {
            text: 'Grafico dei consumi energetici del 20' + year,
            align: 'center'
        },
        xAxis : {
            max : 11
        },
        series: [{
            data: getData(values, 3).slice()
        }]
    }, true, false, {
        duration: 800
    });
}

/* Listeners */

const dayBtn = document.getElementById('dayBtn');
const weekBtn = document.getElementById('weekBtn');
const monthBtn = document.getElementById('monthBtn');
const yearBtn = document.getElementById('yearBtn');
const hourBtn = document.getElementById('hourBtn');

hourBtn.addEventListener('click', () => {
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    hourBtn.classList.add('active');

    const dpValue = document.getElementById('datePicker').value;
    const timePicker = document.getElementById('timePicker');
    timePicker.style.display = '';
    showHourChart(fromDatePickerToFormat(dpValue), "17:00:00")
});

dayBtn.addEventListener('click', () => {
    //grafico da 24 colonne, uno per ogni ora
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    dayBtn.classList.add('active');

    timePicker.style.display = 'none';

    const dpValue = document.getElementById('datePicker').value;
    showDayChart(fromDatePickerToFormat(dpValue))
});

weekBtn.addEventListener('click', () => {
    //grafico da sette gruppi di tre colonne: 00-08/08-16/16-24
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    weekBtn.classList.add('active');

    timePicker.style.display = 'none';

    const dpValue = document.getElementById('datePicker').value;
    showWeekChart(fromDatePickerToFormat(dpValue))
});

monthBtn.addEventListener('click', () => {
    //grafico da 28/29/30/31 colonne, una per ogni giorno
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    monthBtn.classList.add('active');

    timePicker.style.display = 'none';

    const dpValue = document.getElementById('datePicker').value;
    showMonthChart(fromDatePickerToFormat(dpValue))
});

yearBtn.addEventListener('click', () => {
    //grafico da 12 colonne, una per ogni mese
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    yearBtn.classList.add('active');

    timePicker.style.display = 'none';

    const dpValue = document.getElementById('datePicker').value;
    showYearChart(fromDatePickerToFormat(dpValue).split("/")[2]);
});
