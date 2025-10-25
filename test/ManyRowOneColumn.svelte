<script lang="ts">
import VirtualTable, {type Item} from "../src/VirtualTable.svelte";

interface Column {
  name: string;
  width: number;
}

let scrollLeft: number = 0;
let scrollTop: number = 0;

const columns: Column[] = [
  {name: '#', width: 50},
  {name: 'Index', width: 150},
]

const items: Item[] = Array.from({length: 20000000}, (_, i) => ({
  rowHeight: getRowHeight(i),
  values: [(i + 1).toLocaleString()]
}));

let totalWidth: number = columns.reduce((acc, x) => acc + x.width, 0);

let startIndex: number = 0;
let endIndex: number = 0;

function getRowHeight(rowIndex: number) {
  // Simulate variable heights
  if ((rowIndex % 10) === 0) {
    return 28 * 2;
  } else {
    return 28;
  }
}
</script>

<div class="container">
  <div>Rows: {startIndex + 1} - {endIndex + 1}, total: {items.length}</div>
  <VirtualTable
    let:item
    let:index
    bind:startIndex
    bind:endIndex
    items={items}
    initialScrollLeft={scrollLeft}
    initialScrollTop={scrollTop}
    onBottomReached={() => {
      console.log("onBottomReached")
    }}
    onScrolled={(scrollLeft_, scrollTop_) => {
      scrollLeft = scrollLeft_;
      scrollTop = scrollTop_;
    }}
  >
    <div slot="header" class="header" style="min-width: {totalWidth}px;width: {totalWidth}px;max-width: {totalWidth}px;">
      {#each columns as column, index (index)}
        <div style="min-width: {column.width}px;width: {column.width}px;max-width: {column.width}px;" class:sticky-column={index === 0} >{column.name}</div>
      {/each}
    </div>
    <div class="row" style="height: {item.rowHeight}px;">
      {#each columns as column, colIndex (colIndex)}
        <div style="min-width: {column.width}px;width: {column.width}px;max-width: {column.width}px;" class:number={colIndex === 0} class:sticky-column={colIndex === 0}>
          {#if colIndex === 0}
            {index + 1}
          {:else}
            {item.values[colIndex - 1]}
          {/if}
        </div>
      {/each}
    </div>
  </VirtualTable>
</div>

<style>
  .container {
    height: 400px;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    border: 2px solid #333;
    position: relative;
    margin: 10px;
  }

  .header {
    border-left: 1px #ccc solid;
    font-size: 16px;
    display: flex;
    align-items: stretch;
    font-weight: bold;
    white-space: pre;
  }

  .header > div {
    display: block;
    box-sizing: border-box;
    padding: 4px;
    background: #eee;
    border-top: 1px #ccc solid;
    border-right: 1px #ccc solid;
    border-bottom: 1px #ccc solid;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;
  }

  .row {
    font-size: 16px;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    border-left: 1px #ccc solid;
  }

  .row > div {
    box-sizing: border-box;
    padding: 4px;
    border-right: 1px #ccc solid;
    border-bottom: 1px #ccc solid;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row > div.number {
    background-color: #eee;
  }

  .sticky-column {
    position: sticky;
    left: 0;
    z-index: 10;
  }
</style>
