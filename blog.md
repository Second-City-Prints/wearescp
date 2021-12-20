---
layout: inner
title: SCP News
---

<div class="blog">
  {% for post in site.posts %}
    <div class="post">
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <div class="md">
        {{ post.excerpt }}
      </div>
    </div>
  {% endfor %}
</div>