/****************************** MAIN CONFIG *******************************/
/**
 * Relative path to a CSV file containing the measurements.
 * The file must be in the scope of the web server.
 * @type {string}
 */
const ENERGY_VALUES_FILE_PATH = './csv/energy.csv';

/**
 * The amount of seconds between each measurement in the energy file.
 * @type {number}
 */
const MISURATION_INTERVAL = 17.9;

/************************** ENERGY FILE FORMAT ****************************/
/**
 * The label of the "date" column in the .csv file, which contains "MM/dd/yy" strings
 * @type {string}
 */
const DATE_LABEL = "data";
/**
 * The label of the "hour" column in the .csv file, which contains "hh:mm:ss" strings
 * @type {string}
 */
const HOUR_LABEL = "ora";
/**
 * The label of the "energy values" column in the .csv file, which contains numbers (the measurements)
 * @type {string}
 */
const ENERGY_LABEL = "watt";

/**************************** RATES CONFIG ********************************/
/**
 * Array of "MM/dd" strings to be considered as a holiday for computing rate costs
 * @type {string[]}
 */
const HOLIDAYS_ARRAY = ["01/01", "01/06", "04/25", "05/01", "06/02", "08/15", "11/01", "12/08", "12/25", "12/26"]

/******************************* DISPLAY **********************************/
/**
 * The number of digits to round non-integer numbers in labels.
 * Only labels will be rounded.
 * @type {number}
 */
const ROUND_TO_DIGITS = 3;


/*************************** CHART COLORS **********************************/
const green = {
    linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    stops: [
        [0, '#00ff80'],
        [1, '#9cffb8']
    ]
};
const red = {
    linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    stops: [
        [0, '#ff0030'],
        [1, '#e17a3b']
    ]
}
const yellow = {
    linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    stops: [
        [0, 'rgb(255,233,9)'],
        [1, 'rgba(255,240,107,0.68)']
    ]
}



