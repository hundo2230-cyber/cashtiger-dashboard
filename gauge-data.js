/* ⛔손으로 고치지 않는다 — `python3 scripts/derive_gauge_card.py` 가 만든다.
   원천 = synexus/data/macro.db (FRED 수집본). 숫자를 손으로 적으면 조용히 낡는다.
   ⭐바늘 위치(pos)도 여기서 계산한다 — 화면이 위치를 발명하지 못하게. */
const GAUGE = {
 "asOf": "2026-10-23",
 "gauges": [
  {
   "key": "spread",
   "name": "장단기 금리차",
   "unit": "%p",
   "blurb": "10년 만기 국채 금리에서 2년 만기를 뺀 값입니다.",
   "compare": "0 과 비교합니다. 0 아래로 내려가면 '역전' 이라 부릅니다.",
   "source": "FRED T10Y2Y",
   "marksAbsentReason": "",
   "value": 0.31,
   "asOf": "2026-10-23",
   "pct": 30.6,
   "axisLo": -0.89,
   "axisHi": 2.64,
   "pos": 0.3399,
   "clamped": false,
   "sampleN": 12596,
   "sampleFrom": "1976-06-01",
   "marks": [
    {
     "value": 0.0,
     "label": "0 — 10년물과 2년물이 같아지는 자리",
     "pos": 0.2521
    }
   ]
  },
  {
   "key": "cfnai",
   "name": "경기 종합지수",
   "unit": "",
   "blurb": "85개 경기 지표를 하나로 묶은 수치입니다. 0 이 평균 성장입니다.",
   "compare": "자기 과거 기록과 비교합니다. 값이 클수록 경기가 센 편입니다.",
   "source": "FRED CFNAI (시카고 연준)",
   "marksAbsentReason": "공표된 경기순환 기준(-0.70 / +0.20)은 3개월 이동평균값에 대한 것이고, 이 계기는 달마다의 값을 그립니다. 기준이 다른 값에 선을 그으면 틀린 선이 됩니다.",
   "value": -0.04,
   "asOf": "2026-08-01",
   "pct": 40.6,
   "axisLo": -1.82,
   "axisHi": 1.3,
   "pos": 0.5705,
   "clamped": false,
   "sampleN": 714,
   "sampleFrom": "1967-03-01",
   "marks": []
  },
  {
   "key": "ungap",
   "name": "실업률 갭",
   "unit": "%p",
   "blurb": "지금 실업률에서, 그 시점의 '자연 실업률' 추정치를 뺀 값입니다.",
   "compare": "두 선 사이가 '어느 쪽이라 말하기 어려운 구간' 입니다. 음수는 일자리가 빠듯한 쪽, 양수는 남는 쪽입니다.",
   "source": "FRED UNRATE − NROU (의회예산처 추정 · 분기값을 앞채움)",
   "marksAbsentReason": "",
   "value": -0.29,
   "asOf": "2026-08-01",
   "pct": 36.2,
   "axisLo": -2.3,
   "axisHi": 4.56,
   "pos": 0.293,
   "clamped": false,
   "sampleN": 799,
   "sampleFrom": "1960-01-01",
   "marks": [
    {
     "value": -0.9,
     "label": "-0.9 — 1997년 한 논문의 구간에서 온 폭",
     "pos": 0.2041
    },
    {
     "value": 0.9,
     "label": "+0.9 — 같은 폭의 반대쪽",
     "pos": 0.4665
    }
   ]
  },
  {
   "key": "tcu",
   "name": "공장 가동률",
   "unit": "%",
   "blurb": "공장·설비가 얼마나 돌고 있는지입니다.",
   "compare": "장기 평균과 비교합니다. 평균보다 높은지 낮은지만 말합니다.",
   "source": "FRED TCU (연준 산업생산·설비가동률)",
   "marksAbsentReason": "",
   "value": 76.85,
   "asOf": "2026-09-01",
   "pct": 25.2,
   "axisLo": 70.14,
   "axisHi": 87.89,
   "pos": 0.378,
   "clamped": false,
   "sampleN": 717,
   "sampleFrom": "1967-01-01",
   "marks": [
    {
     "value": 79.41,
     "label": "79.4 — 1972~2025 평균",
     "pos": 0.5223
    }
   ]
  },
  {
   "key": "cpi",
   "name": "물가 상승률",
   "unit": "%",
   "blurb": "장바구니 물가가 1년 전보다 얼마나 올랐는지입니다(식품·에너지 포함).",
   "compare": "자기 과거 기록과 비교합니다. 0 아래면 값이 내려가는 중입니다.",
   "source": "FRED CPIAUCSL · 전년 대비",
   "marksAbsentReason": "공표된 2% 물가 목표는 '개인소비지출 물가지수' 에 대한 것이고, 이 계기는 소비자물가지수를 그립니다. 다른 지표의 목표선을 여기 그으면 틀린 선이 됩니다.",
   "value": 3.72,
   "asOf": "2026-09-01",
   "pct": 66.9,
   "axisLo": -0.63,
   "axisHi": 11.85,
   "pos": 0.3486,
   "clamped": false,
   "sampleN": 944,
   "sampleFrom": "1948-01-01",
   "marks": []
  },
  {
   "key": "breakeven",
   "name": "채권이 매긴 물가",
   "unit": "%",
   "blurb": "앞으로 10년 물가에 대해 채권 시장이 매긴 값입니다. 순수한 '기대' 는 아니고 위험을 떠안는 값과 거래하기 쉬운 정도도 섞여 있습니다.",
   "compare": "자기 과거 기록과 비교합니다. 커질수록 물가를 더 높게 매긴 쪽입니다.",
   "source": "FRED T10YIE",
   "marksAbsentReason": "공표된 2% 물가 목표는 '개인소비지출 물가지수' 기준이고, 이 값은 소비자물가지수에 연동된 채권에서 나옵니다. 기준이 달라 선을 긋지 않았습니다.",
   "value": 2.34,
   "asOf": "2026-10-23",
   "pct": 68.5,
   "axisLo": 1.08,
   "axisHi": 2.66,
   "pos": 0.7975,
   "clamped": false,
   "sampleN": 5957,
   "sampleFrom": "2003-01-02",
   "marks": []
  }
 ],
 "band": 0.9
};
