/** @param {NS} ns **/
export async function main(ns) {
	ns.universityCourse("Rothman University", "Study Computer Science");
	ns.rm("lowgrow.txt", "home");
	ns.rm("hacked_hosts.txt", "home");
	ns.exec("doAll.js", "home");
	ns.exec("buyPrograms.js", "home");
	ns.exec("purchase.js", "home");
	await ns.sleep(60000);
	ns.run("update_hacklist.script"); 
	while (ns.isRunning("update_hacklist.script", "home")) {
		await ns.sleep(1000);
	}
	ns.run("useHacked.js");
}
