---
layout: inner
title: SCP News
---

<div class="blog">
  {% for post in site.posts %}
    <div class="post">
      <h2><a href="{{ post.url }}">{{ post.title }} <span>{{ post.date | date_to_string }}</span></a></h2>
      <div class="md">
        {{ post.excerpt }}
      </div>
      <center><a href="{{ post.url }}" class="readmore">Read More</a></center>
    </div>
  {% endfor %}
</div>