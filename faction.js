/** @param {NS} ns **/
export async function main(ns) {
	await increaseRep(ns);
}

export function getPlayerFactions(ns) {
	var factionOrder = ["CyberSec", "Tian Di Hui", "Netburners",
		"Sector-12", "Aevum",
		"Chongqing", "New Tokyo", "Ishima",
		"Volhaven",
		"NiteSec", "The Black Hand", "BitRunners",
		"Daedalus"];
	var character = ns.getPlayer();
	return _.intersection(factionOrder, character.factions);
}

export async function increaseRep(ns) {
	while (true) {
		var factions = getPlayerFactions(ns);

		for (var faction of factions) {
			var repRequired = determineRequiredFactionRep(ns, faction);
			var shouldRestart = await increaseFactionRep(ns, faction, repRequired, factions.length);
			if (shouldRestart) {
				break;
			}
		}
		if (!shouldRestart) {
			break;
		}
	}
}

function getBuyableAugs(ns) {
	var buyableAugs = [];
	var factions = getPlayerFactions(ns);
	for (var faction of factions) {
		var factionAugs = ns.getAugmentationsFromFaction(faction);
		var ownedAugs = ns.getOwnedAugmentations(true);
		var leftoverAugs = _.difference(factionAugs, ownedAugs);
		for (var leftover of leftoverAugs) {
			if (ns.getFactionRep(faction) >= ns.getAugmentationRepReq(leftover)) {
				buyableAugs.push(leftover);
			}
		}
	}
	return buyableAugs;
}

export function determineRequiredFactionRep(ns, faction) {
	var factionAugs = ns.getAugmentationsFromFaction(faction);
	var ownedAugs = ns.getOwnedAugmentations(true);
	var buyableAugs = getBuyableAugs(ns);
	var leftoverAugs = _.difference(factionAugs, ownedAugs);
	leftoverAugs = _.difference(leftoverAugs, buyableAugs);

	var repRequired = 0;
	for (var aug of leftoverAugs) {
		repRequired = Math.max(ns.getAugmentationRepReq(aug), repRequired);
	}

	return repRequired;
}

function totalFactionFavor(ns, faction) {
	return ns.getFactionFavorGain(faction) + ns.getFactionFavor(faction);
}

export async function increaseFactionRep(ns, faction, repRequired, currentFactionCount) {
	while (ns.getFactionRep(faction) < repRequired && totalFactionFavor(ns, faction) < 150) {
		ns.workForFaction(faction, "Hacking Contracts", false);
		await ns.sleep(60000);
		if (getPlayerFactions(ns).length > currentFactionCount) {
			return true;
		}
	}
	return false;
}
