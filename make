#!/usr/bin/env bash
uglifyjs index.js --compress --mangle --wrap nanoajax -o nanoajax.min.js --preamble \
	'// https://github.com/yanatan16/nanoajax'