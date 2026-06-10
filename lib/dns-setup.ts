import dns from "node:dns";

/**
 * Optional per-process DNS override (side-effect import).
 *
 * On some Windows / VPN / corporate setups Node's resolver (c-ares) refuses SRV
 * queries even though the OS resolver answers them, which breaks
 * `mongodb+srv://` connections (querySrv ECONNREFUSED). Setting DNS_SERVERS
 * routes Node's SRV lookups to a resolver that works — WITHOUT changing system
 * DNS. The subsequent host A-record lookups use the OS resolver as usual.
 *
 * Leave DNS_SERVERS unset in production (Vercel) — the default resolver is fine.
 * Example (.env.local):  DNS_SERVERS=172.16.172.10
 */
const servers = process.env.DNS_SERVERS;
if (servers) {
  const list = servers
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length) {
    try {
      dns.setServers(list);
    } catch (error) {
      console.error("Invalid DNS_SERVERS value:", error);
    }
  }
}
