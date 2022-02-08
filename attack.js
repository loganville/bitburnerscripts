/** @param {NS} ns **/
export async function main(ns) {
	var server = ns.args[0];
	ns.disableLog("getServerSecurityLevel")
	ns.disableLog("getServerMinSecurityLevel")
	ns.disableLog("getServerMoneyAvailable")
	ns.disableLog("getServerMaxMoney")
	while (true) {
		var currentSecurity = ns.getServerSecurityLevel(server);
		var minSecurity = ns.getServerMinSecurityLevel(server) * 2;
		var isSlowToHack = (ns.getGrowTime(server) > 60000 || ns.getHackTime(server) > 60000);

		if (currentSecurity > minSecurity && isSlowToHack) {
			await ns.weaken(server);
		} else if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server) * 0.9) {
			await ns.grow(server);
		} else {
			await ns.hack(server);
		}
		await ns.sleep(Math.random() * 1000);
	}
}
