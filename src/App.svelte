<script>
  import Search from './Search.svelte';
  import SearchResults from './SearchResults.svelte';
  import LoadingIndicator from './LoadingIndicator.svelte';
  import getYoutuberImpact, {formatImpactToMegaTonne} from './utils';

  const API_KEY = 'AIzaSyARlXXxj0gxA3MlhQ9YEPqUnZ9vGVKVoRM';

  let searchQuery = '';
  let selectedYoutuber = null;
  let searchTerm = null;
  let searchResults = [];
  let isLoading = false;

  function handleSubmit() {
    searchTerm = searchQuery.trim();
    searchResults = [];

    if (!searchTerm) return;

    searchChannel();
  }

  function handleSelectYoutuber(id, title) {
    selectedYoutuber = {id, title};
    isLoading = true
    $: getYoutuberImpact(id).then(impact => {selectedYoutuber = {...selectedYoutuber, impact}; isLoading = false;});
  }

  function searchChannel() {
    isLoading = true;

    const endpoint =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&q=${searchTerm}&type=channel`;

    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.items.length === 0) {
          alert("No users were found for your search query.")
          return;
        }

		searchResults = data.items;})
      .catch(() => alert("An error occured!"))
      .finally(() => {
        isLoading = false;
      });
  }
</script>

<style>
  .App {
    width: 100%;
    max-width: 1500px;
    padding: 20px;
    margin: 0 auto 50px;
    text-align: center;
  }

  h1 {
    font-size: 50px;
    margin-top: 30px;
    margin-bottom: 30px;
  }
</style>

<main class="App">
  <h1>Planet Youtube app</h1>
  {#if selectedYoutuber}
    <h2>{selectedYoutuber.title}</h2>
    {#if selectedYoutuber.impact}
      <p>{formatImpactToMegaTonne(selectedYoutuber.impact)}</p>
    {/if}
    <div class="loading-indicator">
      {#if isLoading}
        <LoadingIndicator />
      {/if}
    </div>
    <button on:click={() => {selectedYoutuber = null; searchQuery = '';}}>
    RESET
    </button>
  {:else}
    <Search bind:query={searchQuery} handleSubmit={handleSubmit} />
    <SearchResults results={searchResults} handleSelectYoutuber={handleSelectYoutuber}/>
  {/if}
</main>