<script lang="ts" context="module">
export interface Item {
  values: any[]
  rowHeight: number
}
</script>
<script lang="ts">
import {onMount} from 'svelte';

export let items: Item[];
export let initialScrollLeft: number = 0;
export let initialScrollTop: number = 0;
export let onBottomReached: (() => void) | null = null;
export let onScrolled: ((scrollLeft: number, scrollTop: number) => void) | null = null;

let bottomElement: HTMLElement;

// read-only, but visible to consumers via bind:start
export let startIndex = 0;
export let endIndex = 0;

interface Visible {
  index: number,
  item: Item
}

// local state
let viewport: HTMLDivElement;
let viewportHeight: number = 0;
let stickyHeaderHeight: number = 0;
let visible: Visible[] = [];

let cumulativeHeight: number[] = [];

const MAX_SCROLLABLE_AREA = 16000000; // Chrome cannot have a div, padding, or anything larger than 16,777,200px
let contentTop: number = 0;

$: {
  visible = items.slice(startIndex, endIndex + 1).map((item, i) => {
    return { index: i + startIndex, item };
  });
}

$: if (viewport) {
  cumulativeHeight.length = items.length;
  for (let i = 0; i < items.length; i++) {
    cumulativeHeight[i] = items[i].rowHeight + (i > 0 ? cumulativeHeight[i-1] : 0);
  }
  refresh(items);
}

// We don't track viewport's height directly because it can flicker by 1px when its children's dimensions change.
// We've encountered this anecdotally when the height is high (~16,000,000px)
export function updateViewportDimension() {
  refresh(items)
}

function refresh(_items: Item[]) {
  viewport.scrollTop = initialScrollTop;
  viewport.scrollLeft = initialScrollLeft;
  handleScroll()
}

// The binary search is needed. The flickering while scrolling would be noticeable at >1,000,000 items if we were to use
// a brute-force search.
function findItemIndexByTop(top: number) {
  let left = 0;
  let right = items.length - 1;
  let newStartIndex: number | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midHeight = cumulativeHeight[mid];

    if (midHeight > top) {
      newStartIndex = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  // If we found an index, we need to ensure it's the first one that exceeds trueScrollTop
  while (newStartIndex !== null && newStartIndex > 0 && cumulativeHeight[newStartIndex - 1] > top) {
    newStartIndex--;
  }

  return newStartIndex;
}

async function handleScroll() {
  let { scrollLeft, scrollTop } = viewport;
  let scrollableHeight = Math.min(cumulativeHeight[items.length - 1], MAX_SCROLLABLE_AREA)
  let contentViewHeight = viewportHeight - stickyHeaderHeight;

  let trueTop: number = Math.ceil(cumulativeHeight[items.length - 1] * scrollTop / (scrollableHeight - contentViewHeight));

  let newStartIndex = findItemIndexByTop(trueTop);

  if (newStartIndex !== null) {
    startIndex = newStartIndex;
    endIndex = findItemIndexByTop(trueTop + contentViewHeight) || items.length - 1;
    let deltaTop = trueTop - (cumulativeHeight[newStartIndex] - items[newStartIndex].rowHeight);
    contentTop = scrollTop - deltaTop;
  }

  if (
    newStartIndex === null ||
    (cumulativeHeight[endIndex] - cumulativeHeight[newStartIndex] + items[newStartIndex].rowHeight) < contentViewHeight
  ) {
    // Handle over-scrolling by simply showing the last rows according to the contentViewHeight.
    // If this wasn't handled, it would flicker due to an over-scrolled position.
    endIndex = items.length - 1;
    newStartIndex = endIndex
    while (newStartIndex > 0) {
      if ((cumulativeHeight[endIndex] - cumulativeHeight[newStartIndex] + items[newStartIndex].rowHeight) < contentViewHeight) {
        newStartIndex--;
      } else {
        break
      }
    }

    startIndex = newStartIndex;
    trueTop = cumulativeHeight[startIndex] - items[startIndex].rowHeight
    let deltaTop = (cumulativeHeight[endIndex] - cumulativeHeight[startIndex] + items[startIndex].rowHeight) - contentViewHeight
    contentTop = scrollableHeight - contentViewHeight - deltaTop;
  }

  if (onScrolled) {
    onScrolled(scrollLeft, scrollTop);
  }
}

onMount(() => {
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
  bind:offsetHeight={viewportHeight}
  class="virtual-table"
  onscroll={handleScroll}
>
  {#if hasHeaderSlot}
    <!-- we need the header here because overflow: visible auto; isn't a valid combination. Therefore, the header cannot be outside of this component. -->
    <!-- We wouldn't be able to support scrolling to the right where both rows and the header scroll together -->
    <!-- The header must be sticker with top-0 -->
    <div bind:offsetHeight={stickyHeaderHeight} class="virtual-table-header">
      <slot name="header" />
    </div>
  {/if}
  <div
    class="virtual-table-content"
    style="height: {Math.min(cumulativeHeight[items.length - 1], MAX_SCROLLABLE_AREA)}px;"
  >
    <div style="position: absolute; top: {contentTop}px; left: 0;">
    {#each visible as row (row.index)}
      <div
        class="virtual-table-row"
        style="height: {row.item.rowHeight}px; min-height: {row.item.rowHeight}px; max-height: {row.item.rowHeight}px;"
      >
        <slot item={row.item} index={row.index}>Missing template</slot>
      </div>
    {/each}
    <div bind:this={bottomElement} class="virtual-table-bottom"></div>
    </div>
  </div>
</div>
