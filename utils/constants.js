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

/******************************* DISPLAY **********************************/
/**
 * The number of digits to round non-integer numbers in labels.
 * Only labels will be rounded.
 * @type {number}
 */
const ROUND_TO_DIGITS = 3;




