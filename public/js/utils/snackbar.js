/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

const snackbarWrapper = document.querySelector('[data-snackbar]')
let lastTimeout = null


/**
 * Creates a snackbar component adn displays it with props
 * @param {Object} props - The properties for the snackbar
 * @param {String} props.message - The message to be displayed by the snackbar
 * @param {String} [props.type] - The type of the snackbar - error | null
 */
const Snackbar = (props) => {
    // Create snackbar element
    const snackbar = document.createElement('div');
    // snackbar.classList.add('snackbar');
    props.type &&  snackbar.classList.add(props.type);
    snackbar.innerHTML = `
       <p class="text-orange-500 my-3 text-[14px]">${props.message}</p>     
    `; 

    // Clear previous snackbar and append new one
    snackbarWrapper.innerHTML = '';
    snackbarWrapper.append(snackbar);

    // Remove snackbar after 10 seconds
    clearTimeout(lastTimeout);
    lastTimeout = setTimeout(() => {
        snackbarWrapper.removeChild(snackbar);
    }, 10000);
}

export default Snackbar

