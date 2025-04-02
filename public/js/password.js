/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

/**
 * import modules
 */
import Snackbar from './utils/snackbar.js';

const form = document.querySelector('[data-email-form]');
const submitBtn = document.querySelector('[data-submit-btn]');
const stepInput = document.querySelector('[data-step]');
const titleLabel = document.querySelector('[data-security-label]')
const securityAnswerInput = document.querySelector('[data-security-answer]')

let theUser = null
let email = null


// Handle sign-up form submission
form.addEventListener('submit', async(e) => {
    // Preventing default behaviour
    e.preventDefault();
    // Disabling submit button to prevent mulitple submissions
    submitBtn.setAttribute('disabled', '');
    // Create a spinner element
    const spinner = document.createElement('div');
    spinner.className = 'spinner'; // Add the spinner class

    // Replace the button's inner text with the spinner
    submitBtn.innerHTML = ''; // Clear existing text
    submitBtn.appendChild(spinner); // Add the spinner to the button

    // Creating FormData object to capture form data
    const formData = new FormData(form);

    if(stepInput.value == 1) {
        // Store email for later
        email = formData.get('email')
        // Send account lookup request to server
        const response = await fetch(`${window.location.origin}/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(Object.fromEntries(formData.entries())).toString()
        });

        // Handle case where response status is success
        if (response.ok) {
            const {message, user, step} =  await response.json()
            
            theUser = user
            // Redirect user to login page
            Snackbar({
                message: message,
                type: 'success'
            });
           
            submitBtn.removeAttribute('disabled');
            submitBtn.removeChild(spinner);
            submitBtn.innerHTML = 'Submit'
            document.querySelector('[data-email]').setAttribute('hidden', 'hidden')

            titleLabel.removeAttribute('hidden')
            titleLabel.querySelector('.question').innerHTML = user.securityQuestion
            securityAnswerInput.removeAttribute('hidden')
            stepInput.value = 2
            
        }

        // Handle case where response status is 400 (Bad Request)
        if (response.status >= 400) {
            submitBtn.removeAttribute('disabled');
            submitBtn.removeChild(spinner); // remove the spinner to the button

            // Enable submit button and show error message
            const { message } = await response.json();

            Snackbar({
                message: message,
                type: 'error'
            });
            // console.log(message);
        }

    } else if(stepInput.value == 2) {
        // console.log(theUser)
        const securityAnswerInput = document.querySelector('[data-security-answer]')
        const answer = formData.get('securityAnswer')
        if(answer == theUser.securityAnswer){
            Snackbar({
                message: 'Security Check Passed',
                type: 'success'
            });
        }
        submitBtn.removeAttribute('disabled');
        submitBtn.removeChild(spinner);
        submitBtn.innerHTML = 'Submit'

        securityAnswerInput.setAttribute('hidden', 'hidden')

        const titleLabel = document.querySelector('[data-security-label]')
        titleLabel.querySelector('.question').innerHTML = 'New Password'
        titleLabel.querySelector('.sqlabel').setAttribute('hidden', 'hidden')

        const newPassword = document.querySelector('[data-new-password]')
        newPassword.removeAttribute('hidden')
        stepInput.value = 3
        
    } else if(stepInput.value == 3) {
        if(formData.get('password') != formData.get('confirm_password')){
            Snackbar({
                message: 'Passwords don\'t match. The passwords have to match',
                type: 'error'
            });
            submitBtn.removeAttribute('disabled');
            submitBtn.removeChild(spinner);
            submitBtn.innerHTML = 'Submit'
            return;
        }
        formData.append('email', email)
        formData.append('password', formData.get('password'))
        formData.append('step', 3)
        const response = await fetch(`${window.location.origin}/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(Object.fromEntries(formData.entries())).toString()
        });

        // Handle case where response status is success
        if (response.ok) {
            const {message, user, step} =  await response.json()

            Snackbar({
                message: message,
                type: 'success'
            });
            
            // Redirect user to login page
            return window.location = response.url;
        }

        // Handle case where response status is 400 (Bad Request)
        if (response.status >= 400) {
            submitBtn.removeAttribute('disabled');
            submitBtn.removeChild(spinner); // remove the spinner to the button

            // Enable submit button and show error message
            const { message } = await response.json();

            Snackbar({
                message: message,
                type: 'error'
            });
            // console.log(message);
        }
    }
    
});


