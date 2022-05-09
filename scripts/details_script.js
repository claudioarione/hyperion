let details;

const detailsDropdown = document.getElementById('detailsDropdownList');
const detailsImagePreview = document.getElementById('detailsPreviewImg');
const detailsInitialTime = document.getElementById('detailsStartingTime');
const detailsEndingTime = document.getElementById('detailsEndingTime');
const addDetailBtn = document.getElementById('addDetailButton');
const detailsList = document.getElementById('detailsList');
const detailsTitle = document.getElementById('detailsTitle');
let isInitialTimeOk = false, isFinalTimeOk = false, isApplianceOk = appliances.length !== 0, isTimeDiffOkay = false;

/**
 * Checks if the Add Detail button should be active and, if so, enables it
 */
function checkAddDetailBtnEnabling() {
    isTimeDiffOkay = detailsInitialTime.value < detailsEndingTime.value;
    enableOrDisableBtn(addDetailBtn, isInitialTimeOk && isFinalTimeOk && isApplianceOk && isTimeDiffOkay)
}

/**
 * Shows all the possible appliances in the detail dropdown
 */
function setUpDetailsDropdown() {
    detailsDropdown.replaceChildren();
    appliances.forEach((appliance, index) => {
        const option = document.createElement("option");
        option.value = appliance.name
        option.innerText = appliance.name
        detailsDropdown.appendChild(option)
        if (index === 0) {
            detailsImagePreview.src = "/images/appliance_icons/" + appliance.category + ".png"
        }
    })
}

detailsDropdown.addEventListener('change', () => {
    const applName = detailsDropdown.value;
    const res = appliances.find(({name}) => name === applName);
    if (res !== null && res !== undefined) {
        isApplianceOk = true;
        detailsImagePreview.src = "/images/appliance_icons/" + res.category + ".png";
    }
    checkAddDetailBtnEnabling()
})

detailsInitialTime.addEventListener('change', () => {
    detailsInitialTime.value = roundHourToPrecision(detailsInitialTime.value, 5)
    isInitialTimeOk = detailsInitialTime.value !== undefined
    checkAddDetailBtnEnabling()
})

detailsEndingTime.addEventListener('change', () => {
    detailsEndingTime.value = roundHourToPrecision(detailsEndingTime.value, 5)
    isFinalTimeOk = detailsEndingTime.value !== undefined
    checkAddDetailBtnEnabling()
})


// [{"date":"...", "details":["appliance":"", "ranges"=[{"start":"", "end":""}, {}]]]
/**
 * Adds the selected detail to the "details" array saved in localStorage
 */
function addDetail() {
    const searchSameDate = details.find(({date}) => date === datePicker.value);
    const objectToPush = {
        "start": detailsInitialTime.value,
        "end": detailsEndingTime.value,
    };
    if (searchSameDate !== undefined) {
        const searchSameAppliance = searchSameDate.details.find(({appliance}) => appliance === detailsDropdown.value);
        if (searchSameAppliance !== undefined) {
            searchSameAppliance.ranges.push(objectToPush);
        } else {
            searchSameDate.details.push({
                "appliance": detailsDropdown.value,
                "ranges": [
                    objectToPush
                ]
            })
        }
    } else {
        details.push({
            "date": datePicker.value,
            "details": [
                {
                    "appliance": detailsDropdown.value,
                    "ranges": [
                        objectToPush
                    ]
                }
            ]
        })
    }
    localStorage.setItem("details", JSON.stringify(details));
    showDetails();
}

addDetailBtn.addEventListener('click', () => {
    addDetail();
})

/**
 * Removes from localStorage all the details about the use of the selected appliance in the selected day
 * @param activeDate "dd-mm-yyyy" string
 * @param curAppliance the name of the selected appliance
 */
function removeDetail(activeDate, curAppliance) {
    const searchDate = details.find(({date}) => date === activeDate);
    const searchAppliance = searchDate.details.find(({appliance}) => appliance === curAppliance);
    const index = searchDate.details.indexOf(searchAppliance);
    searchDate.details.splice(index, 1);
    localStorage.setItem("details", JSON.stringify(details));
    showDetails();
}

/**
 * Creates a <li> to add to the list of showed details
 * @param detail object containing an "appliance" field and a "ranges" array of objects
 * @param index the position of the object in the "details" list
 */
function createDetailListItem(detail, index) {
    const li = document.createElement("li");

    const divRemoveDetail = document.createElement('div');
    divRemoveDetail.classList.add("removeButton", "remove_item")
    divRemoveDetail.onclick = () => removeDetail(datePicker.value, detail.appliance);
    divRemoveDetail.textContent = "X";

    const divWrapper = document.createElement('div');
    divWrapper.style.display = "flex";

    const image = document.createElement('img');
    const categorySearch = appliances.find(({name}) => name === detail.appliance);
    let category = "general";
    if (categorySearch !== undefined) category = categorySearch.category;
    image.src = "/images/appliance_icons/" + category + ".png"
    image.width = 48;

    const divInfo = document.createElement('div');
    divInfo.style.display = "grid";
    divInfo.style.marginLeft = "10px";
    const spanName = document.createElement('span');
    spanName.textContent = detail.appliance
    const spanHour = document.createElement('span');
    let text = "";
    detail.ranges.forEach((element) => {
        text += element.start + " - " + element.end + ", ";
    });
    spanHour.textContent = text.slice(0, -2);

    divInfo.replaceChildren(spanName, spanHour);

    divWrapper.replaceChildren(image, divInfo);

    li.replaceChildren(divRemoveDetail, divWrapper);

    detailsList.appendChild(li);
}

/**
 * Refreshes the changes applied to "details" array, saved in localStorage
 */
function showDetails() {
    const selectedDay = datePicker.value;
    detailsTitle.textContent = "Fasce di utilizzo di " + fromFormatToItalian(fromDatePickerToFormat(selectedDay));

    const json = localStorage.getItem("details");
    if (json == null) {
        localStorage.setItem("details", JSON.stringify([]));
        details = []
        return;
    }
    details = JSON.parse(json);
    const search = details.find(({date}) => date === selectedDay);
    detailsList.replaceChildren();
    if (search === undefined) {
        const emptyArr = []
        setUpDetailsChart(emptyArr);
        return;
    }
    search.details.forEach((element, index) => {
        // Create a new element based on the info contained here
        createDetailListItem(element, index)
    })
    setUpDetailsChart(search.details)
}

/**
 * Converts the given input values in an object representable with HighCharts
 * @param detailsArr array of objects
 * @param index position of the appliance whose details array is detailsArr inside the parent array (saved in localStorage)
 * @param watt power of the appliance
 * @return {*} array of objects with fields x, x2, y and color
 */
function getDataForDetails(detailsArr, index, watt) {
    return detailsArr.map((element) => {
        const start = fromTimeStringToTotal(element.start, 5)
        const end = fromTimeStringToTotal(element.end, 5)
        const kWh = fromWattAndMinutesToKwh(watt, (end - start) * 5)
        return {
            x: start,
            x2: end,
            y: index,
            color: getColorByKwh(kWh, 1)
        }
    })
}

/**
 * Shows an X-range chart with the details of the use of the appliances in the selected day
 * @param searchDetails object containing the result of the research of the current date inside the "details" array in localStorage
 */
function setUpDetailsChart(searchDetails) {

    let applianceLabels = []
    let detailsValues = []
    let wattValues = []
    searchDetails.forEach((element, index) => {
        applianceLabels.push(element.appliance);
        const searchWatt = appliances.find(({name}) => name === element.appliance);
        let watt = 0;
        if (searchWatt !== undefined) watt = searchWatt.watt;
        detailsValues = detailsValues.concat(getDataForDetails(element.ranges, index, watt));
        wattValues.push(watt);
    });
    let pointWidth = 80 - applianceLabels.length * 10;
    if (pointWidth < 10) pointWidth = 10;

    Highcharts.chart('detailsChartContainer', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Dettaglio dei consumi di ' + fromFormatToItalian(fromDatePickerToFormat(datePicker.value))
        },
        plotOptions: {
            series: {
                grouping: false,
                pointPadding: 0,
                groupPadding: 0
            }
        },
        xAxis: {
            min: 0,
            max: 24 * 12,
            visible: false
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: applianceLabels,
            reversed: true
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
            pointFormatter: function () {
                return '<span style="color:' + this.color + '">\u25CF</span>'
                    + applianceLabels[this.y] + ', ' + fromTotalToTimeString(this.x, 5) + ' - '
                    + fromTotalToTimeString(this.x2, 5) + ': <b>' +
                    +(fromWattAndMinutesToKwh(wattValues[this.y], (this.x2 - this.x) * 5) * 1000).toFixed(ROUND_TO_DIGITS)
                    + ' Wh</b><br/>'
            }
        },
        series: [{
            name: 'Consumi',
            borderColor: 'gray',
            pointWidth: pointWidth,
            data: detailsValues
        }]
    });
}

showDetails();
setUpDetailsDropdown();
