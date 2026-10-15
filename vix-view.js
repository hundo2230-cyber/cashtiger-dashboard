/* VIX 카드 한 장을 그린다. 숫자는 전부 vix-data.js(파생물)에서 온다.
 *
 * ⭐축은 **"평소의 몇 배"** 다. 순위(0~100)를 축으로 쓰면 꼬리에서 바늘이 죽는다 —
 * VIX 40→60(위기 심화)이 순위로는 +1.8 밖에 안 움직이는데, 16.2→17.6(아무 일 없음)은
 * +9.3 이다. 분포가 오른쪽으로 7.7배 길어서 생기는 일이다. 기준점 1.00배는 우리 창작이
 * 아니라 Cboe 가 공표한 유일한 수치(17.6)이고 우리 계산이 그것을 재현했다.
 *
 * ⛔한 카드에 색은 하나다. 그리고 **현재 단계에 항상 켠다** — "위험할 때만 켠다"로
 * 만들었더니 7일 중 6일이 무색이었다(실측 17.7%).
 * ⛔낮은 쪽에 예측을 붙이지 않는다. "조용한 것이 위험"은 우리 자료로 재현되지 않았다.
 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const set = (id, text) => {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
};

const fx = (n) => n.toFixed(2);

/** 배수를 눈금 위 위치(%)로 — ⭐**로그 간격**이다. 양끝은 역대 최저·최고 배수.
 *
 * ⛔선형으로 두면 2008·2020 꼬리(4.71배)가 축을 독점해 **실제로 쓰는 구간이 왼쪽
 * 4분의 1에 짓눌린다**: 0.93배가 9.8% · 1.00배가 11.5% · 1.47배가 22.7% 로 셋이
 * 서로 붙어 버린다. 로그로 두면 26.4% · 29.7% · 47.1% 로 벌어진다.
 *
 * ⭐배수는 **비율**이므로 같은 시각 거리가 같은 배율이어야 한다 — 0.5배↔1배 와
 * 1배↔2배 가 같은 폭이다. 눈금 글자는 그대로 배수로 적으니 읽는 법은 안 바뀐다.
 */
const mark = (m, lo, hi) => {
  const t = (Math.log(m) - Math.log(lo)) / (Math.log(hi) - Math.log(lo));
  return Math.max(0, Math.min(100, t * 100));
};

function card(d) {
  const lo = d.allLowMultiple;
  const hi = d.allHighMultiple;
  const at = (m) => mark(m, lo, hi).toFixed(1);

  return `<article class="c c-${esc(d.band)}">
  <header class="c-h">
    <div>
      <h3>${esc(d.name)}</h3>
      <p class="c-blurb">${esc(d.blurb)}</p>
    </div>
    <div class="c-now">
      <strong class="num">${fx(d.now)}</strong>
      <span class="c-at num">${esc(d.asOf)}</span>
    </div>
  </header>

  <div class="c-move">
    <p class="c-move-h">
      <span>평소의 <strong class="num">${fx(d.multiple)}배</strong></span>
      <span class="tag" aria-label="지금 단계: ${esc(d.bandText)}">${esc(d.bandText)}</span>
    </p>

    <div class="bar" role="img"
         aria-label="평소(${fx(d.median)})를 1배로 놓으면 지금은 ${fx(d.multiple)}배입니다. 역대 범위는 ${fx(lo)}배에서 ${fx(hi)}배입니다.">
      <span class="bar-fill" style="width:${at(d.multiple)}%"></span>
      <span class="bar-cut" style="left:${at(1)}%"></span>
      <span class="bar-cut bar-cut-2" style="left:${at(d.academicMultiple)}%"></span>
      <span class="bar-pin" style="left:${at(d.multiple)}%"></span>
    </div>
    <p class="c-scale num">
      ${fx(lo)}배(${fx(d.allLow)}) · 평소 1.00배(${fx(d.median)}) ·
      ${fx(d.academicMultiple)}배(${fx(d.academicLevel)}) · ${fx(hi)}배(${fx(d.allHigh)})
    </p>
    <p class="c-why">${esc(d.verdict)}</p>
  </div>

  <div class="c-level">
    <p class="c-level-h">이 자의 두 눈금은 어디서 왔나</p>
    <ul>
      <li><span class="w">1.00배 = ${fx(d.median)}</span>
          <span class="v">바깥이 공표</span>
          <span class="m num">Cboe "long-term median ${d.publishedMedian}" · 우리 계산 ${fx(d.median)}</span></li>
      <li><span class="w">${fx(d.academicMultiple)}배 = ${fx(d.academicLevel)}</span>
          <span class="v">학술이 꼽는 자리</span>
          <span class="m num">Bansal &amp; Stivers, Financial Management 2025</span></li>
      <li><span class="w">세간이 말하는 30</span>
          <span class="v">${fx(d.streetMultiple)}배</span>
          <span class="m num">공표가 아닙니다 — 번역만 해 둡니다</span></li>
    </ul>
    <p class="c-nojudge">이 카드는 주가가 오를지 내릴지 <strong>판정하지 않습니다.</strong>
      재는 것은 절대 수준이 아니라 <strong>평소보다 얼마나 튀는가</strong>입니다.
      조용한 쪽도 경고가 아닙니다 — 아래 꼬리말을 보세요.</p>
  </div>

  <div class="c-level">
    <p class="c-level-h">맥락</p>
    <ul>
      <li><span class="w">최근 1년</span>
          <span class="v num">${fx(d.recentLow)} ~ ${fx(d.recentHigh)}</span>
          <span class="m num">평소의 ${fx(d.recentLowMultiple)}~${fx(d.recentHighMultiple)}배</span></li>
      <li><span class="w">역대 최고</span>
          <span class="v num">${fx(d.allHigh)}</span>
          <span class="m num">${esc(d.allHighDate)} · 평소의 ${fx(hi)}배</span></li>
      <li><span class="w">각 단계로 보낸 날</span>
          <span class="v num">${d.shareQuiet}% / ${d.shareChoppy}% / ${d.shareStormy}%</span>
          <span class="m">평소보다 조용 / 들썩 / 크게 들썩</span></li>
    </ul>
  </div>

  <p class="c-src">숫자 출처 FRED <span class="num">${esc(d.id)}</span> ·
    ${esc(d.since)} 이후 ${d.obs.toLocaleString("ko-KR")}개(${d.years}년) ·
    같은 날짜를 여러 번 받은 것 ${d.dupes}건 — 값이 달라졌으면 가장 늦게 받은 쪽을
    씁니다(미국 연방준비제도는 과거 값을 나중에 고칩니다).</p>
</article>`;
}

(function render() {
  set("asof", `${VIX.asOf} 기준`);
  set("lede",
    "미국 주식시장이 앞으로 한 달 얼마나 출렁일지에 사람들이 돈을 걸고 있는 값입니다. "
    + "절대 수치가 아니라 '평소보다 얼마나 튀는가'로 읽습니다.");

  const host = document.getElementById("cards");
  if (host) host.innerHTML = card(VIX);

  set("readTitle", "읽는 법");
  set("read1",
    "① 큰 숫자가 지금 값이고, 그 아래가 '평소의 몇 배인가'입니다. 평소는 "
    + `${fx(VIX.median)} 이고, 이 수는 우리가 고른 것이 아니라 Cboe 가 공표한 값입니다.`);
  set("read2",
    "② 왜 배수로 재느냐 — 이 값은 아래쪽이 좁고 위쪽이 깁니다. 순서로만 줄 세우면 "
    + "위기 때 20이 치솟아도 바늘이 거의 안 움직입니다. 배수로 재면 양끝이 다 살아납니다.");
  set("read3",
    "③ 이 카드는 앞일을 맞히지 않습니다. Cboe 자신도 이 값이 '내일의 시장 움직임을 "
    + "알려주지 않는다'고 못 박아 두었습니다.");

  set("foot1",
    "조용한 쪽에 경고를 붙이지 않았습니다. '조용할 때가 위험하다'는 말이 있고 연준 연구도 "
    + "그런 결론을 냈지만, 그 연구가 맞힌 것은 은행위기입니다. 우리가 잴 수 있는 사건 두 가지"
    + "(이 값의 급등 · 나스닥 하락)로 1990년부터 재보니 조용한 뒤가 평소보다 오히려 "
    + "덜 위험했습니다. 그래서 적지 않았습니다.");
  set("foot2",
    "숫자는 전부 미국 연방준비제도 통계에서 자동으로 계산합니다. "
    + "손으로 적은 숫자는 한 개도 없습니다.");
})();
