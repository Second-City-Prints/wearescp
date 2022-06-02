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

<script>
    function getOrder(event) {
        event.preventDefault()
        var form = document.querySelector('form#orderlookup')
        var data = new FormData(document.querySelector('#orderlookup'))
        var output = document.querySelector('.orderdetails')
        var shipTo, state, tracking, items, error

        //reset and validation
        output.innerHTML = ""
        if(!data.get('email').includes('@') || (!data.get('email') && !data.get('order'))) {
            output.insertAdjacentHTML('beforeend', `<div><span>ERROR</span>You need to enter a valid email and order number</div>`)
        }

        //if the output doesn't have an error, continue with the fetch
        if(output.innerHTML == "") {
            form.classList.add('fetching') //locks out user from hitting anything in the form while active
            fetch(`https://scporderlookup.ksws.workers.dev/?email=${encodeURIComponent(data.get('email'))}&order=${encodeURIComponent(data.get('order'))}`).then(res=>res.json().then(data=>{ //gets the JSON from the worker
                for (const key in data) {
                    var field = data[key]
                    
                    //goes through any returned data and formats it appropriately
                    switch(key) {
                        case 'shipto': 
                            shipTo = `<div><span>Shipping To:</span>${field}</div>`
                        break

                        case 'state': 
                            state = `<div><span>Shipping State: ${field.toUpperCase()}</span>`
                            switch(field) { //if the order is unshipped, we add an extra message - if not, we just close it
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
                                <div class="chint">
                                    <span>If your confirmation email includes a transaction number, try using that instead!<br>It will look like this in your order confirmation email:</span>
                                    <img src="/img/orderstatus/chexample.png" alt="a combination of numbers and letters following the word Transaction">
                                    <span>If you don't have one or it still doesn't work, and you've made sure there are no typos, reach out to our customer support below!</span>
                                </div>`
                            }
                            error += "</div>"
                        break
                    }
                }

                //Adds all of the fields whether they were defined or not to the output, replacing undefined ones with empty strings
                output.insertAdjacentHTML('beforeend', `${error || ""}${state || ""}${shipTo || ""}${tracking || ""}${items || ""}`)
                form.classList.remove('fetching')           
            }))
        }
    }
    document.getElementById('orderlookup').addEventListener("submit", getOrder)
</script>