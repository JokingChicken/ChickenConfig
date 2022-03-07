#!/bin/bash
deno run \
	-A \
	--import-map=src/import_map.json \
	examples/load.config.ts
