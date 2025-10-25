<script lang="ts">
import VirtualTable, {type Item} from "../src/VirtualTable.svelte";

let scrollLeft: number = 0;
let scrollTop: number = 0;

const columns: any[] = [
  {name: 'Username', width: 100},
  {name: 'Address', width: 350},
  {name: 'Email', width: 150},
  {name: 'Random number', width: 100}
]

const items: Item[] = Array.from({length: 80}, (_, i) => ({
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
  if ((rowIndex % 10) === 0) {
    return 28 * 2;
  } else {
    return 28;
  }
}
</script>

<div class="container">
  <div>Indices: {startIndex} - {endIndex}, total: {items.length}</div>
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
    <div slot="header" class="header">
      {#each columns as column, index (index)}
        <div style="min-width: {column.width}px;width: {column.width}px;max-width: {column.width}px;">{column.name}</div>
      {/each}
    </div>
    <div class="row" style="height: {item.rowHeight}px;">
      {#each columns as column, colIndex (colIndex)}
        <div style="min-width: {column.width}px;width: {column.width}px;max-width: {column.width}px;">
          {item.values[colIndex]}
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
</style>
