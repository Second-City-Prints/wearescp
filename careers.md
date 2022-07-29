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

      <!--
      <a href="{{ site.data.careers.warehousebuttonurl }}" class="cta" target="_blank">
        {{ site.data.careers.warehousebutton }}
        <span>{{ site.data.careers.warehousebuttonsub }}</span>
      </a>
      -->

      <p style="margin-top: 2em">You can also view our warehouse jobs here:</p>
    </center>
    <a href="/c/Scp/Jobs?absolute=1&amp;hiring_company=aeb13725" id="jobs_widget_company_link" target="_blank">Job search at SCP</a><script src="https://www.ziprecruiter.com/jobs-widget/v1/23f3e4f4/all?show_posted_days=0"></script><a href="https://www.ziprecruiter.com/" id="jobs_widget_link_split" target="_blank">ZipRecruiter Jobs</a>

  </div>
</div>
