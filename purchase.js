/** @param {NS} ns **/
import * as helper from "useHacked.js";
//import * as hacknetHelper from "hacknet.js";

export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMaxRam");
	ns.disableLog("sleep");

	var ram = 256;

	while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			var hostname = ns.purchaseServer("pserv" + ram, ram);
			await helper.use_server(ns, hostname);
		}
		await ns.sleep(1000);
	}

	var maxRam = ns.getPurchasedServerMaxRam();

	while (true) {
		//await hacknetHelper.buyHacknet(ns);
		var ownedServers = ns.getPurchasedServers();
		var weakestServer = ownedServers[0];
		var weakestServerRam = ns.getServerMaxRam(weakestServer);
		var allServersAtMax = false;
		if (!allServersAtMax && ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
			ownedServers.forEach(currentServer => {
				if (ns.getServerMaxRam(currentServer) < weakestServerRam) {
					weakestServer = currentServer;
					weakestServerRam = ns.getServerMaxRam(currentServer);
				}
			});
			var upgradedServerRam = Math.min(weakestServerRam * 4, maxRam);
			if (weakestServerRam >= maxRam) {
				allServersAtMax = true;
			} else {
				if (ns.getServerMoneyAvailable("home") * .1 > ns.getPurchasedServerCost(upgradedServerRam)) {
					ns.killall(weakestServer);
					ns.deleteServer(weakestServer);
					var hostname = ns.purchaseServer("pserv" + upgradedServerRam, upgradedServerRam);
					await helper.use_server(ns, hostname);
				}
			}
		}
		await ns.sleep(1000);
	}
}
