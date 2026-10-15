/* 금리 카드 세 장을 그린다. 숫자는 전부 rates-data.js(파생물)에서 온다.
 *
 * ⛔색은 **1년 변화의 과거 순위**에만 켠다. 수준(지금 몇 %인가)에는 색을 켜지 않는다 —
 * 같은 5.24% 가 최근 25년으로는 거의 맨 위고 1962년 이후로는 가운데다. 창을 고르는
 * 순간 답이 정해지므로 **고르지 않고 둘 다 적는다**.
 * ⛔한 카드에 색은 하나다. 구간을 색으로 다 칠하지 않는다.
 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const set = (id, text) => {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
};

const BAND_WORD = {
  calm: "평소 범위",
  brisk: "평소보다 빠름",
  fast: "이례적으로 빠름",
};

/** 띠 위 위치(%) — 0 부터 꼬리 끝까지를 눈금으로 쓴다. 0~100 으로 묶는다. */
const mark = (value, max) => Math.max(0, Math.min(100, (value / max) * 100));

function card(d) {
  const moved = Math.abs(d.change).toFixed(2);
  const bandWord = BAND_WORD[d.band];
  const at = d.step === "월" ? `${d.asOf.slice(0, 7)} 월평균` : d.asOf;

  return `<article class="c c-${esc(d.band)}">
  <header class="c-h">
    <div>
      <h3>${esc(d.name)}</h3>
      <p class="c-blurb">${esc(d.blurb)}</p>
    </div>
    <div class="c-now">
      <strong class="num">${d.now.toFixed(2)}<span class="pc">%</span></strong>
      <span class="c-at num">${esc(at)}</span>
    </div>
  </header>

  <div class="c-move">
    <p class="c-move-h">
      <span>1년 동안 <strong class="num">${moved}%p</strong> ${esc(d.direction)}</span>
      <span class="tag" aria-label="움직임 빠르기: ${esc(bandWord)}">${esc(bandWord)}</span>
    </p>
    <div class="bar" role="img"
         aria-label="과거 ${d.years}년의 1년 움직임 ${d.changeSamples}번 가운데 지금은 ${esc(d.changeRankText)}">
      <span class="bar-fill" style="width:${mark(Math.abs(d.change), d.changeMax).toFixed(1)}%"></span>
      <span class="bar-cut" style="left:${mark(d.briskAt, d.changeMax).toFixed(1)}%"></span>
      <span class="bar-cut bar-cut-2" style="left:${mark(d.fastAt, d.changeMax).toFixed(1)}%"></span>
    </div>
    <p class="c-scale num">
      지금 ${moved}%p · 빠름 선 ${d.briskAt.toFixed(2)}%p · 이례 선 ${d.fastAt.toFixed(2)}%p ·
      ${d.years}년 최대 ${d.changeMax.toFixed(2)}%p
    </p>
    <p class="c-why">
      과거 ${d.years}년에 1년 사이 이만큼 움직인 일은 <strong>${esc(d.changeRankText)}</strong>입니다
      (움직임 ${d.changeSamples.toLocaleString("ko-KR")}번을 줄 세워 봤습니다).
    </p>
  </div>

  <div class="c-level">
    <p class="c-level-h">지금 수준 — 창을 어떻게 잡느냐로 갈립니다</p>
    <ul>
      <li><span class="w">최근 ${d.narrowYears}년</span>
          <span class="v">${esc(d.narrowText)}</span>
          <span class="m num">그 ${d.narrowYears}년의 가운데는 ${d.narrowMedian.toFixed(2)}%</span></li>
      <li><span class="w">${d.wideSince}년부터 전부</span>
          <span class="v">${esc(d.wideText)}</span>
          <span class="m num">${d.years}년의 가운데는 ${d.wideMedian.toFixed(2)}%</span></li>
    </ul>
    <p class="c-nojudge">이 카드는 금리가 높은지 낮은지 <strong>판정하지 않습니다.</strong>
      어느 한 창을 고르는 순간 답이 정해지기 때문입니다.</p>
  </div>

  <p class="c-src">숫자 출처 FRED <span class="num">${esc(d.id)}</span> ·
    ${esc(d.since)} 이후 ${d.obs.toLocaleString("ko-KR")}개 ·
    빠름·이례 두 선은 <strong>우리가 계산한 것</strong>이고 바깥이 공표한 선이 아닙니다.</p>
</article>`;
}

(function render() {
  const latest = RATES.map((d) => d.asOf).sort().at(-1);
  set("asof", `${latest} 기준 · 금리 ${RATES.length}종`);
  set("lede",
    "미국 돈값을 세 층으로 봅니다 — 연준이 정하는 단기 금리, 그리고 시장이 값을 매기는 "
    + "2년·10년 국채. 색은 '얼마나 빨리 움직였나'에만 켭니다.");

  const host = document.getElementById("cards");
  if (host) host.innerHTML = RATES.map(card).join("\n");

  set("readTitle", "읽는 법");
  set("read1",
    "① 큰 숫자는 지금 금리입니다. 그 아래 띠는 '지난 1년 움직임이 과거와 비교해 어디쯤인가'"
    + "입니다. 올랐든 내렸든 크기만 봅니다 — 빠른 하락도 사건이기 때문입니다.");
  set("read2",
    "② 수준에는 색이 없습니다. '높다'는 데이터에 없고 창 길이가 만듭니다. 그래서 두 창을 "
    + "나란히 적었습니다. 둘이 엇갈릴 때가 정상입니다.");
  set("read3",
    "③ '그래서 지금 금리가 높은 건가'는 이 카드가 답하지 않습니다. 호황의 높은 금리는 건전함이고 "
    + "불황의 높은 금리는 다른 이야기입니다. 그 판단은 물가·고용과 함께 보는 카드가 할 일입니다.");

  set("foot1",
    "빠름 선(4번에 한 번)과 이례 선(10번에 한 번)은 우리가 고른 자리입니다. "
    + "바깥 기관이 공표한 금리 경계는 찾지 못했습니다 — 없으면 없다고 적습니다.");
  // ⛔스크립트 경로를 화면에 두지 않는다 — 독자가 아니라 **개발자가 알 사항**이다
  //   (정헌도 2026-10-04: "개발자가 알아야 할 사항이지 페이지 독자가 읽어야 할 사항이 아니에요").
  //   "손으로 적지 않았다" 는 독자에게 **신뢰의 근거**라 남기고, 파일 이름만 뺀다.
  set("foot2",
    "숫자는 전부 미국 연방준비제도 통계에서 자동으로 계산합니다. "
    + "손으로 적은 숫자는 한 개도 없습니다.");
})();
