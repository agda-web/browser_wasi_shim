#!/bin/sh
sed -i -e "s|https://esm.sh/gh/haskell-wasm/browser_wasi_shim|./dist/index.js|" index.html
sed -i -e 's|<head>|<head><script type="importmap">{"imports":{"spsc/reader": "/node_modules/spsc/dist/reader.js","spsc/writer": "/node_modules/spsc/dist/writer.js"}}</script>|' index.html
