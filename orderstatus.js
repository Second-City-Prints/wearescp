function SCP__createForm(container, options = {
        faqURL: 'https://secondcityprints.zendesk.com/hc/en-us',
        contactURL: 'https://secondcityprints.zendesk.com/hc/en-us/requests/new',
        notice: ''
    }) {
    let containerEl = document.querySelector(container)

    let formCSS = document.createElement('link')
    formCSS.href = "https://wearescp.com/orderstatus.css"
    formCSS.rel = "stylesheet"
    containerEl.appendChild(formCSS)

    containerEl.insertAdjacentHTML('afterbegin', `
    <form class="orderlookup" id="orderform">
        <label for="email">Email Address</label>
        <input type="text" id="email" name="email" placeholder="Email">
        <label for="order">Order Number</label>
        <input type="text" id="order" name="order" placeholder="Order Number">
        <input type="submit" class="button" value="Find My Order">
    </form>
    <output class="orderdetails" id="orderoutput"></output>
    <div id="guide">
        <div id="orderdirections">
            <p>In order to retrieve your order information, please enter...</p>
            <ol>
                <li>Your email address used for checkout</li>
                <li>Your order number</li>
            </ol>
        </div>
        <div class="ordersupport">
            <em>Still have questions about your order?</em>
            <span>
                <a class="button" href="${options.faqURL}" target="_blank">FAQ</a>
                <a class="button" href="${options.contactURL}" target="_blank">Contact Us</a>
            </span>
            ${options.notice}
        </div>
    </div>
    `)

    document.querySelector('#orderform').addEventListener("submit", SCP__getOrder)
}

function SCP__getOrder(event) {
    event.preventDefault()
    var form = document.querySelector('#orderform')
    var data = new FormData(form)
    var output = document.querySelector('#orderoutput')

    //reset and validation
    output.innerHTML = ""
    if(!data.get('email').includes('@') || (!data.get('email') && !data.get('order'))) {
        output.insertAdjacentHTML('beforeend', `<div><span>ERROR</span><br>You need to enter a valid email and order number</div>`)
    }

    //if the output doesn't have an error, continue with the fetch
    if(output.innerHTML == "") {
        form.classList.add('fetching') //locks out user from hitting anything in the form while active
        fetch(`https://fulfilpreorderupdate.scporderlookup.ksws.workers.dev/?email=${encodeURIComponent(data.get('email').trim())}&order=${encodeURIComponent(data.get('order').trim())}`).then(res=>res.json().then(data=>{ //gets the JSON from the worker
            output.insertAdjacentHTML('beforeend', `<div class='outputblock'>${SCP__getShipmentDisplayString(data)}</div>`)

            //remove directions if successful
            if(!data.error) {
                document.querySelector('#orderdirections').classList.add('hide')
            }

            form.classList.remove('fetching')           
        }))
    }
}

//returns an HTML block for all the given data
function SCP__getShipmentDisplayString(data) {
    var shipTo, state, tracking, items, error, shipments, service
    for (const key in data) {
        var field = data[key]
        
        //goes through any returned data and formats it appropriately
        switch(key) {
            case 'shipto': 
                shipTo = `<div class="ordership"><span>Shipping To:</span>${field}</div>`
            break

            case 'state': 
                let shipDate
                if(data.date) {
                    //formats like "Oct. 09, 2023"
                    dateSplit = new Date(data.date).toDateString().split(" ").splice(1, 3)
                    shipDate = `<span class="orderdate">Estimated to ship the week of ${dateSplit[0]}. ${dateSplit[1]}, ${dateSplit[2]}</span>`
                }

                state = `<div class="orderstate"><span>Status: ${field.toUpperCase()}</span> ${shipDate ? shipDate : ''}`
                switch(field) { //if the order is unshipped, we add an extra message - if not, we just close it
                    case 'unshipped':
                        state = state.replace('UNSHIPPED', 'AWAITING SHIPMENT')
                        state += `<em>Your order is either still on pre-order, or pending shipment in our shipping queue. All in-stock orders take 10-14 business days to process before shipment. Pre-order ship times vary by product — please refer to the product page for the expected ship date.<br><br>You will receive a shipping confirmation email with your tracking information as soon as your order has been picked up from our warehouse, and it will be viewable here as well.</em></div>`
                    break

                    case 'splitship':
                        state = state.replace('SPLITSHIP', 'SPLIT SHIPPING')
                        state += `<em>Items in your order are shipping separately.</em></div>`
                    break

                    default:
                        state += '</div>'
                }
            break

            case 'service': 
                service = `<div class="shipservice"><span>Requested Shipping Method</span>${field}</div>`
            break

            case 'tracking': 
                tracking = `<div class="ordertracking"><a href="${field}" class="button" target="_blank">TRACKING</a></div>`
            break

            case 'items':
                items = '<div class="orderitems"><span>Items in this shipment</span>'
                field.forEach(item=>{
                    items += `<div class="orderitem">x${item.quantity} - ${item.name} - <span class="price">${item.price}</span></div>`
                })
                items += '</div>'
            break

            case 'error':
                error = `<div class="error"><span>ERROR</span>${field.toUpperCase()}`
                if(field.includes('Order not found')) {
                    error+= `
                    <div class="chint">
                        <span>Here are a few suggestions:</span>
                        <ul>
                            <li>Double check for typos!</li>
                            <li>
                                If your confirmation email includes a transaction number, try using that instead. If it's there, <a onclick="document.querySelector('#hintimg').classList.remove('hide')">it will look like this</a>.
                                <img src="https://wearescp.com/img/orderstatus/chexample.png" id="hintimg" class="hide" alt="a combination of numbers and letters following the word Transaction">
                            </li>
                            <li>If it's still not working, or you never got this info at all, reach out to customer support below.</li>
                        </ul>
                    </div>`
                }
                error += "</div>"
            break

            case 'shipments':
                shipments = "<div class='shipments'>"
                field.forEach((shipment, i)=>{
                    shipments += `<div class='outputblock'><span>Shipment #${i + 1}</span>${SCP__getShipmentDisplayString(shipment)}</div>`
                })                    
                shipments += "</div>"
            break
        }
    }

    //Adds all of the fields whether they were defined or not to the output, replacing undefined ones with empty strings
    return `${error || ""}${state || ""}${items || ""}${service || ""}${shipTo || ""}${tracking || ""}${shipments || ""}`
}