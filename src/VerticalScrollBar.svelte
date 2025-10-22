<script lang="ts">

export let totalHeight: number
export let scrollTop: number
export let onScrolled: ((scrollTop: number) => void) | null = null

let scrollbar: HTMLElement;
let bar: HTMLElement;
let localScrollTop: number = 0
let viewportHeight: number = 0
let barHeight: number = 0
let isDragging: boolean = false
let viewportTop: number = 0
let deltaBarY: number = 0

$: computeBarHeight(totalHeight, viewportHeight);

function setScrollTop(scrollTop_: number) {
  scrollTop = Math.min(totalHeight - viewportHeight, Math.max(scrollTop_, 0));

  if (onScrolled) {
    onScrolled(scrollTop);
  }
}

export function scrollBy(dy: number) {
  setScrollTop(scrollTop + dy);
}

function computeBarHeight(totalHeight: number, viewportHeight: number) {
  if (viewportHeight === 0) {
    barHeight = 0
    return
  }

  barHeight = Math.max((viewportHeight / totalHeight) * viewportHeight, 10);
}

function onMouseDown(e: MouseEvent) {
  isDragging = true;
  document.body.style.userSelect = 'none';
  viewportTop = scrollbar.getBoundingClientRect().top;
  const barTop = bar.getBoundingClientRect().top;
  deltaBarY = e.clientY - barTop;
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return;

  const y = e.clientY - viewportTop - deltaBarY;
  const maxLocalScrollTop = viewportHeight - barHeight;

  localScrollTop = Math.max(Math.min(y, maxLocalScrollTop), 0);

  const preciseScrollTop = localScrollTop + (barHeight * localScrollTop / maxLocalScrollTop)
  const newScrollTop = (totalHeight - viewportHeight) * preciseScrollTop / viewportHeight

  setScrollTop(newScrollTop);
}

function onMouseUp() {
  isDragging = false;
  document.body.style.userSelect = '';
}
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp}/>
<div
  class="scrollbar"
>
  <div
    class="scrollbar-content"
    bind:this={scrollbar}
    bind:offsetHeight={viewportHeight}
  >
    <div
      bind:this={bar}
      class="bar"
      on:mousedown={onMouseDown}
      style="min-height: {barHeight}px;height: {barHeight}px;max-height: {barHeight}px;top: {localScrollTop}px;"
    ></div>
  </div>
</div>

<style>
  .scrollbar {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 16px;
    background-color: #FAFAFA;
    min-width: 13px;
    max-width: 13px;
    width: 13px;
    z-index: 9998;
    border: 1px solid #E8E8E8;
    padding: 2px;
    font-size: 0;
  }

  .scrollbar-content {
    box-sizing: border-box;
    position: relative;
    min-width: 9px;
    max-width: 9px;
    width: 9px;
    height: 100%;
  }

  .bar {
    box-sizing: border-box;
    position: absolute;
    background-color: #C1C1C1;
    border-radius: 4px;
    overflow: hidden;
    min-width: 9px;
    max-width: 9px;
    width: 9px;
    z-index: 9999;
  }

  .bar:hover {
    background-color: #aaa;
  }
</style>
