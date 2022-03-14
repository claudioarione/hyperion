/* FIXME edit intial values with real values */
const intialPrevValues = {
    Settimana1: [
        ['Lun', 0.3],
        ['Mar', 0.11],
        ['Mer', 0.24],
        ['Gio', 0.38],
        ['Ven', 1.29],
        ['Sab', 0.46],
        ['Dom', 0.62]
    ],
    Settimana2: [
        ['Lun', 0.13],
        ['Mar', 0.8],
        ['Mer', 0.22],
        ['Gio', 0.51],
        ['Ven', 1.9],
        ['Sab', 0.36],
        ['Dom', 0.50]
    ]
};

const initialValues = {
    Settimana1: [
        ['Lun', 0.13],
        ['Mar', 0.8],
        ['Mer', 0.22],
        ['Gio', 0.51],
        ['Ven', 1.9],
        ['Sab', 0.36],
        ['Dom', 0.50]
    ],
    Settimana2: [
        ['Lun', 0.13],
        ['Mar', 5],
        ['Mer', 0.24],
        ['Gio', 0.38],
        ['Ven', 0.29],
        ['Sab', 0.46],
        ['Dom', 0.38]
    ]
};

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


/**
 * Maps the input in an object in the format required by HighCharts library
 * @param data An nx2 matrix containing keys and values
 * @returns the object required by HighCharts
 */
function getData(data) {
    return data.map(function (element) {
        return {
            name: element[0],
            y: element[1],
            color: getColorByKwh(element[1])
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
        text: 'Consumi energetici',
        align: 'center'
    },
    subtitle: {
        text: 'Grafico dei consumi energetici del giorno',
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
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} kWh</b><br/>'
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
        color: 'rgb(158, 159, 163)',
        pointPlacement: -0.2,
        linkedTo: 'main',
        data: intialPrevValues["Settimana1"].slice(),
        name: 'Settimana0'
    }, {
        name: 'Settimana1',
        id: 'main',
        dataLabels: [{
            enabled: true,
            inside: true,
            style: {
                fontSize: '16px'
            }
        }],
        data: getData(initialValues["Settimana1"]).slice()
    }],
    exporting: {
        allowHTML: true
    }
});


/* Listeners */

const dayBtn = document.getElementById('dayBtn');
const weekBtn = document.getElementById('weekBtn');
const monthBtn = document.getElementById('monthBtn');
const yearBtn = document.getElementById('yearBtn');

dayBtn.addEventListener('click', () => {
    //grafico da 24 colonne, 1 per ogni ora
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    dayBtn.classList.add('active');

    const values = showDayValues("11/29/21");

    chart.update({
        title: {
            text: 'Consumi energetici del giorno'
        },
        xAxis : {
            max : 23
        },
        series: [{
            name: "11/29/21",
            data: getData(values).slice()
        }]
    }, true, false, {
        duration: 800
    });
});

weekBtn.addEventListener('click', () => {
    //grafico da 7 gruppi di 3 colonne: 00-08/08-16/16-24
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    weekBtn.classList.add('active');

    const dayToShow = "01/06/22";
    const arrByDate = dayToShow.split('/');
    const dayToPass = new Date(parseInt(arrByDate[2])+2000, parseInt(arrByDate[0])-1, parseInt(arrByDate[1]));
    const week = getWeekArrayFromDate(dayToPass);
    const values = showWeekValues(week);

    chart.update({
        title : {
            text : 'Consumi energetici della settimana'
        },
        subtitle: {
            text: 'Grafico dei consumi energetici della settimana dal ' + week[0] + ' al ' + week[6],
            align: 'center'
        },
        xAxis : {
            max : 6
        },
        series: [{
            //name: "" ,
            data: getData(values).slice()
        }]
    }, true, false, {
        duration: 800
    });
});

monthBtn.addEventListener('click', () => {
    //grafico da 28/29/30/31 colonne, 1 per ogni giorno
    document.querySelectorAll('.buttons button.active').forEach(function (active) {
        active.classList.remove('active');
    });
    monthBtn.classList.add('active');

    const dayToShow = "01/06/22";
    const arrByDate = dayToShow.split('/');
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
            data: getData(values).slice()
        }]
    }, true, false, {
        duration: 800
    });
});

yearBtn.addEventListener('click', () => {
    //grafico da 12 colonne, 1 per ogni mese
});
