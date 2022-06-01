---
layout: inner
title: Order Status
---

<div class="orderstatus">
    <form id="orderlookup">
        <label for="email">Email Address</label>
        <input type="text" id="email" name="email" placeholder="Email">
        <label for="order">Transaction ID or Order #</label>
        <input type="text" id="order" name="order" placeholder="Order Number">
        <input type="submit" class="button" value="Find My Order">
    </form>
    <output class="orderdetails"></output>
    <div id="guide">
        <p>In order to retrieve your order information, please enter...</p>
        <ol>
            <li>Your email address used for checkout</li>
            <li>Your order number</li>
        </ol>
        <div class="ordersupport">
            <em>Still have questions about your order?</em>
            <span>
                <a class="button" href="https://secondcityprints.zendesk.com/hc/en-us" target="_blank">FAQ</a>
                <a class="button" href="https://secondcityprints.zendesk.com/hc/en-us/requests/new" target="_blank">Contact Us</a>
            </span>
            <em>With Covid-19, postal carriers are experiencing global delays due to increased volume and staffing limitations. Thank you for your patience.</em>
        </div>
    </div>
</div>

<style>

.orderstatus {
    max-width: 850px;
    width: 100%;
}

#orderlookup {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    text-align: center;
    max-width: 500px;
    margin: auto;
    width: 100%;
}

#orderlookup > * {
    margin-bottom: 20px;
}

#orderlookup label {
    margin-bottom: 5px;
}

#orderlookup.fetching {
    position: relative;
}

#orderlookup.fetching::after {
    content: "We're searching for your order now, this may take a moment!";
    margin-bottom: 1em;
    background: yellow;
    padding: 1em 10px;
    font-size: 0.8em;
}

#orderlookup.fetching::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 5vw;
    height: 5vw;
    z-index: 2;
    border: 5px dashed black;
    background-size: 120% 120%;
    background-position: center;
    border-radius: 100%;
    animation: SPIN 2s linear infinite;
}

@keyframes SPIN {
    0% { transform: translate(-50%, -50%) rotate(0deg) }
    100% { transform: translate(-50%, -50%) rotate(360deg) }
}

#orderlookup.fetching > * {
    opacity: 0.25;
    pointer-events: none;
}

.button, input.button {
    padding: 10px;
    background: black;
    color: white;
    display: inline-block;
}

.orderdetails {
    border: 1px solid;
    display: block;
    padding: 10px;
    background: yellow;
    white-space: pre-wrap;
    margin: 1em 0;
    line-height: 1.5em;
}

.orderdetails:empty {
    display: none;
}

.orderdetails > div {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
    align-items: flex-start;
}

.orderdetails > div > span {
    font-size: 1.25em;
    font-weight: 600;
}

.orderdetails > div:last-child {
    margin-bottom: 0;
}

#guide {
    font-size: 0.9em;
    line-height: 1.5em;
    max-width: 500px;
    margin: auto;
}

#guide ol {
    padding-left: 2em;
}

#guide em {
    font-style: italic;
    display: inline-block;
    font-size: 0.9em;
}

.chint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 1px solid;
    padding: 10px;
    width: 100%;
    margin: 0.5em auto;
    white-space: normal;
    background: white;
}

.chint span {
    font-size: 0.9em;
    line-height: 1.1em;
    padding-top: 10px;
    text-align: center;
}

.chint img {
    border: 1px dashed;
    margin: 0.5em 0;
}

#guide .ordersupport {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1em auto;
}

#guide .ordersupport > *:not(.button) {
    margin: 0.5em 0;
    text-align: center;
}

#guide .ordersupport em:last-child {
    font-size: 0.75em;
}

.chelp {
    text-align: center;
    width: 100%;
    display: block;
    margin-top: 0.5em;
    cursor: pointer;
    text-decoration: underline;
    color: #d42727;
    font-style: italic;
}
</style>

<script>
    function getOrder(event) {
        event.preventDefault()
        var form = document.querySelector('form#orderlookup')
        var data = new FormData(document.querySelector('#orderlookup'))
        var output = document.querySelector('.orderdetails')
        var shipTo, state, tracking, items, error

        output.innerHTML = ""
        if(!data.get('email').includes('@') || (!data.get('email') && !data.get('order'))) {
            output.insertAdjacentHTML('beforeend', `<div><span>ERROR</span>You need to enter a valid email and order number</div>`)
        }

        if(output.innerHTML == "") {
            form.classList.add('fetching')
            fetch(`https://scporderlookup.ksws.workers.dev/?email=${encodeURIComponent(data.get('email'))}&order=${encodeURIComponent(data.get('order'))}`).then(res=>res.json().then(data=>{
                for (const key in data) {
                    if (Object.hasOwnProperty.call(data, key)) {
                        var field = data[key]
                        console.log(key)
                        console.log(field)
                        switch(key) {
                            case 'shipto': 
                                shipTo = `<div><span>Shipping To:</span>${field}</div>`
                            break

                            case 'state': 
                                state = `<div><span>Shipping State: ${field.toUpperCase()}</span>`
                                switch(field) {
                                    case 'unshipped':
                                        state += `<em>Your order is either still being manufactured and is on pre-order, or is in our shipping program and pending shipment. Please note, all in-stock orders can have up to a 5-7 business day processing time before shipment. Preorders generally ship within 3-12 weeks after the order is placed - if there is a more specific timeline, it will be listed on the product page.<br><br>You will receive an email with your shipment tracking information after your item has been picked up from our warehouse and is on the way to you, and the tracking link will also show up here once it is processed for shipment.</em></div>`
                                    break
                                    default:
                                        state += '</div>'
                                }
                            break

                            case 'tracking': 
                                tracking = `<div><a href="${field}" class="button" target="_blank">TRACKING</a></div>`
                            break

                            case 'items':
                                items = '<div><span>Order Items</span>'
                                field.forEach(item=>{
                                    items += `<div class='item'>x${item.quantity} ${item.name} - ${item.price}</div>`
                                })
                                items += '</div>'
                            break

                            case 'error':
                                error = `<div><span>ERROR</span>${field.toUpperCase()}`
                                if(field.includes('Order not found')) {
                                    error+= `
                                    <div class="chint hide">
                                        <span>If your confirmation email includes a transaction number, try using that instead!<br>It will look like this in your order confirmation email:</span>
                                        <img src="/img/orderstatus/chexample.png" alt="a combination of numbers and letters that starts with ch_">
                                        <span>If you don't have one or it still doesn't work, reach out to our customer support below!</span>
                                    </div>`
                                }
                                error += "</div>"
                            break
                        }
                    }
                }

                output.insertAdjacentHTML('beforeend', `${error || ""}${state || ""}${shipTo || ""}${tracking || ""}${items || ""}`)     
                form.classList.remove('fetching')           
            }))
        }
    }
    document.getElementById('orderlookup').addEventListener("submit", getOrder)
</script>