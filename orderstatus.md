---
layout: inner
title: Order Status
---

<div id="ordertool">
    {% assign cacheBust = site.time | date:'?v=%s' %}
    <link type="text/css" rel="stylesheet" href="{{ "/orderstatus.css" | relative_url | append: cacheBust }}">
	<script src="{{ "/orderstatus.js" | relative_url | append: cacheBust }}"></script>
    <script>
        SCP__createForm('#ordertool')
    </script>
</div>

