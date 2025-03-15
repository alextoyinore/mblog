/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

/**
 * import modules
 */
import Snackbar from './utils/snackbar.js';

const $form = document.querySelector('[data-login-form]');
const $submitBtn = document.querySelector('[data-submit-btn]');


// Handle sign-up form submission
$form.addEventListener('submit', async(e) => {
    // Preventing default behaviour
    e.preventDefault();
    // Disabling submit button to prevent mulitple submissions
    $submitBtn.setAttribute('disabled', '');
    // Creating FormData object to capture form data
    const formData = new FormData($form);
    
    // Send account lookup request to server
    const response = await fetch(`${window.location.origin}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(Object.fromEntries(formData.entries())).toString()
    });

    // Handle case where response status is success
    if (response.ok) {
        // Redirect user to login page
        return window.location = response.url;
    }

    // Handle case where response status is 400 (Bad Request)
    if (response.status >= 400) {
        // Enable submit button and show error message
        const { message } = await response.json();
        Snackbar({
            message: message,
            type: 'error'
        });
        // console.log(message);
    }

    // Handle case where response status is 400 (Bad Request)
    if (response.status >= 500) {
        // Enable submit button and show error message
        // const { message } = await response.json();
        Snackbar({
            message: 'Oops, we could not sign you in at this time. Please try again later',
            type: 'error'
        });
        // console.log(message);
    }
});
