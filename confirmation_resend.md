---
layout: inner
title: Resend Order Confirmation Tool
permalink: /resend
---

<div id="ordertool">
    {% assign cacheBust = site.time | date:'?v=%s' %}
    <link type="text/css" rel="stylesheet" href="{{ "/orderstatus.css" | relative_url | append: cacheBust }}">
    <!---->
    <div id="guide">
        <div id="orderdirections">
            <p>Placed an order and didn't receive your confirmation email? Enter the following information to have it sent again:</p>
            <ol>
                <li>Your email address used for checkout</li>
                <li>The date you placed your order</li>
            </ol>
        </div>
    </div>
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
        <div class="ordersupport">
            <em>If you do not receive your order confirmation in the next hour, please contact our support team using the link below.</em>
            <span>
                <a class="button" href="https://wearescp.zendesk.com/hc/en-us/requests/new?ticket_form_id=13405345210516" target="_blank">Contact Us</a>
            </span>
            <em>For any other questions, please refer to our <a href="https://secondcityprints.zendesk.com/hc/en-us" target="_blank">FAQ</a>.</em>
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

#orderdirections {
    padding: 0 0 2em;
}

#guide ol {
    padding-top: 1em;
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
                message.innerHTML = 'Request received! Our system will re-send your order confirmation email shortly, so long as the info you provided matches an order in our system.<br><br>Please make sure to check your spam and promotions folders as well.';
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