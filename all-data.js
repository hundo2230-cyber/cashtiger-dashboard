/* ⛔손으로 고치지 않는다 — `python3 scripts/derive_unified_dashboard.py` 가 만든다. */
const FRESH = "자동 갱신 · 매일 아침 06:10";
const TILES = [
 {"id": "FEDFUNDS", "name": "연준이 정하는 금리", "value": "3.88%", "verdict": "평소 범위", "note": "1년 전보다 0.21%p 내렸다", "band": "calm", "asOf": "2026-10-01", "href": "rates.html"},
 {"id": "DGS2", "name": "2년 만기 국채", "value": "4.63%", "verdict": "평소 범위", "note": "1년 전보다 1.12%p 올랐다", "band": "calm", "asOf": "2026-11-23", "href": "rates.html"},
 {"id": "DGS10", "name": "10년 만기 국채", "value": "4.92%", "verdict": "평소 범위", "note": "1년 전보다 0.86%p 올랐다", "band": "calm", "asOf": "2026-11-23", "href": "rates.html"},
 {"id": "B9", "name": "물가와 고용", "value": "3.20% / 4.1%", "verdict": "물가만 높음", "note": "물가는 목표 위 · 고용은 평범하다", "band": "b9-hot_neutral", "asOf": "2026-10-01", "href": "b9.html"},
 {"id": "VIXCLS", "name": "변동성 기대", "value": "26.36", "verdict": "크게 들썩", "note": "평소의 1.50배", "band": "stormy", "asOf": "2026-11-24", "href": "vix.html"}
];
