import * as ObjectUtils from "../ObjectUtils.ts";

import {assertEquals} from "https://deno.land/std@0.140.0/testing/asserts.ts";

//------------------------------------------------------------------------------


Deno.test("Check correctly (deep) merge", () =>
{
	assertEquals(
		ObjectUtils.typeCheckAndMerge(
			{
				test: true,
				cool: true,
				what: {
					something: true
				},
				array: [3, 2, 1],
				testing: {
					yes: false,
					s: "no default",
					extra: 1
				}
			},

			{
				test: "overridden?",
				test2: "default",
				idk: false,
				cool: {
					overridden: true
				},
				array: [1, 2, 3],
				testing: {
					yes: true,
					s: "default"
				}
			}),

		// expected:
		{
			test: "overridden?",
			cool: {
				overridden: true
			},
			what: {
				something: true
			},
			array: [3, 2, 1],
			testing: {
				yes: false,
				s: "no default",
				extra: 1
			},
			test2: "default",
			idk: false
		}
	);
});

//------------------------------------------------------------------------------


Deno.test("check if isObject correctly identifies objects", () =>
{

	assertEquals(ObjectUtils.isObject({}), true);
	assertEquals(ObjectUtils.isObject({test: true}), true);
	assertEquals(ObjectUtils.isObject({test: {test: true}}), true);

	assertEquals(ObjectUtils.isObject(undefined), false);
	assertEquals(ObjectUtils.isObject(null), false);
	assertEquals(ObjectUtils.isObject(true), false);
	assertEquals(ObjectUtils.isObject(12345), false);
	assertEquals(ObjectUtils.isObject([1, 2, 3]), false);
});
