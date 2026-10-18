/* ⛔손으로 고치지 않는다 — `python3 scripts/derive_b9_card.py` 가 만든다.
   원천 = synexus/data/macro.db (FRED 수집본). 숫자를 손으로 적으면 조용히 낡는다. */
const B9 = {
 "asOf": "2026-08-01",
 "smoothMonths": 3,
 "infGap": 0.98,
 "unGap": -0.26,
 "infLatest": 0.95,
 "unLatest": -0.29,
 "natural": 4.39,
 "unrate": 4.1,
 "core": 2.95,
 "target": 2.0,
 "band": 0.9,
 "here": "hot_neutral",
 "streak": 36,
 "fixedUnGap": -0.3,
 "fixedHere": "hot_neutral",
 "sampleFrom": "1985-01-01",
 "sampleTo": "2026-08-01",
 "sampleMonths": 499,
 "nrouFrom": "1949-01-01",
 "nrouMin": 4.16,
 "nrouMax": 6.24,
 "dupRows": 48,
 "cells": [
  {
   "key": "hot_tight",
   "name": "과열",
   "blurb": "물가는 목표 위 · 고용은 빠듯하다",
   "months": 7,
   "share": 1.4,
   "episodes": 5,
   "meanRun": 1.4
  },
  {
   "key": "hot_neutral",
   "name": "물가만 높음",
   "blurb": "물가는 목표 위 · 고용은 평범하다",
   "months": 180,
   "share": 36.1,
   "episodes": 18,
   "meanRun": 10.0
  },
  {
   "key": "hot_slack",
   "name": "스태그플레이션",
   "blurb": "물가는 목표 위 · 일자리는 남는다",
   "months": 71,
   "share": 14.2,
   "episodes": 6,
   "meanRun": 11.8
  },
  {
   "key": "cool_tight",
   "name": "골디락스",
   "blurb": "물가는 목표 아래 · 고용은 빠듯하다",
   "months": 21,
   "share": 4.2,
   "episodes": 5,
   "meanRun": 4.2
  },
  {
   "key": "cool_neutral",
   "name": "조용함",
   "blurb": "물가는 목표 아래 · 고용은 평범하다",
   "months": 129,
   "share": 25.9,
   "episodes": 17,
   "meanRun": 7.6
  },
  {
   "key": "cool_slack",
   "name": "침체 쪽",
   "blurb": "물가는 목표 아래 · 일자리는 남는다",
   "months": 91,
   "share": 18.2,
   "episodes": 6,
   "meanRun": 15.2
  }
 ]
};
