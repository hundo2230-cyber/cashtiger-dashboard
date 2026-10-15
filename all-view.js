/* 메인 타일 다섯 장을 그린다. 숫자·판정말은 전부 all-data.js(파생물)에서 온다.
 *
 * ⛔여기서 판정을 **새로 짓지 않는다**. "평소 범위"·"물가만 높음"·"평소보다 조용" 은
 * 상세 화면이 쓰는 말 그대로이고, `derive_unified_dashboard.py` 가 각 카드의 원천에서
 * 읽어와 넣는다. 여기 다시 적으면 메인과 상세가 조용히 갈린다.
 *
 * ⛔타일에 **예측을 붙이지 않는다** — "조용한 것이 위험" 같은 말은 우리 자료로 재현되지
 * 않았다(VIX 카드 실측). 타일은 *지금 어디인가*만 말한다.
 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const set = (id, text) => {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
};

/** 타일 하나. 전체가 링크다 — 누르는 자리가 작으면 폰에서 못 누른다. */
function tile(t) {
  return `<a class="tile b-${esc(t.band)}" href="${esc(t.href)}">
  <p class="t-name">${esc(t.name)}</p>
  <strong class="t-value num">${esc(t.value)}</strong>
  <span class="t-verdict">${esc(t.verdict)}</span>
  <span class="t-note">${esc(t.note)}</span>
  <span class="t-at num">${esc(t.asOf)} 기준 · <span class="t-go">자세히 →</span></span>
</a>`;
}

/** 타일들의 기준일 중 **가장 낡은 것**을 머리에 적는다.
 *
 * ⛔가장 새 것을 적으면 화면 전체가 그날치인 줄로 읽힌다 — 물가·고용은 월별이라
 * 금리·변동성보다 **두 달쯤 뒤처진다**(2026-10-11 실측: 08-01 vs 10-01).
 */
function oldest(list) {
  return list.map((t) => t.asOf).sort()[0];
}

function render(list) {
  const box = document.getElementById("tiles");
  if (box) box.innerHTML = list.map(tile).join("\n");

  set("asof", `${oldest(list)} 기준`);
  // ⛔신선도도 **파생물에서 온다** — 같은 소스로 두 판본(발행 스냅샷 · 로컬 자동)을 만든다.
  set("fresh", FRESH);
  set(
    "lede",
    `미국 경제를 재는 눈금 ${list.length}개입니다. 타일마다 지금 값과 ` +
      `한 줄 판정이 있고, 누르면 그 눈금의 상세 화면으로 갑니다.`,
  );

  set("readTitle", "읽는 법");
  set(
    "read1",
    "왼쪽 띠 색은 지금 단계입니다 — 파랑은 평소 범위, 노랑은 평소보다 빠른 쪽, " +
      "주황은 이례적인 쪽입니다. 색은 띠에만 쓰고 숫자에는 쓰지 않습니다.",
  );
  set(
    "read2",
    "기준일이 눈금마다 다릅니다. 금리와 변동성은 매일 나오고, 물가와 고용은 " +
      "한 달에 한 번 나와서 더 뒤처집니다. 머리에 적힌 날짜는 그중 가장 낡은 것입니다.",
  );
  set(
    "read3",
    "판정은 모두 역사와 비교한 것입니다 — 각 눈금이 언제부터 몇 개 관측을 " +
      "썼는지는 상세 화면에 적혀 있습니다.",
  );

  // ⛔꼬리말에 **우리 쪽 파일 이름을 적지 않는다** — 독자가 할 일이 없는 정보다
  //   (`DEV_META` 그물이 잡는다 · 2026-10-06 에 세 화면에서 걷어낸 것과 같은 결함).
  set(
    "foot1",
    "숫자는 전부 미국 연방준비제도 공개 통계에서 자동으로 계산합니다. " +
      "손으로 적은 숫자는 없습니다.",
  );
  set(
    "foot2",
    "이 화면은 지금 어디인지만 말하고 앞으로 어떻게 될지는 판정하지 않습니다. " +
      "상세 화면 셋은 각각 따로 보던 것과 같은 화면이고, 모아 놓기만 했습니다.",
  );
}

render(TILES);
