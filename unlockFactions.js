/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("joinFaction");
	while (true) {
		var player = ns.getPlayer();
		var factionMemberships = player.factions;
		var factions = getFactionsWithAugs(ns);
		var neededFactions = _.difference(factions, factionMemberships);
		if (neededFactions.length == 0) {
			break;
		}
		const cities = [
			["Sector-12", "Aevum"],
			["Chongqing", "New Tokyo", "Ishima"],
			["Volhaven"]
		]
		for (const cityGroup of cities) {
			if (_.intersection(neededFactions, cityGroup).length > 0 ||
				_.intersection(factionMemberships, cityGroup).length > 0) {
				const conflictingCities = _.difference(_.flatten(cities), _.flatten(cityGroup));
				neededFactions = _.difference(neededFactions, _.flatten(conflictingCities));
				break;
			}
		}

		if (neededFactions.length > 0) {
			//ns.tprint(neededFactions);
			await unlockFunctions(ns, neededFactions);
		}
		await ns.sleep(10000);
	}
}

async function unlockFunctions(ns, factions) {
	for (const faction of factions) {
		switch (faction) {
			case "CyberSec":
				backdoor(ns, "CSEC");
				await join(ns, faction);
				break;
			case "NiteSec":
				backdoor(ns, "avmnite-02h");
				await join(ns, faction);
				break;
			case "The Black Hand":
				backdoor(ns, "I.I.I.I");
				await join(ns, faction);
				break;
			case "BitRunners":
				backdoor(ns, "run4theh111z");
				await join(ns, faction);
				break;
			case "Sector-12":
				ns.travelToCity("Ishima");
				await join(ns, faction);
				break;
			case "Aevum":
				ns.travelToCity("Ishima");
				await join(ns.faction);
				break;
			case "Chongqing":
			case "Tian Di Hui":
				ns.travelToCity("Chongqing");
				await join(ns, faction);
				break;
			case "New Tokyo":
				ns.travelToCity("New Tokyo");
				await join(ns, faction);
				break;
			case "Ishima":
				ns.travelToCity("Ishima");
				await join(ns, faction);
				break;
			case "Volhaven":
				ns.travelToCity("Volhaven");
				await join(ns, faction);
				break;
			default:
				await join(ns, faction);
				break;
		}
	}
}

async function join(ns, faction) {
	let attempts = 0;
	while (!ns.joinFaction(faction) && attempts < 100) {
		await ns.sleep(1000);
		attempts++;
	}
}

function backdoor(ns, server) {
	ns.exec("backdoor.js", "home", 1, server);
}

function getFactionsWithAugs(ns) {
	var factions = ["CyberSec", "Tian Di Hui", "Netburners",
		"Sector-12", "Aevum",
		"Chongqing", "New Tokyo", "Ishima",
		"Volhaven",
		"NiteSec", "The Black Hand", "BitRunners",
		"Daedalus"];

	var factionsWithAugs = [];
	var playerAugs = ns.getOwnedAugmentations(true);
	for (const faction of factions) {
		var factionAugs = ns.getAugmentationsFromFaction(faction);
		var augsNeeded = _.difference(factionAugs, playerAugs);
		if (augsNeeded.length > 0) {
			factionsWithAugs.push(faction);
		}
	}
	return factionsWithAugs;
}
