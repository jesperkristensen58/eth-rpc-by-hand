// EP 4 — RPC in Web3 · Scene 6 (the heartbeat, pushed)
//
// eth_subscribe('newHeads') over a real WebSocket: the node PUSHES every new
// block to us the moment it lands. Same JSON-RPC envelope as ever — different
// pipe (EP 3's "JSON-RPC over WebSocket", live).
//
// Requires Node >= 22 (native WebSocket global). Exits after 3 blocks or 90s.

const WSS = 'wss://ethereum-rpc.publicnode.com';
const MAX_BLOCKS = 3;
const TIMEOUT_MS = 90_000;

if (typeof WebSocket === 'undefined') {
  console.error('This script needs Node 22+ (native WebSocket). Check: node --version');
  process.exit(1);
}

const ws = new WebSocket(WSS);
let seen = 0;

const bail = setTimeout(() => { console.log('(timeout — closing)'); ws.close(); }, TIMEOUT_MS);

ws.onopen = () => {
  console.log('connected — subscribing to newHeads… (blocks arrive ~every 12s; the wait is the point)');
  ws.send(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_subscribe', params: ['newHeads'] }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id === 1) { console.log('subscribed:', msg.result); return; }   // subscription id

  const head = msg.params.result;                                          // a pushed block header
  const gwei = (Number(BigInt(head.baseFeePerGas)) / 1e9).toFixed(1);
  const used = ((Number(BigInt(head.gasUsed)) / Number(BigInt(head.gasLimit))) * 100).toFixed(0);
  console.log(`[${new Date().toISOString().slice(11, 19)}] new block ${BigInt(head.number)}   baseFee ${gwei} gwei   gasUsed ${used}%`);

  if (++seen >= MAX_BLOCKS) { clearTimeout(bail); ws.close(); }
};

ws.onclose = () => { console.log('socket closed.'); process.exit(0); };
ws.onerror = (err) => { console.error('socket error:', err.message ?? err); };
