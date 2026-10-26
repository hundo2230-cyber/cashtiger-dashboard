/* ⛔손으로 고치지 않는다 — `python3 scripts/derive_unified_dashboard.py` 가 만든다. */
const FRESH = "자동 갱신 · 매일 아침 06:10";
const TILES = [
 {"id": "FEDFUNDS", "name": "연준이 정하는 금리", "value": "3.75%", "verdict": "평소 범위", "note": "1년 전보다 0.47%p 내렸다", "band": "calm", "asOf": "2026-09-01", "href": "rates.html"},
 {"id": "DGS2", "name": "2년 만기 국채", "value": "4.69%", "verdict": "평소 범위", "note": "1년 전보다 1.21%p 올랐다", "band": "calm", "asOf": "2026-10-23", "href": "rates.html"},
 {"id": "DGS10", "name": "10년 만기 국채", "value": "5.00%", "verdict": "평소 범위", "note": "1년 전보다 0.99%p 올랐다", "band": "calm", "asOf": "2026-10-23", "href": "rates.html"},
 {"id": "B9", "name": "물가와 고용", "value": "2.95% / 4.1%", "verdict": "물가만 높음", "note": "물가는 목표 위 · 고용은 평범하다", "band": "b9-hot_neutral", "asOf": "2026-08-01", "href": "b9.html"},
 {"id": "VIXCLS", "name": "변동성 기대", "value": "19.45", "verdict": "평소보다 들썩", "note": "평소의 1.11배", "band": "choppy", "asOf": "2026-10-23", "href": "vix.html"}
];
