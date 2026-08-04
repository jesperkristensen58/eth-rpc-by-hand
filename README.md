# eth-rpc-by-hand

Talk to **Ethereum mainnet** with raw JSON-RPC — no library, no API key, no wallet.

Companion code for **Episode 4** of *The Complete Guide to RPC for Web3 Developers* — a 12-part deep dive into the RPC layer every dApp, wallet, and indexer uses to talk to a blockchain.

This is the episode where the series graduates from the toy server (Ep. 2) to the **real chain**. Every script is a live call against a public mainnet endpoint.

▶️ **Watch the video:** [The Complete Guide to RPC for Web3 Developers (Ep. 4)](VIDEO_URL)
🎙️ **Full series:** [@cryptojesperk on YouTube](https://www.youtube.com/@cryptojesperk)

🚀 **The future of RPC:** **[direct.dev](https://direct.dev)** — RPC, reimagined. A leap, not a step.

---

## Requirements

- **Node.js ≥ 18** for scripts 01–05 (built-in `fetch`, ESM)
- **Node.js ≥ 22** for script 06 (native `WebSocket` global)
- An internet connection — these hit a live public endpoint

```bash
node --version
```

---

## The endpoint

All scripts use the keyless public endpoint:

- HTTPS: `https://ethereum-rpc.publicnode.com`
- WSS: `wss://ethereum-rpc.publicnode.com`

It's free and unauthenticated, so it can rate-limit under load. If a script errors or hangs, wait ~30 seconds and re-run — or swap the `RPC` constant for any public Ethereum RPC URL. The code doesn't care which node answers; that's the point of the episode.

---

## Scripts (episode order)

| # | Run | What it shows |
|---|---|---|
| 01 | `node 01-block-number.js` | First real call — `eth_blockNumber`, hex → `BigInt` |
| 02 | `node 02-get-balance.js` | `eth_getBalance` on a real address; decoding wei without float loss |
| 03 | `node 03-read-a-block.js` | `eth_getBlockByNumber` — block stats + real payload size in bytes |
| 04 | `node 04-eth-call-totalsupply.js` | **`eth_call`** — USDC `totalSupply()` with a hand-rolled 4-byte selector |
| 05 | `node 05-latest-moves.js` | Poll ~15s — watch `"latest"` move under you |
| 06 | `node 06-subscribe-newheads.js` | `eth_subscribe('newHeads')` over WebSocket — blocks pushed live (~12s). Node 22+. |

(`npm run 01` … `npm run 06` also work.)

---

## Expected output (yours will differ — live chain)

```
$ node 01-block-number.js
raw result : 0x181e637
decoded    : 25290295

$ node 06-subscribe-newheads.js
connected — subscribing to newHeads… (blocks arrive ~every 12s; the wait is the point)
subscribed: 0x25b2…
[23:21:24] new block 25290299   baseFee 0.1 gwei   gasUsed 100%
```

Block numbers, balances, fees — whatever the chain says when *you* run it. That's the feature.

---

## What's deliberately NOT here

- **No transaction sending.** `eth_sendRawTransaction` moves real money; the episode teaches the shape, not a live send.
- **No ABI library.** Script 04 hand-rolls one selector (`0x18160ddd` = first 4 bytes of `keccak256("totalSupply()")`). Full ABI encoding is a library job.
- **No retries, caching, or failover** — those are the rest of the series.

---

## Troubleshooting

- **`fetch failed` / timeouts** — no internet, or the endpoint is briefly rate-limiting. Wait 30s; or swap the endpoint.
- **Script 06: needs Node 22+** — upgrade, or skip 06.
- **Balance looks different from the video** — of course; live chain, live account.
- **`-32601 Method not found`** on `debug_*` / `trace_*` experiments — public endpoints disable node-local power tools. That's part of the lesson.

---

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, learn from it.
