let details;

const detailsDropdown = document.getElementById('detailsDropdownList');
const detailsImagePreview = document.getElementById('detailsPreviewImg');
const detailsInitialTime = document.getElementById('detailsStartingTime');
const detailsEndingTime = document.getElementById('detailsEndingTime');
const addDetailBtn = document.getElementById('addDetailButton');
const detailsList = document.getElementById('detailsList');
let isInitialTimeOk = false, isFinalTimeOk = false, isApplianceOk = false;

function checkAddDetailBtnEnabling() {
    enableOrDisableBtn(addDetailBtn, isInitialTimeOk && isFinalTimeOk && isApplianceOk)
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
        "appliance": detailsDropdown.value
    };
    if (searchSameDate !== undefined) {
        searchSameDate.details.push(objectToPush);
    } else {
        details.push({
            "date": datePicker.value,
            "details": [
                objectToPush
            ]
        })
    }
    localStorage.setItem("details", JSON.stringify(details));
    showDetails();
}

addDetailBtn.addEventListener('click', () => {
    addDetail();
})

function removeDetail(value, index) {
    // TODO remove value from details and save it in localStorage
    console.log("Remove button pressed");
}

function createDetailListItem(detail, index) {
    const li = document.createElement("li");

    const divRemoveDetail = document.createElement('div');
    divRemoveDetail.classList.add("removeButton", "remove_item")
    divRemoveDetail.onclick = () => removeDetail(datePicker.value, index);
    divRemoveDetail.textContent = "X";

    const divWrapper = document.createElement('div');
    divWrapper.style.display = "flex";

    const image = document.createElement('img');
    image.src = "/images/appliance_icons/iron.png"
    image.width = 48;

    const divInfo = document.createElement('div');
    divInfo.style.display = "grid";
    divInfo.style.marginLeft = "10px";
    const spanName = document.createElement('span');
    spanName.textContent = detail.appliance
    const spanHour = document.createElement('span');
    spanHour.textContent = detail.start + " - " + detail.end;

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
    if (search === undefined) return;
    search.details.forEach((element, index) => {
        // Create a new element based on the info contained here
        console.log(element)
        createDetailListItem(element, index)
    })
}

showDetails();