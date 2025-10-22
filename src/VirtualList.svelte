<script lang="ts">
import {onMount, tick} from 'svelte';

export let items: any[][];
export let initialScrollLeft: number = 0;
export let initialScrollTop: number = 0;
export let getItemHeight: (index: number) => number;
export let onBottomReached: (() => void) | null = null;
export let onScrolled: ((scrollLeft: number, scrollTop: number) => void) | null = null;

let bottomElement: HTMLElement;

// read-only, but visible to consumers via bind:start
export let start = 0;
export let end = 0;

interface Visible {
  index: number,
  data: any[]
}

// local state
let height_map: number[] = [];
let rows: HTMLCollectionOf<HTMLDivElement>;
let viewport: HTMLDivElement;
let contents: HTMLDivElement;
let viewport_height: number = 0;
let visible: Visible[] = [];
let mounted: boolean = false;

let top = 0;
let bottom = 0;
let average_height: number;

$: visible = items.slice(start, end).map((data, i) => {
  return { index: i + start, data };
});

// whenever `items` changes, invalidate the current heightmap
$: if (mounted) refresh(items, viewport_height);

async function refresh(items: any[], viewport_height: number) {
  const { scrollTop } = viewport;

  await tick(); // wait until the DOM is up to date

  let content_height = top - scrollTop;
  let i = start;

  while (content_height < viewport_height && i < items.length) {
    let row = rows[i - start];

    if (!row) {
      end = i + 1;
      await tick(); // render the newly visible row
      row = rows[i - start];
    }

    const row_height = height_map[i] = getItemHeight(i) || row.offsetHeight;
    content_height += row_height;
    i += 1;
  }

  end = i;

  const remaining = items.length - end;
  average_height = (top + content_height) / end;

  bottom = remaining * average_height;
  height_map.length = items.length;

  await tick();
  viewport.scrollTo(initialScrollLeft, initialScrollTop);
}

async function handle_scroll() {
  const { scrollLeft, scrollTop } = viewport;

  for (let v = 0; v < rows.length; v += 1) {
    height_map[start + v] = getItemHeight(start + v) || rows[v].offsetHeight;
  }

  let i = 0;
  let y = 0;

  while (i < items.length) {
    const row_height = height_map[i] || average_height;
    if (y + row_height > scrollTop) {
      start = i;
      top = y;

      break;
    }

    y += row_height;
    i += 1;
  }

  while (i < items.length) {
    y += height_map[i] || average_height;
    i += 1;

    if (y > scrollTop + viewport_height) break;
  }

  end = i;

  const remaining = items.length - end;
  average_height = y / end;

  while (i < items.length) height_map[i++] = average_height;
  bottom = remaining * average_height;

  if (onScrolled) {
    onScrolled(scrollLeft, scrollTop)
  }
}

// trigger initial refresh
onMount(() => {
  rows = contents.getElementsByTagName('div');
  mounted = true;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (onBottomReached) onBottomReached();
      }
    });
  }, {
    threshold: 0.1,
  });

  if (bottomElement) {
    observer.observe(bottomElement);
  }

  return () => observer.disconnect();
});

const hasHeaderSlot = $$slots.header;
</script>

<div
  bind:this={viewport}
  bind:offsetHeight={viewport_height}
  on:scroll={handle_scroll}
  class="virtual-list"
>
  {#if hasHeaderSlot}
    <!-- we need the header here because overflow: visible auto; isn't a valid combination. Therefore, the header cannot be outside of this component. -->
    <!-- We wouldn't be able to support scrolling to the right where both rows and the header scroll together -->
    <!-- The header must be sticker with top-0 -->
    <slot name="header" />
  {/if}
  <div
    bind:this={contents}
    class="virtual-list-content"
    style="padding-top: {top}px; padding-bottom: {bottom}px;"
  >
    {#each visible as row (row.index)}
      <div
        class="virtual-list-row"
        style="height: {height_map[row.index]}px; min-height: {height_map[row.index]}px; max-height: {height_map[row.index]}px;"
      >
        <slot item={row.data} index={row.index}>Missing template</slot>
      </div>
    {/each}
    <div bind:this={bottomElement} class="absolute bottom-0 left-0 right-0 h-[10px]"></div>
  </div>
</div>

<style>
  .virtual-list {
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    display: block;
    font-size: 0;
  }

  .virtual-list-content {
    position: relative;
    overflow: visible;
    box-sizing: border-box;
    display: block;
    font-size: 0;
  }

  .virtual-list-row {
    display: block;
    box-sizing: border-box;
    font-size: 0;
  }
</style>
