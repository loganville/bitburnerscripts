/** @param {NS} ns **/
export async function main(ns) {
	await buyPrograms(ns);
}

export async function buyPrograms(ns) {
	var character = ns.getPlayer();

	while (!character.tor) {
		character = ns.getPlayer();
		if (!character.tor && ns.getServerMoneyAvailable("home") > 200000) {
			ns.purchaseTor();
			character = ns.getPlayer();
		}
		await ns.sleep(100);
	}

	var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe",
		"HTTPWorm.exe", "SQLInject.exe", "ServerProfiler.exe",
		"DeepscanV1.exe", "DeepscanV2.exe", "AutoLink.exe"];
	var programCount = 0;

	while (programCount < programs.length) {
		programCount = 0;
		programs.forEach(program => {
			if (ns.fileExists(program, "home")) {
				programCount++;
			} else {
				ns.purchaseProgram(program);
			}
		});
		await ns.sleep(100);
	}
}
