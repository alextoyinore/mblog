/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

const snackbarWrapper = document.getElementById('snackbarWrapper');
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
    snackbar.classList.add('fixed', 'top-25', 'left-1/2', 'transform', '-translate-x-1/2', 'bg-gray-800', 'text-white', 'text-sm', 'px-4', 'py-2', 'rounded', 'transition-opacity', 'duration-300', 'opacity-0', 'z-50');

    // Set the type if provided
    if (props.type) {
        snackbar.classList.add(props.type);
    }

    snackbar.innerHTML = `
       <p class="my-2 text-[14px]">${props.message}</p>     
    `; 

    // Clear previous snackbar and append new one
    snackbarWrapper.innerHTML = '';
    snackbarWrapper.append(snackbar);

    // Show snackbar
    setTimeout(() => {
        snackbar.classList.remove('opacity-0'); // Fade in
        snackbar.classList.add('opacity-100');
    }, 10); // Small timeout to allow for the DOM to update

    // Remove snackbar after 10 seconds
    clearTimeout(lastTimeout);
    lastTimeout = setTimeout(() => {
        snackbar.classList.remove('opacity-100'); // Fade out
        snackbar.classList.add('opacity-0');
        setTimeout(() => {
            snackbarWrapper.removeChild(snackbar);
        }, 300); // Wait for fade out to complete
    }, 10000);
}

export default Snackbar

