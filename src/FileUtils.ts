import {join, normalize} from "https://deno.land/std@0.128.0/path/mod.ts";
import {ILoadOptions} from "./config.ts";


/**
 * 
 * @param opts 
 * @returns path of found or created file
 */
export function findOrCreateFile (opts: ILoadOptions): string
{

	// if path is given, check if file exists
	if (opts.searchDir)
	{
		const joinedPath = join(opts.searchDir, opts.filename);

		// check if file exists, else create file with no content
		if (!existsFileSync(joinedPath))
			writeFile(joinedPath, "");

		return joinedPath;
	}

	// if no path is given, we want to search every directory
	const searchPath = deepSearchFile(opts);

	// we found a file with the same name, return path
	if (searchPath) return searchPath;

	// by default we use the 
	return join("/", opts.filename);
};

/**
 * 
 * @param opts 
 * @returns 
 */
export function deepSearchFile (opts: ILoadOptions): string | undefined
{
	const searchDir = opts.searchDir || "/";
	const joinedPath = join(searchDir, opts.filename);

	if (existsFileSync(joinedPath))
		return joinedPath;

	//TODO: catch any errors while trying to find file
	for (const dirEntry of Deno.readDirSync(searchDir))
	{
		if (dirEntry.isFile)
		{
			if (opts.filename === dirEntry.name)
			{
				return join(searchDir, dirEntry.name);
			}
		}

		if (dirEntry.isDirectory)
		{
			return deepSearchFile({filename: opts.filename, searchDir: join(searchDir, dirEntry.name)});
		}
	}

	return undefined;
}

export function existsFileSync (filePath: string): boolean
{
	try
	{
		Deno.lstatSync(filePath); return true;
	} catch (err)
	{
		if (err instanceof Deno.errors.NotFound)
		{
			return false;
		} throw err;
	}
}


export function writeFile (path: string, content: any) 
{
	path = normalize(path);
	// create string from object, and make string pretty
	const stringContent = content === "" ? "" : JSON.stringify(content, null, "\t");

	//TODO: handle errors when writing text to file
	Deno.createSync(path);
	Deno.writeTextFileSync(path, stringContent);
}
