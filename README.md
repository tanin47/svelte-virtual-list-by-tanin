Svelte's Virtual List
=======================

A virtual list component for Svelte. It only renders the data that is visible on screen. This means you can scroll
through millions of rows without any perf issue.

This is an improved version of https://github.com/sveltejs/svelte-virtual-list (@sveltejs/svelte-virtual-list). It was
initially built for [Backdoor](https://github.com/tanin47/backdoor), A Postgres Data Querying and Editing Tool that you 
can embed into your JVM app.

Here are the improvements:

1. Implement a custom scrollbar that supports the total height of ~9,000,000,000,000,000px.
  * Without the custom scrollbar, the max total height is, in theory, ~33,000,000px.
  * The original Svelte's virtual list can only support the total height of 16,777,200px (the max padding in Chrome).
2. Support variable height for each row.
3. Support sticky top rows and sticky left columns.
4. Support the detection of reaching the bottom. This is useful for supporting a load-more mechanism.
5. Support wider rows with the horizontal scrollbar.
6. Support saving the scroll positions on both axes.
7. Support row index.

The caveats:
* You must provide the exact height of each row and the exact width of each column. This can be easily done using `canvas` and `measureText`.
* The row height can be changed but needs a full refresh.
* The scrollbar is custom and may not look native in some browsers.

The test page generates 80,000,000 rows with the total height of X.

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
