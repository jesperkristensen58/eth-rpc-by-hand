// EP 4 — RPC in Web3 · Scenes 6 + 7 ("latest" is a moving target)
//
// Polls the chain every 3 seconds: block number + a balance pinned to 'latest'.
// Watch the block number tick over mid-run — every read after that line was
// answered from a DIFFERENT version of the world than the reads before it.
// (Also a live demo of polling waste: most answers are "nothing new.")

const RPC = 'https://ethereum-rpc.publicnode.com';
const VITALIK = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const ROUNDS = 6;
const INTERVAL_MS = 3000;

async function rpc(method, params) {
  const response = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const body = await response.json();
  if (body.error) throw new Error(`${body.error.code}: ${body.error.message}`);
  return body.result;
}

const eth = (wei) =>
  `${wei / 10n ** 18n}.${((wei % 10n ** 18n) / 10n ** 14n).toString().padStart(4, '0')} ETH`;

let lastBlock = null;
for (let i = 0; i < ROUNDS; i++) {
  const [blockHex, balHex] = await Promise.all([
    rpc('eth_blockNumber', []),
    rpc('eth_getBalance', [VITALIK, 'latest']),
  ]);
  const block = BigInt(blockHex).toString();
  const marker = lastBlock === null ? '' : block === lastBlock ? '   (same block — wasted poll)' : '   ← NEW BLOCK: the world just changed';
  console.log(`[${new Date().toISOString().slice(11, 19)}] block ${block} · balance ${eth(BigInt(balHex))}${marker}`);
  lastBlock = block;
  if (i < ROUNDS - 1) await new Promise((r) => setTimeout(r, INTERVAL_MS));
}
