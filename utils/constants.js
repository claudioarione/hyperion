/**
 * The number of digits to round non-integer numbers in labels.
 * Only labels will be rounded.
 * @type {number}
 */
const ROUND_TO_DIGITS = 3;

/**
 * The amount of seconds between each misuration in the energy file.
 * @type {number}
 */
const MISURATION_INTERVAL = 17.9;

/**
 * Relative path to a CSV file containing the measurements.
 * The file must be in the scope of the web server.
 * It is possible to add external directories using the apache configuration file. For example, to add the csv/ directory
 * @type {string}
 */
const ENERGY_VALUES_FILE_PATH = './csv/energy.csv';

