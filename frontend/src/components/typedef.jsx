/**
 * @typedef {Object} Video
 * @property {File} file
 * @property {boolean} uploaded
 * @property {boolean} analysed
 * @property {string} name
 * @property {boolean} youtube
 */


/**
 * @typedef {Object} UserVideo
 * @property {string} url
 * @property {string} name
 * @property {number} fps
 * @property {Result} results
 */

/**
 * @typedef {Object} Result
 * @property {string} selector
 * @property {number} run_time
 * @property {Frame[]} frames
 *
 */

/**
 *  @typedef {Object} Frame
 *  @property {number} frame_number
 *  @property {string} image
 *  
 * 
 */