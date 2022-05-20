import * as FileUtils from "./FileUtils.ts";
import * as ObjectUtils from "./ObjectUtils.ts";

/**
 * user options to search file
 */
export interface ILoadOptions
{
	readonly filename: string;
	readonly searchDir?: string;
}


export default class Config<T>
{
	/**
	 * loads the config class
	 * 
	 * @param opts: options to search for the file
	 * @param def: the default object to use if file does not exist
	 * @returns a new config class
	 */
	static async load<T> (opts: ILoadOptions, def: T)
	{
		const filePath = FileUtils.findOrCreateFile(opts);
		return new Config(filePath, def);
	}



	protected readonly defaultStructure: T;
	protected filePath: string;
	private configObject: T;

	protected constructor (filePath: string, def: T)
	{
		this.filePath = filePath;
		this.defaultStructure = def;
		this.configObject = def;
	}

	/**
	 * gets the most recent version from the file
	 * 
	 * if typechecker fails on something, 
	 * it will replace it with default (in file and returned object)
	 * @returns the most recent version of the file, type checked with default
	 */
	read ()
	{
		// get the file contents
		var content;
		try
		{
			content = Deno.readTextFileSync(this.filePath);
		} catch (_) {}

		// if file is empty, it means that it was just created or contents deleted. 
		// so we copy defaults into file
		if (!content || content == "")
		{
			FileUtils.writeFile(this.filePath, this.defaultStructure);
			return this.configObject;
		}


		// parse the content to an object
		const object = JSON.parse(content);

		// now that we have content, we want to validate and set it as object
		this.configObject = ObjectUtils.typeCheckAndMerge(object, this.defaultStructure);

		// write merged to file, so we have a validated object to set
		this.write();

		return this.configObject;

	}

	/**
	 * writes the object to file
	 * if no param is given, the object from get() will be used
	 * 
	 * @param newObject: (optional) the object to override the file with
	 * @returns boolean, true if written successfully, false if an error occurred
	 */
	write (newObject?: T) 
	{
		if (newObject)
			this.configObject = ObjectUtils.typeCheckAndMerge(newObject, this.configObject);


		// we need to get the files new values
		// so we dont override values that are not in our default
		const content = JSON.parse(Deno.readTextFileSync(this.filePath));

		FileUtils.writeFile(this.filePath, ObjectUtils.typeCheckAndMerge(this.configObject, content));
	}
}
