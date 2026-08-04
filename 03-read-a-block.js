// EP 4 — RPC in Web3 · Scene 4c (a block, whole)
//
// Fetches the latest block header (without full transaction bodies) and prints
// its vital stats — plus the size of the JSON payload itself (EP 3's bandwidth
// measurement, now against the real chain).

const RPC = 'https://ethereum-rpc.publicnode.com';

const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method: 'eth_getBlockByNumber',
    params: ['latest', false],          // false = tx hashes only, not full tx objects
  }),
});
const text = await response.text();     // keep the raw text so we can weigh it
const { result: block } = JSON.parse(text);

const gwei = (hex) => (Number(BigInt(hex)) / 1e9).toFixed(1);
const pct = (used, limit) => ((Number(BigInt(used)) / Number(BigInt(limit))) * 100).toFixed(0);

console.log('block number :', BigInt(block.number).toString());
console.log('block hash   :', block.hash);
console.log('transactions :', block.transactions.length);
console.log('gas used     :', `${pct(block.gasUsed, block.gasLimit)}% of limit`);
console.log('base fee     :', `${gwei(block.baseFeePerGas)} gwei`);
console.log('timestamp    :', new Date(Number(BigInt(block.timestamp)) * 1000).toISOString());
console.log('payload size :', Buffer.byteLength(text, 'utf8').toLocaleString(), 'bytes (headers only!)');
