# PULSE — 12-check QA battery

Run after `npm run build` and `npm run dev`. Mark pass/fail. Offline drill: run checks 7–8 twice (cold + after reload).

| # | Check | Pass condition | Result |
|---|---|---|---|
| 1 | App loads with zero console errors | Home loads; browser console has no errors | |
| 2 | All seven tabs reachable | Overview, Vitals, Radiation, Environment, Countermeasures, Behavioral, Rules & Sources | |
| 3 | Simulated vitals stream updating | Vitals HR/tick change over ~2s | |
| 4 | BLIND refuses bad data | “Inject bad sample” shows BLIND message + blind receipt | |
| 5 | Engine outputs have receipts | Rules tab receipt list shows `engine` rows after ticks | |
| 6 | Threshold edit is receipted | Change HR max → receipt `threshold` appears | |
| 7 | LOS queues `QUEUED-FS` | Link → LOS, Escalate → queue shows `QUEUED-FS` | |
| 8 | AOS flushes with sync receipt | Link → AOS → status `FLUSHED` + `sync` receipt | |
| 9 | Storm replay runs | Storm toggle → STORM; radiation dose rises | |
| 10 | Mood check-in writes behavioral state | Behavioral save → `mood` receipt | |
| 11 | Sources panel = 19; official five present | Rules tab lists 19; official block has 21–25 links | |
| 12 | Judge tour completes | “Run judge tour” finishes without UI crash | |

## Offline drill

1. Set LOS, escalate, reload page → `QUEUED-FS` still present (localStorage).
2. Switch AOS → flushed + sync receipt persists after second reload.

## Automated

```bash
npm test
npx playwright install chromium
npm run test:e2e
```
