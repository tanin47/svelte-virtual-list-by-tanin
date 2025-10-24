<script lang="ts">
import VirtualTable, {type Item} from "svelte-virtual-table";

interface Column {
  name: string;
  width: number;
}

let scrollLeft: number = 0;
let scrollTop: number = 0;

const columns: Column[] = [
  {name: '#', width: 50},
  {name: 'Username', width: 100},
  {name: 'Address', width: 350},
  {name: 'Email', width: 150},
  {name: 'Random number', width: 100}
]

const items: Item[] = Array.from({length: 1000000}, (_, i) => ({
  rowHeight: getRowHeight(i),
  values: [
    `User ${i + 1}`,
    `Address ${i + 1}, Street ${i + 1}, City ${i + 1}`,
    `user${i + 1}@email.com`,
    `${i + 13284098324}`.padStart(10, '0')
  ]
}));

let startIndex: number = 0;
let endIndex: number = 0;

function getRowHeight(rowIndex: number) {
  // Simulate variable heights
  if (((rowIndex + 1) % 13) === 0) {
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
    <div class="row" style="height: {item.rowHeight}px;" class:first-row={startIndex === 0}>
      {#each columns as column, colIndex (colIndex)}
        <div style="min-width: {column.width}px;width: {column.width}px;max-width: {column.width}px;">
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
    height: 373px;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    border: 2px solid #333;
    position: relative;
    margin: 10px;
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

  .first-row {
    border-top: 1px #ccc solid;
  }
</style>
