---
layout: inner
title: Resend Confirmation Tool
permalink: /resend
---

<div id="ordertool">
    {% assign cacheBust = site.time | date:'?v=%s' %}
    <link type="text/css" rel="stylesheet" href="{{ "/orderstatus.css" | relative_url | append: cacheBust }}">
    <!---->
    <form class="orderlookup" id="orderform">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        <!---->
        <label for="date">Date:</label>
        <input type="date" id="date" required>
        <!---->
        <p id="message" class="message"></p>
        <!---->
        <button type="submit" class="button">Resend</button>
    </form>
    <div id="guide">
        <div id="orderdirections">
            <p>In order to have another confirmation email sent, please enter...</p>
            <ol>
                <li>Your email address used for checkout</li>
                <li>The date you placed your order</li>
            </ol>
        </div>
        <div class="ordersupport">
            <em>If you do not know either the date or email associated with your order, please reach out!</em>
            <span>
                <a class="button" href="https://secondcityprints.zendesk.com/hc/en-us" target="_blank">FAQ</a>
                <a class="button" href="https://secondcityprints.zendesk.com/hc/en-us/requests/new" target="_blank">Contact Us</a>
            </span>
        </div>
    </div>
</div>

<style>
#message {
    line-height: 1.5em;
    text-align: center;
    border: 1px solid;
    padding: 0.5em;
}

#message:empty {
    display: none;
}
</style>

<script>
    const form = document.getElementById('orderform');
    const message = document.getElementById('message');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        
        if (!email || !date) {
            message.innerHTML = 'Please fill in all fields.';
        } else if (!isValidEmail(email)) {
            message.innerHTML = 'Please enter a valid email address.';
        } else {
            makeOrderConfirmationRequest(email, date);
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function makeOrderConfirmationRequest(email, date) {
        const baseURL = 'https://lr_resend.ksws.workers.dev/';
        const queryParams = `?email=${encodeURIComponent(email)}&date=${encodeURIComponent(date)}`;
        const requestURL = baseURL + queryParams;
        form.classList.add('fetching')

        fetch(requestURL)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.innerHTML = 'Request receieved! If your information is correct, you will receive another order confirmation email shortly.';
            } else {
                console.log(data.error, data.error == "slow down")
                switch(data.error) {
                    case "slow down":
                        message.innerHTML = "You've submitted a request within the last minute already. Please wait a minute!"
                    break

                    default:
                        message.innerHTML = data.error
                }
            }
            form.classList.remove('fetching')
        })
        .catch(error => {
            message.textContent = 'An error occurred while processing your request.';
            form.classList.remove('fetching')
        });
    }
</script>