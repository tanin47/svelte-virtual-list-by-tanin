<script lang="ts">
import ManyRowOneColumn from './ManyRowOneColumn.svelte';
import ManyRowManyColumn from './ManyRowManyColumn.svelte';
import ManyRowManyColumnNoSticky from './ManyRowManyColumnNoSticky.svelte';
import FewRowManyColumn from './FewRowManyColumn.svelte';
import NoScrollBoth from "./NoScrollBoth.svelte";
import NoScrollHorizontal from "./NoScrollHorizontal.svelte";
import NoScrollVertical from "./NoScrollVertical.svelte";
import Simplest from "./Simplest.svelte";

let tab: '20m' | '1m' | '1m_no_sticky' | 'smalls' = '1m'
</script>

<div class="gallery">
  <div class="tabs">
    <button onclick={() => {tab = '1m'}}>View the 1-million-row table</button>
    <button onclick={() => {tab = '1m_no_sticky'}}>View the 1-million-row tables with no sticky</button>
    <button onclick={() => {tab = 'smalls'}}>View the small tables</button>
    <button onclick={() => {tab = '20m'}}>View the 20-million-row table (it may take time to load)</button>
  </div>
  {#if tab === '20m'}
    <ManyRowOneColumn />
  {:else if tab === '1m'}
    <ManyRowManyColumn />
  {:else if tab === '1m_no_sticky'}
    <ManyRowManyColumnNoSticky />
  {:else}
    <Simplest />
    <FewRowManyColumn />
    <NoScrollBoth />
    <NoScrollHorizontal />
    <NoScrollVertical />
  {/if}
</div>

<style>
  .gallery {
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: start;
  }
  .tabs {
    display: flex;
    gap: 10px;
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
