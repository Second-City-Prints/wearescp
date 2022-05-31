---
layout: inner
title: Order Status
---

<div class="contact">
  <form id="orderlookup">
    <label for="email">Email Address</label>
    <input type="text" id="email" name="email" placeholder="Email">

    <label for="order">Transaction ID or Order #</label>
    <input type="text" id="order" name="order" placeholder="Order Number">

    <input type="submit" class="button" value="Find My Order">
  </form>
  <output class="orderdetails">

  </output>
</div>

<script>
    function getOrder(event) {
        event.preventDefault()
        var data = new FormData(document.querySelector('#orderlookup'))
        var output = document.querySelector('.orderdetails')
        fetch(`https://scporderlookup.ksws.workers.dev/?email=${data.get('email')}&order=${data.get('order')}`).then(res=>res.json().then(data=>{
            output.innerText = JSON.stringify(data)
        }))
    }
    document.getElementById('orderlookup').addEventListener("submit", getOrder)

</script>