let details;

const detailsDropdown = document.getElementById('detailsDropdownList');
const detailsImagePreview = document.getElementById('detailsPreviewImg');
const detailsInitialTime = document.getElementById('detailsStartingTime');
const detailsEndingTime = document.getElementById('detailsEndingTime');
const addDetailBtn = document.getElementById('addDetailButton');
const detailsList = document.getElementById('detailsList');
let isInitialTimeOk = false, isFinalTimeOk = false, isApplianceOk = appliances.length !== 0, isTimeDiffOkay = false;

function checkAddDetailBtnEnabling() {
    isTimeDiffOkay = detailsInitialTime.value < detailsEndingTime.value;
    enableOrDisableBtn(addDetailBtn, isInitialTimeOk && isFinalTimeOk && isApplianceOk && isTimeDiffOkay)
}

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

setUpDetailsDropdown();

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

function removeDetail(activeDate, curAppliance) {
    const searchDate = details.find(({date}) => date === activeDate);
    const searchAppliance = searchDate.details.find(({appliance}) => appliance === curAppliance);
    const index = searchDate.details.indexOf(searchAppliance);
    searchDate.details.splice(index, 1);
    localStorage.setItem("details", JSON.stringify(details));
    showDetails();
}

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

function showDetails() {
    const json = localStorage.getItem("details");
    if (json == null) {
        localStorage.setItem("details", JSON.stringify([]));
        // Potential problem on the following line
        details = []
        return;
    }
    details = JSON.parse(json);
    const selectedDay = datePicker.value;
    const search = details.find(({date}) => date === selectedDay);
    detailsList.replaceChildren();
    if (search === undefined) return;
    search.details.forEach((element, index) => {
        // Create a new element based on the info contained here
        createDetailListItem(element, index)
    })
}

showDetails();