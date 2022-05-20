/**
 * returns a merged object, contains all values and type checked by default object
 * 
 * @param object: used to get the values from to override defaultObject
 * @param defaultObject: the values to use if do not exist in object, or not correct type
 * @returns the merged object
 */
export function typeCheckAndMerge<T> (object: any, defaultObject: T): T
{
	// check for every value in default object
	for (const t in defaultObject)
	{
		if (!t || t === "") continue;

		const defaultValue = (defaultObject as any)[t];
		const objectValue = object[t];

		// check if the object has key and are same type, else set to default
		if ((objectValue === undefined) || (typeof objectValue !== typeof defaultValue))
		{
			object[t] = defaultValue;
			continue;
		}

		// if value is object, also merge that object for deep merge
		if (isObject(defaultValue))
		{
			// deep merge objects
			object[t] = typeCheckAndMerge(objectValue, defaultValue);
		}
	}

	return object;
}

/**
 * check if given any is object
 * @param object the value to check
 * @returns true if value is a object
 */
export function isObject (object: any)
{
	return (typeof object === "object" &&
		!Array.isArray(object) &&
		object !== null);
}
