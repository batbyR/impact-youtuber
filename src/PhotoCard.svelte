<script>
  export let photo;
</script>

<style>
  .photo-card {
    animation: show 0.5s forwards ease-in-out;
  }

  .photo {
    width: 100%;
    object-fit: cover;
    height: 300px;
    background-color: #ccc;
    margin-bottom: 10px;
  }

  .photographer {
    display: inline-block;
  }

  .photographer a {
    color: #333;
    text-decoration: none;
  }

  .photographer a:hover {
    text-decoration: underline;
  }

  @keyframes show {
    0% {
      opacity: 0;
      transform: translateY(100px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
<li class="photo-card">
  <img class="photo" src={photo.thumbnails.medium.url} alt="">
  <span class="photographer">
    {photo.title}
  </span>
</li>