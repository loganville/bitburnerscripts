/** @param {NS} ns **/
export async function main(ns) {
	await buyAugs(ns);
	await upgradeHomeComputer(ns);
	await buyNeuroFluxGovernor(ns);
	ns.installAugmentations("start.js");
}

async function buyNeuroFluxGovernor(ns) {
	const NeuroFluxName = "NeuroFlux Governor";
	var character = ns.getPlayer();
	var factions = character.factions;
	var maxRep = 0;
	var maxRepFaction = factions[0];
	for (var faction of factions) {
		if (ns.getFactionRep(faction) > maxRep) {
			maxRep = ns.getFactionRep(faction);
			maxRepFaction = faction;
		}
	}
	while (ns.getServerMoneyAvailable("home") > ns.getAugmentationPrice(NeuroFluxName) &&
		ns.getFactionRep(maxRepFaction) > ns.getAugmentationRepReq(NeuroFluxName)) {
		ns.purchaseAugmentation(maxRepFaction, NeuroFluxName);
	}
}

async function upgradeHomeComputer(ns) {
	while (ns.getServerMoneyAvailable("home") > ns.getUpgradeHomeRamCost()) {
		ns.upgradeHomeRam();
	}
	while (ns.getServerMoneyAvailable("home") > ns.getUpgradeHomeCoresCost()) {
		ns.upgradeHomeCores();
	}
}

async function buyAugs(ns) {
	var buyable = getBuyableAugs(ns);
	buyable.sort(function (a, b) {
		return ns.getAugmentationPrice(b.aug) - ns.getAugmentationPrice(a.aug);
	});
	for (var item of buyable) {
		if (ns.getServerMoneyAvailable("home") > ns.getAugmentationPrice(item.aug)) {
			ns.purchaseAugmentation(item.faction, item.aug);
		}
	}
}

function getBuyableAugs(ns) {
	var buyableAugs = [];
	var character = ns.getPlayer();
	var factions = character.factions;
	for (var faction of factions) {
		var factionAugs = ns.getAugmentationsFromFaction(faction);
		var ownedAugs = ns.getOwnedAugmentations(true);
		var leftoverAugs = _.difference(factionAugs, ownedAugs);
		for (var leftover of leftoverAugs) {
			if (ns.getFactionRep(faction) >= ns.getAugmentationRepReq(leftover)) {
				buyableAugs.push({ aug: leftover, faction: faction });
			}
		}
	}
	return buyableAugs;
}
