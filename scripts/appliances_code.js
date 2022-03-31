let appliances;

const applName = document.getElementById('applianceName');
const applWatt = document.getElementById('applianceWatt');
const applCategoryName = document.getElementById('applianceCategoryName');
const applCategoryImg = document.getElementById('applianceCategoryImg');
const addApplianceBtn = document.getElementById('addApplianceBtn');
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.getElementById('deleteAllAppliances');
let isNameAcceptable = false;
let isConsumptionAcceptable = false;

applName.addEventListener('change', () => {
    const name = applName.value;
    if (name.trim().length === 0) {
        isNameAcceptable = false;
    }
    else {
        isNameAcceptable = true;
        const categorySelected = checkImageCompatibility(name);
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

function showTasks(){
    let getLocalStorageData = localStorage.getItem("appliances");
    if(getLocalStorageData == null){
        appliances = [];
    }else{
        appliances = JSON.parse(getLocalStorageData);
    }
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = appliances.length.toString(); //passing the array length in pendingtask
    if(appliances.length > 0){ //if array length is greater than 0
        deleteAllBtn.classList.add("active");
    }else{
        deleteAllBtn.classList.remove("active");
    }
    let newLiTag = "";
    appliances.forEach((element, index) => {
        newLiTag += `<li><div style="display: flex;"><img src="../images/appliance_icons/${element.category}.png" width="48px" alt=""><div style="display: grid; margin-left: 10px"><span>${element.name}</span><span>${element.watt} Watt</span></div></div><span class="icon" onclick="deleteTask(${index})"><i class="fa fa-trash"></i></span></li>`;
    });
    todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
    applName.value = "";
    applWatt.value = "";
    applCategoryName.value = "";
    applCategoryImg.src = "/images/appliance_icons/general.png";
}

showTasks();

addApplianceBtn.onclick = ()=>{
    appliances.push({
        "name" : applName.value,
        "watt" : parseFloat(applWatt.value),
        "category" : applCategoryName.value
    });
    localStorage.setItem("appliances", JSON.stringify(appliances));
    showTasks();
    enableOrDisableBtn(addApplianceBtn, false)
}

function deleteTask(index){
    let getLocalStorageData = localStorage.getItem("appliances");
    appliances = JSON.parse(getLocalStorageData);
    appliances.splice(index, 1);
    localStorage.setItem("appliances", JSON.stringify(appliances));
    showTasks();
}

deleteAllBtn.onclick = ()=>{
    appliances = []
    localStorage.setItem("appliances", JSON.stringify(appliances));
    showTasks();
}
