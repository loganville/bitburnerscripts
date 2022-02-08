/** @param {NS} ns **/
export async function main(ns) {
	const s_target = ns.args[0];

	let search_result = await scanAll(ns, 'home', s_target);
	if (search_result !== null) {
		search_result.map((node) => {
			ns.connect(node);
		});
	}
	if (ns.hasRootAccess(s_target)) {
		await ns.installBackdoor();
	}
	ns.connect("home");
}

async function scanAll(ns, target = 'home', search_target = null, recursionCall = false) {
	const targets = ns.scan(target);
	const match = targets.find((elem) => { return RegExp(search_target).test(elem) });
	if (match) {
		return [match]
	} else {
		for (const [idx, target] of targets.entries()) {
			let skip = false;
			if (recursionCall === true && idx === 0) {
				skip = true;
			}
			if (skip === false) {
				let res = await scanAll(ns, target, search_target, true);
				if (res != null) {
					return [target, ...res]
				}
			}
		}
		return null
	}
}
