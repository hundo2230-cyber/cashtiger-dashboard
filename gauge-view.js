/* 거시 계기를 그린다. 숫자와 **바늘 위치까지** gauge-data.js(파생물)에서 온다.
 *
 * ⛔위치를 여기서 계산하지 않는다 — 화면이 위치를 발명하면 자료와 어긋나도 아무도 모른다.
 *   `pos`·`marks[].pos` 는 파생 단계에서 값으로부터 나온 수다. 여기서는 %로만 바꾼다.
 * ⛔구간을 색으로 칠하지 않는다(레드존 금지). 2026-10-04 사고 = 근거 없는 색이 판정을 대신했다.
 *   색은 **바늘 하나**에만 쓰고, 뜻은 **기준선과 글**이 말한다.
 * ⛔판정하지 않는다 — "사세요/파세요" 를 쓰지 않는다. 지금 어디인지만 보여준다.
 */

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const set = (id, text) => {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
};

const put = (id, html) => {
  const node = document.getElementById(id);
  if (node) node.innerHTML = html;
};

const pc = (ratio) => `${(ratio * 100).toFixed(2)}%`;

/* ⛔**읽는 방향을 기하로 말하지 않는다.** 두 번 틀렸다(2026-10-16):
 *   ⒜"가운데가 평소" — 선이 축의 가운데가 아니다(목표 2.0 은 축의 21% 지점 · 가동률 24%)
 *   ⒝"세로선 근처가 평소" — 실업률 갭의 ±0.9 두 선은 **구간의 경계**라 평소는 선 '근처' 가
 *     아니라 두 선 **사이**다 (Codex 교차 검수가 찍었다)
 * ⇒ 이제 명세의 `compare`(무엇과 비교하나)만 적고 **위치를 주장하지 않는다**. */

const numberOf = (g) => `${g.value.toFixed(2)}${g.unit}`;

function marks(g) {
  return g.marks
    .map(
      (m) => `<span class="g-mark" style="left:${pc(m.pos)}">
        <span class="g-mark-tick" aria-hidden="true"></span>
        <span class="g-mark-label">${esc(m.label)}</span>
      </span>`,
    )
    .join("");
}

function one(g) {
  const lower = Math.round(g.pct);
  const since = g.sampleFrom.slice(0, 7).replace("-", "년 ") + "월";
  const noLine = g.marks.length === 0;
  return `<article class="g" aria-label="${esc(g.name)} ${esc(numberOf(g))}">
    <header class="g-head">
      <h3>${esc(g.name)}</h3>
      <span class="g-value num">${esc(numberOf(g))}</span>
    </header>
    <p class="g-blurb">${esc(g.blurb)}</p>
    <div class="g-scale" role="img"
      aria-label="${esc(g.name)}는 ${esc(numberOf(g))}이고, 축은 ${g.axisLo}부터 ${g.axisHi}까지입니다.">
      <span class="g-needle" style="left:${pc(g.pos)}">
        <span class="g-needle-mark" aria-hidden="true">▼</span>
      </span>
      <span class="g-track" aria-hidden="true"></span>
      ${marks(g)}
    </div>
    <div class="g-ends num" aria-hidden="true">
      <span>${g.axisLo}</span><span>${g.axisHi}</span>
    </div>
    <p class="g-where">${since} 이후 기록 <strong>${g.sampleN.toLocaleString("ko-KR")}</strong>개 가운데
      <strong>${lower}%</strong>가 지금보다 낮았습니다.${
        g.clamped ? " 지금 값은 축 밖이라 끝에 붙여 두었습니다." : ""
      }</p>
    <p class="g-reading">${esc(g.compare)}</p>
    ${noLine ? `<p class="g-noline">세로선을 긋지 않았습니다. ${esc(g.marksAbsentReason)}</p>` : ""}
    <p class="g-src">숫자 출처: ${esc(g.source)} · 기준일 ${esc(g.asOf)}</p>
  </article>`;
}

set("asof", `기준일 ${GAUGE.asOf}`);
set("fresh", "매일 아침 06:10 자동 갱신");
set(
  "lede",
  `미국 경기를 보는 계기 ${GAUGE.gauges.length}개입니다. 바늘은 지금 값이 그 지표의 과거 기록 안에서 ` +
    "어디인지를 가리킵니다. 세로선은 **그 지표 자체**에 공표된 경계만 그렸고, 기준이 다른 지표의 " +
    "선은 긋지 않았습니다. 선이 없는 계기에는 왜 없는지를 적어 두었습니다.",
);
set("gaugesTitle", `계기 ${GAUGE.gauges.length}개`);
set(
  "gaugesNote",
  "축의 양끝은 그 지표 과거 기록의 **아래쪽 2% 지점과 위쪽 98% 지점**입니다. "
    + "맨 끝 값을 쓰면 축이 눌려 읽기 어려워서 그렇게 잘랐습니다. 우리가 정한 범위가 아니라 "
    + "그 지표 자기 기록에서 나온 값입니다. 지금 값이 그 밖이면 바늘을 끝에 붙이고 그렇게 적습니다.",
);
put("gauges", GAUGE.gauges.map(one).join(""));

set("readTitle", "읽는 법");
set(
  "read1",
  "바늘이 오른쪽에 있다고 좋은 것은 아닙니다. 지표마다 무엇과 비교하는지가 다르고, 그것을 각 " +
    "계기에 적어 두었습니다. 이 화면은 어느 쪽이 좋다고 말하지 않습니다.",
);
set(
  "read2",
  "세로선은 발표 기관이 **그 지표에 대해** 말한 경계만 그립니다. 다른 지표의 기준을 끌어다 " +
    "그으면 틀린 선이 됩니다 — 실제로 처음 판에서 그런 선 넷을 그었다가 걷어냈습니다.",
);
set(
  "read3",
  "구간을 색으로 칠하지 않았습니다. 색은 근거 없이도 판정처럼 보이기 때문입니다. 지금 어디인지는 " +
    "보여주고, 그래서 무엇을 할지는 말하지 않습니다.",
);

set("foot1", `실업률 갭의 두 선 ±${GAUGE.band.toFixed(1)}은 1997년 한 논문이 특정 시점·모형에서 낸 구간의 반폭입니다. `
  + "모든 시점의 추정 오차를 뜻하지는 않습니다 — 그 폭을 그대로 쓰고 있다는 사실만 적어 둡니다.");
set(
  "foot2",
  "실업률 갭은 달마다 그 시점의 자연 실업률과 짝지어 계산합니다. 자연 실업률은 분기 자료이고 " +
    "미래 추계까지 들어 있어, 최신값끼리 빼면 올해 실업률에서 10년 뒤 추계를 빼게 됩니다.",
);
set("foot3", "이 화면은 투자 권유가 아닙니다. 지표를 보여줄 뿐이고, 판단은 보는 사람의 것입니다.");
