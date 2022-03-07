import * as ObjectUtils from "../ObjectUtils.ts";


Deno.test("Check correctly (deep) merge", () =>
{
	console.log("type:", ObjectUtils.typeCheckAndMerge(
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
		}));
});
