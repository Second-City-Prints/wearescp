---
layout: inner
title: Careers
---

<div class="careers">
  <div class="md">
    <h2>ARE YOU SCP?</h2>
    {{ site.data.careers.careers | markdownify }}

    <center>
      <a href="{{ site.data.careers.officebuttonurl }}" class="cta" target="_blank">
        {{ site.data.careers.officebutton }}
        <span>{{ site.data.careers.officebuttonsub }}</span>
      </a>

      <a href="{{ site.data.careers.warehousebuttonurl }}" class="cta" target="_blank">
        {{ site.data.careers.warehousebutton }}
        <span>{{ site.data.careers.warehousebuttonsub }}</span>
      </a>
    </center>
  </div>
</div>
