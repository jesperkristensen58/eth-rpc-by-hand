// EP 4 — RPC in Web3 · Scene 1/2 (your first real call)
//
// Asks Ethereum mainnet for the current block number — raw JSON-RPC over HTTPS.
// No library, no API key, no wallet. Same envelope you built in EP 2.

const RPC = 'https://ethereum-rpc.publicnode.com';

const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }),
});
const { result } = await response.json();

console.log('raw result :', result);                       // hex quantity, e.g. "0x15f9be3"
console.log('decoded    :', BigInt(result).toString());    // the actual block number
