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
        <span class="chelp" onclick="javascript:document.querySelector('.chint').classList.toggle('hide')">(It couldn't find my order and I used correct info!)</span>
        <div class="chint hide">
            <span>If your confirmation email includes a transaction number, try using that instead! It will look like this in your order confirmation email:</span>
            <img src="/img/orderstatus/chexample.png" alt="a combination of numbers and letters that starts with ch_">
            <span>If you don't have one or it still doesn't work, reach out to our customer support below!</span>
        </div>
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

.button, input.button {
    padding: 10px;
    background: black;
    color: #da2926;
    display: inline-block;
}

.orderdetails {
    border: 1px solid;
    display: block;
    padding: 10px;
    background: yellow;
    margin: 1em 0;
}

.orderdetails:empty {
    display: none;
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

#guide .chint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 1px solid;
    padding: 10px;
    width: 100%;
    margin: 0.5em auto;
}

#guide .chint.hide {
    display: none;
}

#guide .chint span {
    font-size: 0.9em;
    line-height: 1.1em;
    padding-top: 10px;
    text-align: center;
}

#guide .chint img {
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
        var data = new FormData(document.querySelector('#orderlookup'))
        var output = document.querySelector('.orderdetails')
        fetch(`https://scporderlookup.ksws.workers.dev/?email=${encodeURIComponent(data.get('email'))}&order=${encodeURIComponent(data.get('order'))}`).then(res=>res.json().then(data=>{
            
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const field = data[key]
                    output.insertAdjacentHTML('beforeend', `<span><strong>${key}</strong><br>${field}</span>`)
                }
            }
            
        }))
    }
    document.getElementById('orderlookup').addEventListener("submit", getOrder)

</script>