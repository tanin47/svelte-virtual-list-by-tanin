Svelte's Virtual List
=======================

A virtual list component for Svelte. It only renders the data that is visible on screen. This means you can scroll
through millions of rows without any perf issue.

This is an improved version of https://github.com/sveltejs/svelte-virtual-list (@sveltejs/svelte-virtual-list). It was
initially built for [Backdoor](https://github.com/tanin47/backdoor), A Postgres Data Querying and Editing Tool that you 
can embed into your JVM app.

Here are the improvements:

1. Support as many rows as your browser's memory allows.
2. Support variable height for each row.
3. Support optional sticky top rows and sticky left columns.
4. Support the detection of reaching the bottom. This is useful for supporting a load-more mechanism.
5. Support wider rows with the horizontal scrollbar.
6. Support saving the scroll positions on both axes in the case where you want to restore the previous scroll positions.
7. Support row index.

The caveats:
* You must provide the exact height of *every* row and the exact width of *every* column. This can be easily done using `canvas` and `measureText`.
* The row height can be changed but needs a full refresh.
* The row height and column width should be whole numbers. In the case of >500,000 rows, we've encountered a rendering issue if the numbers aren't whole.

The test page generates 20,000,000 rows with a single column. The scrolling is smooth on Mac M4.

Installation
-------------

`npm install @tanin/svelte-virtual-list`

Usage
------


Development
------------

1. Run `npm install`
2. Run `./node_modules/.bin/rollup -cw` to build the dev version that will auto-compile changes.
3. Visit `./test/index.html'

Test
-----

1. Scrolling up to the top and seeing the first row
2. Scrolling down to the bottom and see the last row.
