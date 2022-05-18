let appliances;

const applName = document.getElementById('applianceName');
const applWatt = document.getElementById('applianceWatt');
const applCategoryName = document.getElementById('applianceCategoryName');
const applCategoryImg = document.getElementById('applianceCategoryImg');
const addApplianceBtn = document.getElementById('addApplianceBtn');
const appliancesList = document.getElementById("appliancesList");
let isNameAcceptable = false;
let isConsumptionAcceptable = false;

applName.addEventListener('change', () => {
    const applianceName = applName.value;
    if (applianceName.trim().length === 0) {
        isNameAcceptable = false;
    } else {
        isNameAcceptable = true;
        const categorySelected = checkImageCompatibility(applianceName);
        applCategoryName.value = categorySelected;
        applCategoryImg.src = "/images/appliance_icons/" + categorySelected + ".png";
    }
    enableOrDisableBtn(addApplianceBtn, isConsumptionAcceptable && isNameAcceptable);
});

applCategoryName.addEventListener('change', () => {
    const category = applCategoryName.value;
    applCategoryImg.src = "/images/appliance_icons/" + category + ".png";
});

applWatt.addEventListener('change', () => {
    isConsumptionAcceptable = !(applWatt.value === null || applWatt.value === undefined);
    enableOrDisableBtn(addApplianceBtn, isConsumptionAcceptable && isNameAcceptable);
})

/**
 * Shows the list of appliances in the DOM taken from local storage data
 */
function showAppliances() {
    let getLocalStorageData = localStorage.getItem("appliances");
    if (getLocalStorageData === null || getLocalStorageData === undefined) {
        localStorage.setItem("appliances", JSON.stringify([]))
    } else {
        appliances = JSON.parse(getLocalStorageData);
    }
    const numAppliances = document.querySelector(".numAppliances");
    numAppliances.textContent = appliances.length.toString();
    let newLiTag = "";
    appliances.forEach((element, index) => {
        newLiTag += `
            <li>
                <div class="removeButton" onclick="deleteAppliance(${index})" style="position: absolute; top: 0.5rem; right: 0.5rem">X</div>
                <div style="display: flex;">
                    <img src="../images/appliance_icons/${element.category}.png" width="48px" alt="">
                    <div style="display: grid; margin-left: 10px">
                        <span>${element.name}</span>
                        <span>${element.watt} Watt</span>
                    </div>
                </div>
            </li>`;
    });


    appliancesList.innerHTML = newLiTag; //adding new li tags inside ul tag
    applName.value = "";
    applWatt.value = "";
    applCategoryName.value = "";
    applCategoryImg.src = "/images/appliance_icons/general.png";
}

showAppliances();

addApplianceBtn.onclick = ()=>{
    appliances.push({
        "name" : applName.value,
        "watt" : parseFloat(applWatt.value),
        "category" : applCategoryName.value
    });
    localStorage.setItem("appliances", JSON.stringify(appliances));
    showAppliances();
    enableOrDisableBtn(addApplianceBtn, false)
    setUpDetailsDropdown();
}

/**
 * Deletes the appliance at the given position of the "appliances" array saved in localStorage
 * @param index integer
 */
function deleteAppliance(index) {
    let getLocalStorageData = localStorage.getItem("appliances");
    appliances = JSON.parse(getLocalStorageData);
    appliances.splice(index, 1);
    localStorage.setItem("appliances", JSON.stringify(appliances));
    showAppliances();
    // TODO delete all usages for the appliance in details object
    setUpDetailsDropdown();
}