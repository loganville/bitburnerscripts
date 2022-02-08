/** @param {NS} ns **/
import * as helper from "useHacked.js";

export async function main(ns) {
	//ns.disableLog("scan");

	var servers = ns.scan('home');
	while (true) {
		for (let idx = 0; idx < servers.length; idx++) {
			await ns.sleep(100);

			let server = servers[idx];
			if (ns.serverExists(server)) {
				await processServer(ns, server);

				ns.scan(server).forEach(function (element) {
					if (!servers.includes(element)) {
						servers.push(element);
					}
				});
			} else {
				ns.print("removing server: " + server);
				await removeServerFromFile(ns, 'hacked_hosts.txt', server);
				await removeServerFromFile(ns, 'scanned_hosts.txt', server);
				ns.print("Before\t" + servers);
				servers = servers.filter(x => x != server);
				ns.print("After\t" + servers);
				await ns.sleep(1000);
			}
		}
	}

}

async function processServer(ns, server) {
	var serverValues = ns.getServer(server);

	openPorts(ns, server);

	if (!serverValues.hasAdminRights) {
		if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
			if (ns.getServerNumPortsRequired(server) <= serverValues.openPortCount) {
				ns.nuke(server);
				await helper.use_server(ns, server);
			}
		}
	}
	if (serverValues.hasAdminRights) {
		await updateFile(ns, 'hacked_hosts.txt', server);
	}

	await updateFile(ns, 'scanned_hosts.txt', server);
}

async function updateFile(ns, fileName, server) {
	var hacked_hosts = ns.read(fileName);
	var hosts = hacked_hosts.split('\n');
	if (!hosts.includes(server)) {
		ns.print("updating file: " + fileName + " with server: " + server);
		hosts.push(server);
		await ns.write(fileName, hosts.join('\n'), 'w');
	}
}

async function removeServerFromFile(ns, fileName, server) {
	var hacked_hosts = ns.read(fileName);
	var hosts = hacked_hosts.split('\n');
	if (hosts.indexOf(server) > 0) {
		var updated = hosts.filter(x => x != server);
		await ns.write(fileName, updated.join('\n'), 'w');
	}
}

function openPorts(ns, server) {
	var serverValues = ns.getServer(server);
	if (ns.fileExists("BruteSSH.exe", "home")) {
		if (!serverValues.sshPortOpen) {
			ns.brutessh(server);
		}
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		if (!serverValues.ftpPortOpen) {
			ns.ftpcrack(server);
		}
	}

	if (ns.fileExists("relaySMTP.exe", "home")) {
		if (!serverValues.smtpPortOpen) {
			ns.relaysmtp(server);
		}
	}

	if (ns.fileExists("HTTPWorm.exe", "home")) {
		if (!serverValues.httpPortOpen) {
			ns.httpworm(server);
		}
	}

	if (ns.fileExists("SQLInject.exe", "home")) {
		if (!serverValues.sqlPortOpen) {
			ns.sqlinject(server);
		}
	}
}
