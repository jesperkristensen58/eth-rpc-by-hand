// EP 4 — RPC in Web3 · Scene 4d (eth_call, the strange one)
//
// Runs contract code WITHOUT a transaction: eth_call executes the function
// locally on the node and returns the result. Free. Instant. Nothing written.
//
// We call totalSupply() on the real USDC contract — with a hand-rolled 4-byte
// selector instead of an ABI library, so there's no magic:
//   selector = first 4 bytes of keccak256("totalSupply()") = 0x18160ddd

const RPC = 'https://ethereum-rpc.publicnode.com';
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';   // USDC token contract

const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method: 'eth_call',
    params: [
      { to: USDC, data: '0x18160ddd' },   // "totalSupply()" — no arguments, just the selector
      'latest',
    ],
  }),
});
const { result } = await response.json();

const raw = BigInt(result);               // USDC has 6 decimals
console.log('raw return       :', result);
console.log('total supply     :', (raw / 10n ** 6n).toLocaleString('en-US'), 'USDC');
console.log('(no transaction, no gas, nothing written — the node ran the code and told us)');
