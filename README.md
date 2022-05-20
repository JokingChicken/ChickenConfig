# ChickenConfig

this deno library will help you handle a json file for config purposes.

makes use of a default object, to make type-completion and type-checking possible

---

## Where to get:

get it from deno: [https://deno.land/x/chickenconfig/mod.ts](https://deno.land/x/chickenconfig/mod.ts)

download via import:

```ts
import Config from "https://deno.land/x/chickenconfig/mod.ts";
```

---

## Usage:

```ts
import Config from "https://deno.land/x/chickenconfig/mod.ts";

// checks for file, creates if does not exist
const config = Config.load(
		{
			filename: "config.json",
			searchDir: "./examples/"
		},
		{
			"yourDefaultValue": true
		}
	);


// this reads the file; yourDefaultValue will be true, except when changed in file
// if 'yourDefaultValue' is not the same type as default, it will be overwritten with the default
var configObject = config.read();

configObject.yourDefaultValue = false;

// writes the file; yourDefaultValue will be false
// even if there is a different value in the file, it will only overwrite the default values
config.write();

```

more examples [here](./examples/example.ts)

---
