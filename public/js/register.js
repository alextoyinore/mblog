/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

/**
 * import modules
 */
import Snackbar from './utils/snackbar.js';

const $form = document.querySelector('[data-register-form]');
const $submitBtn = document.querySelector('[data-submit-btn]');


// Handle sign-up form submission
$form.addEventListener('submit', async(e) => {
    // Preventing default behaviour
    e.preventDefault();
    // Disabling submit button to prevent mulitple submissions
    $submitBtn.setAttribute('disabled', '');
    // Create a spinner element
    const spinner = document.createElement('div');
    spinner.className = 'spinner'; // Add the spinner class

    // Replace the button's inner text with the spinner
    $submitBtn.innerHTML = ''; // Clear existing text
    $submitBtn.appendChild(spinner); // Add the spinner to the button
    // Creating FormData object to capture form data
    const formData = new FormData($form);
    // Handle case where password and confirm password field don't match
    if (formData.get('password') !== formData.get('confirm_password')){
        // Enable submit button and show error message
        $submitBtn.removeAttribute('disabled');
        // Show snackbar
        Snackbar({
            message: 'Your passwords don\'t match. Kindly check and try again',
            type: 'error'
        })
        // console.error('Your passwords don\'t match. Kindly check and try again');
        return;
    }
    
    // Send account create request to server
    const response = await fetch(`${window.location.origin}/register`, {
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
        $submitBtn.removeAttribute('disabled');
        $submitBtn.removeChild(spinner); // remove the spinner to the button
        // Enable submit button and show error message
        const { message } = await response.json();
        Snackbar({
            message,
            type: 'error'
        });
        // console.log(message);
    }

    // Handle case where response status is 400 (Bad Request)
    if (response.status >= 500) {
        $submitBtn.removeAttribute('disabled');
        $submitBtn.removeChild(spinner); // remove the spinner to the button
        // Enable submit button and show error message
        // const { message } = await response.json();
        Snackbar({
            message: 'Oops, we could not register you at this point. Please try again later',
            type: 'error'
        });
        // console.log(message);
    }
});
