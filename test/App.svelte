<script lang="ts">
import ManyRowOneColumn from './ManyRowOneColumn.svelte';
import ManyRowManyColumn from './ManyRowManyColumn.svelte';
import ManyRowManyColumnNoSticky from './ManyRowManyColumnNoSticky.svelte';
import FewRowManyColumn from './FewRowManyColumn.svelte';
import NoScrollBoth from "./NoScrollBoth.svelte";
import NoScrollHorizontal from "./NoScrollHorizontal.svelte";
import NoScrollVertical from "./NoScrollVertical.svelte";
import Simplest from "./Simplest.svelte";

let tab: '20m' | '400k' | '800k' | '1m' | '1m_no_sticky' | 'smalls' = 'smalls'
</script>

<div class="gallery">
  <div class="tabs">
    <button onclick={() => {tab = 'smalls'}} disabled={tab === 'smalls'}>View the small tables</button>
    <button onclick={() => {tab = '400k'}} disabled={tab === '400k'}>View the 400k-row table (&lt;16,777,200px)</button>
    <button onclick={() => {tab = '800k'}} disabled={tab === '800k'}>View the 800k-row table (slight over 16,777,200px)</button>
    <button onclick={() => {tab = '1m'}} disabled={tab === '1m'}>View the 1-million-row table (&gt;16,777,200px)</button>
    <button onclick={() => {tab = '1m_no_sticky'}} disabled={tab === '1m_no_sticky'}>View the 1-million-row tables with no sticky (&gt;16,777,200px)</button>
    <button onclick={() => {tab = '20m'}} disabled={tab === '20m'}>View the 20-million-row table (it may take time to load)</button>
  </div>
  {#if tab === '20m'}
    <ManyRowOneColumn />
  {:else if tab === '400k'}
    <ManyRowManyColumn count={400000} />
  {:else if tab === '800k'}
    <ManyRowManyColumn count={800000} />
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
