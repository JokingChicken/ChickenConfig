import {join, normalize} from "https://deno.land/std@0.128.0/path/mod.ts";

/**
 * user options to search file
 */
interface ILoadOptions
{
	readonly filename: string;
	readonly searchDir?: string;
}


/**
 * tries to find a file in given folder, and with given name
 * 
 * @param opts the options to search for
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
	let searchPath = deepSearchFile(opts);

	// we found a file with the same name, return path
	if (searchPath) return searchPath;

	// by default we use the 
	searchPath = join("/", opts.filename);
	Deno.createSync(searchPath);
	return searchPath;
};

/**
 * search the file in the sub directories 
 * 
 * @param opts the options to search for
 * @returns the found file with requested name, or undefined if not found
 */
export function deepSearchFile (opts: ILoadOptions): string | undefined
{
	const searchDir = opts.searchDir || "/";
	const joinedPath = join(searchDir, opts.filename);

	if (existsFileSync(joinedPath))
		return joinedPath;

	try
	{
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
	} catch (_) {}

	return undefined;

}

/**
 * checks if file exists from given path
 * 
 * @param filePath the path with filename to check if exists
 * @returns true if exists, false if does not exist
 */
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

/**
 * writes the given object to path
 * formats object with tabs for easy reading
 * 
 * @param path the path that the content should be written to
 * @param content the content to write to file
 * @returns boolean if content is successfully written
 */
export function writeFile (path: string, content: any) 
{
	path = normalize(path);
	// create string from object, and make string pretty
	const stringContent = content === "" ? "" : JSON.stringify(content, null, "\t");

	try
	{
		Deno.createSync(path);
		Deno.writeTextFileSync(path, stringContent);
		return true;
	} catch (_)
	{
		return false;
	}
}
