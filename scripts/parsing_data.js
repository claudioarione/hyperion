// noinspection JSUnusedGlobalSymbols

let energyValues = [];


const showHourValues = (day, hour) => {
    let end = false, firstFound = false, lastFound = false;
    let count=0, sum=0, i=0, firstTime, lastTime;
    while(!end){
        if(energyValues[i]["data"] === day && energyValues[i]["ora"].split(":")[0] === hour){
            if(!firstFound && (i===0 || energyValues[i]["ora"].split(":")[0] !== energyValues[i-1]["ora"].split(":")[0])) {
                firstTime = energyValues[i]["ora"].split(":");
                firstFound = true;
            }
            if(!lastFound && (i===energyValues.length-1 || energyValues[i]["ora"].split(":")[0] !== energyValues[i+1]["ora"].split(":")[0])){
                lastTime = energyValues[i]["ora"].split(":");
                lastFound = true;
            }
            if(energyValues[i]["watt"] < 20000){
                sum += energyValues[i]["watt"];
                count++;
            }
        }
        else if(dateCompare(energyValues[i]["data"], day)===1)
            end = true;
        i++;
    }
    if(count === 0) return 0;
    const deltaTime = (lastTime[0] - firstTime[0])*3600 + (lastTime[1] -  firstTime[1])*60 + (lastTime[2] - firstTime[2]);
    return ((sum/count)*deltaTime)/3600000;
}


const showDayValues = (day) => {
    let arrayRes = [];
    for (let i = 0; i < 24; i++) {
        const res = showHourValues(day, getStringFromNumber(i));
        const key = getStringFromNumber(i) + "-" + getStringFromNumber(i+1);
        const elementToAdd = [
            key, res
        ];
        arrayRes.push(elementToAdd);
    }
    return arrayRes;
}

const getTotalKwhInADay = (day) => {
    const hourlyKwhOfDays = showDayValues(day);
    let sum = 0;
    for (let j = 0; j < 24; j++) {
        sum += hourlyKwhOfDays[j][1];
    }
    return sum;
}

const showWeekValues = (week) => {
    let arrayRes = [];
    for (let i = 0; i < 7; i++) {
        const sum = getTotalKwhInADay(week[i]);
        const key = italianDayOfTheWeek(i);
        arrayRes.push([
            key, sum
        ]);
    }
    return arrayRes;
}


const showMonthValues = (month, year) => {
    //I giorni considerati sono month/gg/year
    let arrayRes = [];
    const numOfDays = new Date(parseInt(year)+2000, parseInt(month), 0).getDate();
    for(let i = 0; i< numOfDays; i++){
        const dayConsidered = month + "/" + getStringFromNumber(i+1) + "/" + year;
        const result = getTotalKwhInADay(dayConsidered);
        const key = getStringFromNumber((i+1).toString()) + "/" + month;
        arrayRes.push([
            key, result
        ]);
    }
    return arrayRes;
}

async function intializeEnergyValues(){
    const file = await fetch('./csv/energy.csv');
    const blob = await file.blob();
    Papa.parse(blob, {
        header : true,
        worker : true,
        dynamicTyping : true,
        complete : function (result) {
            console.log('Ho finito di analizzare i dati');
            energyValues = result.data;
        }
    });
}

intializeEnergyValues();


