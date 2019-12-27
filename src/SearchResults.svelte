<script>
  import PhotoCard from './PhotoCard.svelte';

  export let results;
  export let handleSelectYoutuber;

</script>

<style>
  .search-results {
    list-style: none;
    display: grid;
    gap: 40px 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>

<ul class="search-results">
  {#each results as result}
    <button on:click={() => handleSelectYoutuber(result.id.channelId, result.snippet.title)}>
      <PhotoCard photo={result.snippet} />
    </button>
  {/each}
</ul>
