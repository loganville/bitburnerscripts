/** @param {NS} ns **/
export async function main(ns) {
	var hacked_hosts = ns.read('hacked_hosts.txt');
	var hosts = hacked_hosts.split('\n');
	for (let idx = 0; idx < hosts.length; idx++) {
		await use_server(ns, hosts[idx]);
	}
}

async function upload_and_run(ns, script, server, args) {
	await ns.scp(script, server);
	var availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
	var threads = Math.floor(availableRam / ns.getScriptRam(script, server));
	if (threads > 0) {
		ns.exec(script, server, Math.min(threads, 1000), args, Date.now());
	}
}

export async function use_server(ns, server) {
	if (ns.serverExists(server)) {
		if (server != "home") {
			ns.killall(server);
		} else {
			const ps = ns.ps("home");
			for (script of ps) {
				if (script.filename == "attack.js") {
					ns.kill(script.pid);
				}
			}
		}

		var low_grow = ns.read('lowgrow.txt');
		var growables = low_grow.split('\n');
		var script = "attack.js";
		var availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
		while (availableRam > ns.getScriptRam(script) && growables.length > 1) {
			var random = Math.floor(Math.random() * growables.length);
			await upload_and_run(ns, script, server, growables[random]);
			availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
			await ns.sleep(10);
		}
	}
}
