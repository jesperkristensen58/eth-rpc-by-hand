// EP 4 — RPC in Web3 · Scene 4a (reading real state)
//
// Reads a real mainnet balance with eth_getBalance — and decodes the hex-wei
// quantity with BigInt (JSON numbers can't hold wei; see Scene 3).

const RPC = 'https://ethereum-rpc.publicnode.com';
const VITALIK = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

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

// integer ETH + 4 decimals, in pure BigInt math (no float precision loss)
function formatEth(wei) {
  const whole = wei / 10n ** 18n;
  const frac = ((wei % 10n ** 18n) / 10n ** 14n).toString().padStart(4, '0');
  return `${whole}.${frac} ETH`;
}

const result = await rpc('eth_getBalance', [VITALIK, 'latest']);
const wei = BigInt(result);

console.log('address :', VITALIK);
console.log('raw     :', result);
console.log('wei     :', wei.toString());
console.log('balance :', formatEth(wei));
