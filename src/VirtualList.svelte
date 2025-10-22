<script lang="ts" context="module">
export interface Item {
  values: any[]
  rowHeight: number
}
</script>
<script lang="ts">
import {onMount, tick} from 'svelte';
import VerticalScrollBar from "./VerticalScrollBar.svelte";

export let items: Item[];
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
  item: Item
}

// local state
let rows: HTMLCollectionOf<HTMLDivElement>;
let viewport: HTMLDivElement;
let scrollbar: VerticalScrollBar;
let body: HTMLDivElement;
let contents: HTMLDivElement;
let viewport_height: number = 0;
let visible: Visible[] = [];
let mounted: boolean = false;

let scrollTop: number = initialScrollTop;
let totalHeight: number = 0;
let cumulativeHeight: number[] = [];

let deltaTop: number = 0;

$: {
  visible = items.slice(start, end).map((item, i) => {
    return { index: i + start, item };
  });
}

// whenever `items` changes, invalidate the current heightmap
$: if (mounted) {
  cumulativeHeight.length = items.length;
  for (let i = 0; i < items.length; i++) {
    cumulativeHeight[i] = items[i].rowHeight + (i > 0 ? cumulativeHeight[i-1] : 0);
  }
  refresh(items, viewport_height);
}

async function refresh(items: Item[], viewport_height: number) {
  const { scrollTop } = viewport;

  await tick(); // wait until the DOM is up to date

  let top = 0;
  let content_height = top - scrollTop;
  let i = start;

  while (content_height < viewport_height && i < items.length) {
    let row = rows[i - start];

    if (!row) {
      end = i + 1;
      await tick(); // render the newly visible row
      row = rows[i - start];
    }

    const row_height = items[i].rowHeight;
    content_height += row_height;
    i += 1;
  }

  end = i;

  let bottom = 0;
  for (let j = end + 1; j < items.length; j++) {
    bottom += items[j].rowHeight;
  }
  totalHeight = top + content_height + bottom;

  await tick();
  viewport.scrollTo(initialScrollLeft, initialScrollTop);
}

const anchorScrollTop = 500

function scrolled() {
  console.log("scrolled " + body.scrollTop);
  const lastScrollTop = body.scrollTop;
  body.scrollTop = anchorScrollTop;
  scrollbar.scrollBy(lastScrollTop - anchorScrollTop);
}

async function handleScroll(scrollTop: number) {
  const { scrollLeft } = viewport;

  let i = 0;
  let y = 0;
  deltaTop = 0;

  while (i < items.length) {
    const row_height = items[i].rowHeight;
    if (y + row_height > scrollTop) {
      start = i;
      deltaTop = scrollTop - y;

      break;
    }

    y += row_height;
    i += 1;
  }

  while (i < items.length) {
    y += items[i].rowHeight;
    i += 1;

    if (y > scrollTop + viewport_height) break;
  }

  end = i;

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
  class="virtual-list"
>
  <div
    bind:this={body}
    class="virtual-list-body"
    onscroll={scrolled}
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
      style="padding-top: {anchorScrollTop * 2}px;height: {viewport_height}padding-bottom: {anchorScrollTop * 2}px;"
    >
      {#each visible as row (row.index)}
        <div
          class="virtual-list-row"
          style="height: {row.item.rowHeight}px; min-height: {row.item.rowHeight}px; max-height: {row.item.rowHeight}px;top: {anchorScrollTop + cumulativeHeight[row.index] - cumulativeHeight[start] - items[row.index].rowHeight - deltaTop}px;}"
        >
          <slot item={row.item} index={row.index}>Missing template</slot>
        </div>
      {/each}
      <div bind:this={bottomElement} class="absolute bottom-0 left-0 right-0 h-[10px]"></div>
    </div>
  </div>
  <VerticalScrollBar
    bind:this={scrollbar}
    {scrollTop}
    {totalHeight}
    onScrolled={handleScroll}
  />
</div>

<style>
  .virtual-list {
    position: relative;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    font-size: 0;
    padding-right: 17px;
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
  }

  .virtual-list-body {
    position: relative;
    flex-grow: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    font-size: 0;
    display: block;
  }

  .virtual-list-content {
    position: relative;
    overflow: visible;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    display: block;
    font-size: 0;
    flex-grow: 1;
  }

  .virtual-list-row {
    position: absolute;
    box-sizing: border-box;
    font-size: 0;
  }
</style>
