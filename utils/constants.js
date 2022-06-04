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

/************************** ENERGY FILE CONFIG ****************************/
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
/**
 * Max Watt value to be considered. If a measurement energy value is greater, it is ignored
 * @type {number}
 */
const MAX_WATT = 20000;

/**************************** INDEX CONFIG ********************************/
/** max length of the "batteries" next to the first four indexes */
const MAX_BATTERY_WIDTH = 100;
// battery thresholds
const BATTERY_THRESHOLD_GREEN = -10;
const BATTERY_THRESHOLD_RED = 20;
// battery colors
const BATTERY_COLOR_GREEN = "linear-gradient(to right, #57f93e, #abfc9f)";
const BATTERY_COLOR_YELLOW = "linear-gradient(to right, #eaea02, #efefac)";
const BATTERY_COLOR_RED = "linear-gradient(to right, #f93c22, #fc6b58)";

/**************************** RATES CONFIG ********************************/
/**
 * Array of "MM/dd" strings to be considered as a holiday for computing rate costs
 * @type {string[]}
 */
const HOLIDAYS_ARRAY = ["01/01", "01/06", "04/25", "05/01", "06/02", "08/15", "11/01", "12/08", "12/25", "12/26"];
/**
 * Array of default rates to be shown if the local storage is empty (i.e: first visit to the website)
 */
const DEFAULT_RATES = [
    {
        "nome": "Tariffa Bioraria",
        "prezzi": [
            {
                "giorni": [
                    true,
                    true,
                    true,
                    true,
                    true,
                    false,
                    false
                ],
                "prezzo": 0.32189,
                "inizio": 8,
                "fine": 19
            },
            {
                "giorni": [
                    true,
                    true,
                    true,
                    true,
                    true,
                    false,
                    false
                ],
                "prezzo": 0.26679,
                "inizio": 19,
                "fine": 8
            },
            {
                "giorni": [
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    true
                ],
                "prezzo": 0.26679,
                "inizio": 0,
                "fine": 24
            }
        ]
    },
    {
        "nome": "Tariffa Senza orari",
        "prezzi": [
            {
                "giorni": [
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true
                ],
                "prezzo": 0.285,
                "inizio": 0,
                "fine": 24
            }
        ]
    },
    {
        "nome": "Tariffa Notte e Festivi",
        "prezzi": [
            {
                "giorni": [
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    false
                ],
                "prezzo": 0,
                "inizio": 23,
                "fine": 7
            },
            {
                "giorni": [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true
                ],
                "prezzo": 0,
                "inizio": 0,
                "fine": 24
            },
            {
                "giorni": [
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    false
                ],
                "prezzo": 0.56973,
                "inizio": 7,
                "fine": 23
            }
        ]
    }
];

/******************************* DISPLAY **********************************/
/**
 * The number of digits to round non-integer numbers in labels.
 * Only labels will be rounded.
 * @type {number}
 */
const ROUND_TO_DIGITS = 3;

/*************************** CHART COLORS *********************************/
const CHART_COLOR_GREEN = {
    linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    stops: [
        [0, '#00ff80'],
        [1, '#9cffb8']
    ]
};
const CHART_COLOR_RED = {
    linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    stops: [
        [0, '#ff0030'],
        [1, '#e17a3b']
    ]
}
const CHART_COLOR_YELLOW = {
    linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    stops: [
        [0, 'rgb(255,233,9)'],
        [1, 'rgba(255,240,107,0.68)']
    ]
}

/**************************** OTHER CONSTANTS ************************/
const MIN_INTERVAL = 5;
const MINS_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const MONTHS_IN_YEAR = 12;
const SECONDS_IN_HOUR = 3600;
const WATT_IN_KW = 1000;