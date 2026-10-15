/* 물가×고용 격자를 그린다. 숫자는 전부 b9-data.js(파생물)에서 온다.
 *
 * ⛔색은 **지금 있는 칸 하나**에만 켠다. 여섯 칸을 색으로 다 칠하지 않는다.
 * ⛔가운데 세로 띠는 **고용 축에만** 있다 — 물가 목표는 공표값이고 자연실업률은 추정값이다.
 * ⛔"과거에 이 칸이면 이랬다" 를 쓰지 않는다. 빈도는 맥락이고 예측이 아니다.
 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const set = (id, text) => {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
};

/* 격자 배치 — 위가 물가 높음, 왼쪽이 일자리 남음. 가운데 열이 중립 띠다. */
const LAYOUT = [
  ["hot_slack", "hot_neutral", "hot_tight"],
  ["cool_slack", "cool_neutral", "cool_tight"],
];

const byKey = () => Object.fromEntries(B9.cells.map((c) => [c.key, c]));

function grid() {
  const cells = byKey();
  const rows = LAYOUT.map((row) => row.map((key) => {
    const c = cells[key];
    const on = key === B9.here;
    const mid = key.endsWith("_neutral");
    return `<div class="cell${on ? " on" : ""}${mid ? " mid" : ""}"
      ${on ? `aria-current="true" ` : ""}aria-label="${esc(c.name)} — ${esc(c.blurb)}${on ? " · 지금 여기입니다" : ""}">
      <strong>${esc(c.name)}</strong>
      <span class="cell-why">${esc(c.blurb)}</span>
      ${on ? `<span class="cell-here">지금 여기 · ${B9.streak}개월 연속</span>` : ""}
    </div>`;
  }).join("")).join("");
  return rows;
}

function nowBox() {
  const cells = byKey();
  const here = cells[B9.here];
  const up = B9.infGap > 0;
  return `<p class="now-head"><strong>${esc(here.name)}</strong>
      <span class="now-run num">${B9.streak}개월 연속</span></p>
    <p class="now-why">${esc(here.blurb)}</p>
    <ul class="now-nums">
      <li><span class="k">물가</span>
        <span class="v num">${B9.core.toFixed(2)}%</span>
        <span class="m">목표 ${B9.target.toFixed(1)}% 보다 ${up ? "위" : "아래"}
          <span class="num">(${B9.infGap > 0 ? "+" : ""}${B9.infGap.toFixed(2)}%p)</span></span></li>
      <li><span class="k">일자리</span>
        <span class="v num">실업률 ${B9.unrate.toFixed(1)}%</span>
        <span class="m">완전고용으로 보는 선 <span class="num">${B9.natural.toFixed(2)}%</span>
          와의 차이 <span class="num">${B9.unGap > 0 ? "+" : ""}${B9.unGap.toFixed(2)}%p</span></span></li>
    </ul>
    <p class="now-band">일자리 쪽 차이는 <strong>±${B9.band.toFixed(1)}%p 안이면 "평범"</strong>으로 둡니다.
      완전고용 선 자체가 추정값이고, 그 추정의 폭이 그만큼이기 때문입니다.
      ⇒ 지금은 <strong>고용은 평범하고 물가만 목표 위</strong>입니다.</p>`;
}

function hist() {
  const sorted = [...B9.cells].sort((a, b) => b.months - a.months);
  const top = sorted[0].share;
  return sorted.map((c) => {
    const on = c.key === B9.here;
    return `<div class="row${on ? " on" : ""}">
      <span class="r-name">${esc(c.name)}</span>
      <span class="r-bar"><span style="width:${((c.share / top) * 100).toFixed(1)}%"></span></span>
      <span class="r-num num">${c.months}개월 · ${c.share.toFixed(1)}%</span>
      <span class="r-run num">한 번 들어가면 평균 ${c.meanRun.toFixed(1)}개월 (${c.episodes}번)</span>
    </div>`;
  }).join("");
}

(function render() {
  set("asof", `${B9.asOf} 기준 · 표본 ${B9.sampleFrom.slice(0, 4)}~${B9.sampleTo.slice(0, 4)}`);
  set("lede",
    "금리 카드는 '금리가 높은지'를 판정하지 않았습니다. 그 답은 여기 있습니다 — "
    + "같은 높은 금리가 호황이면 건전함이고 불황이면 다른 이야기이기 때문입니다. "
    + "물가와 일자리를 같이 놓고 봅니다.");

  set("nowTitle", "지금 어디에 있나");
  const box = document.getElementById("nowBox");
  if (box) box.innerHTML = nowBox();

  set("gridTitle", "여섯 칸");
  set("gridNote",
    "위로 갈수록 물가가 목표보다 높고, 왼쪽으로 갈수록 일자리가 남습니다. "
    + "가운데 열은 '일자리는 평범하다'입니다. 색은 지금 있는 칸 하나에만 켭니다.");
  const host = document.getElementById("grid");
  if (host) host.innerHTML = grid();
  set("axisNote",
    `← 일자리가 남는다   ·   가운데 ±${B9.band.toFixed(1)}%p = 평범   ·   일자리가 빠듯하다 →`);

  set("histTitle", "이 칸들이 과거에 얼마나 흔했나");
  set("histNote",
    `${B9.sampleFrom.slice(0, 7)} ~ ${B9.sampleTo.slice(0, 7)} · ${B9.sampleMonths}개월을 줄 세워 센 것입니다. `
    + "들어간 기간의 비중과, 한 번 들어가면 평균 몇 달 머물렀는지를 같이 적었습니다.");
  const hh = document.getElementById("hist");
  if (hh) hh.innerHTML = hist();

  set("readTitle", "읽는 법");
  set("read1",
    "① 이 칸은 '지금 어디인가'를 말합니다. '과거에 이 칸이면 이랬다'는 말하지 않습니다 — "
    + "과거 추정치는 나중에 크게 고쳐지고, 고쳐지면 부호까지 바뀌는 일이 절반에 가깝습니다.");
  set("read2",
    "② 완전고용으로 보는 선은 시대마다 다릅니다. 1978년에는 6.24%였고 지금은 "
    + `${B9.natural.toFixed(2)}% 입니다. 그래서 각 달을 그 달의 선으로 재습니다 — `
    + "지금 선 하나를 과거에 바르면 네 번에 한 번은 답이 뒤집힙니다.");
  set("read3",
    "③ 물가 쪽에는 가운데 띠가 없습니다. 목표 2%는 연준이 숫자로 밝힌 값이고, "
    + "완전고용 선은 추정값이기 때문입니다. 밝힌 값에는 폭을 두지 않습니다.");

  set("foot1",
    `물가 = 근원 PCE 전년대비(FRED PCEPILFE) · 일자리 = 실업률(UNRATE) · `
    + `완전고용 선 = 자연실업률(NROU · ${B9.nrouFrom.slice(0, 4)}년부터 ${B9.nrouMin}~${B9.nrouMax}% 사이).`);
  set("foot2",
    `표본을 ${B9.sampleFrom.slice(0, 4)}년부터 잡은 이유: 연준이 2% 목표를 숫자로 밝힌 것은 `
    + "2012년이고, 1970년대의 실제 목표는 8%가 넘었다는 추정이 있습니다. "
    + `그 전까지 거슬러 "목표 대비 차이"를 계산하면 거짓이 됩니다.`);
  // ⛔스크립트 경로와 **수집기 결함 메모**를 화면에서 뺀다 — 둘 다 개발자가 알 사항이지
  //   독자가 읽을 사항이 아니다(정헌도 2026-10-04 · 거시 화면에서 같은 것을 걷어냈다).
  //   ⚠️**고백을 지우는 것이 아니다** — 중복 행의 원인·실측·처방은 `scripts/macro_db.py`
  //   머리말과 이 폴더 README 에 그대로 있다. 그리고 덮은 뒤 값은 **옳다**(개정값을 쓴다)
  //   ⇒ 독자가 그 사실로 할 일이 없다. `dupRows` 파생값 자체는 남겨 둔다(게이트·조사용).
  set("foot3",
    "숫자는 전부 미국 연방준비제도 통계에서 자동으로 계산합니다. "
    + "손으로 적은 숫자는 한 개도 없습니다.");
})();
