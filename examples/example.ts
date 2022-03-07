/** 
 * this is an example file to show how to use this util
 * run with: deno run -A load.config.ts 
 */

//import Config from "https://deno.land/x/chickenconfig/mod.ts";
import Config from "../mod.ts";

const config1 = await Config.load(
	// what and where to search for config file
	{
		filename: "config.json",
		searchDir: "examples/"
	},

	// this is the default object, for type completion
	{
		defaultValue: true,
		createNew: true,
		exampleObject: {
			numbers: 5,
			strings: "yes"
		}
	}
);

// get the object from the file
// dont do this every time, as typechecking is expensive!
var configObject = config1.get();
console.log("old defaultValue:", configObject.defaultValue);

// set the object to something else
configObject.defaultValue = false;
console.log("new defaultValue:", configObject.defaultValue);

config1.write();


/**
 * -----------------------------------------------------------------------------
 * write to same config with different default values
 */

// we can have a second config, with the same file, but different defaults!
const config2 = await Config.load(
	// what and where to search for config file
	{
		filename: "config.json",
		searchDir: "examples"
	},

	// this time the default object contains only hiddenObject
	//but other values in config are still in returned object
	{
		hiddenObject: {
			isHidden: true
		}
	}
);

const configObject2 = config2.get();

// this should print the old value, because write was not used
console.log("defaultValue:", (configObject2 as any).defaultValue);

configObject2.hiddenObject.isHidden = false;

// we can write, and all non default values will stay in config
config2.write(configObject2);
