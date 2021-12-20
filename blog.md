---
layout: inner
title: SCP News
---

<div class="blog">
  {% for post in site.posts %}
    <div class="post">
      <h2><a href="{{ post.url }}">{{ post.title }} <span>{{ post.date | date_to_string }}</span></a></h2>

      <a href="{{ post.url }}" class="previewbanner">
        {% if post.featured_image.sizing != "auto" %}
        <span class="postbanner" style="background-image: url('{{ post.featured_image.src }}'); background-size: {{ post.featured_image.sizing }}"> {{ page.featured_image.alt }} </span>
        {% else %}
        <img class="postbanner" src="{{ post.featured_image.src }}" alt="{{ post.featured_image.alt }}">
        {% endif %}
      </a>

      <div class="md">
        {{ post.excerpt }}
      </div>
      <center><a href="{{ post.url }}" class="readmore">Read More</a></center>
    </div>
  {% endfor %}
</div>