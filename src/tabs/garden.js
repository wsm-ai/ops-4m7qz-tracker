/* ── Garden / Grove of the World Tree ────────────────────────────────────────
   Renders the ten Sacred Path idols. Each idol's glow reflects accumulated
   Path XP; the skill dots below each idol show which skills have awakened
   and which remain dormant within that Path. */

/* CSS color → approximate RGB triple for rgba() glow effects */
const PATH_RGB = {
  tactical:"156,74,52",      // --blood
  physical:"111,158,84",     // --jade
  cognitive:"124,147,168",   // --violet
  physiological:"124,147,168",
  technical:"200,119,46",    // --ember
  leadership:"184,160,106",  // --gold
  academic:"184,160,106",
  personal:"111,158,84",
  hearth:"200,119,46",
  roots:"111,158,84",
};

function renderGarden(){
  const el=document.getElementById("gardenGrid");
  if(!el) return;

  el.innerHTML=SK_CAT_ORDER.map(cat=>{
    const pm=PATH_META[cat];
    if(!pm) return "";
    const xp=(S.pathXP&&S.pathXP[cat])||0;
    const lvData=skillLevel(xp);
    const lvl=lvData.lvl;
    const pct=Math.round(lvData.into/lvData.need*100);

    // Visual state based on level
    const grayAmt = lvl<=1?80:lvl<=3?50:lvl<=5?20:0;
    const opacity  = lvl<=1?.45:lvl<=3?.65:1;
    const glowClass= lvl>=7?"radiant":lvl>=4?"lit":"";

    // Skill dots: leaf skills (no group, no parent) in this path
    const pathSkills=S.lifeSkills.filter(sk=>sk.cat===cat&&!sk.group);
    // Sort: active (has level) first, then dormant
    const active=pathSkills.filter(sk=>(sk.currentLevel||0)>0);
    const dormant=pathSkills.filter(sk=>(sk.currentLevel||0)<=0);
    const showSkills=[...active,...dormant].slice(0,8);
    const extra=pathSkills.length-showSkills.length;

    const dotsHtml=showSkills.map(sk=>{
      const isActive=(sk.currentLevel||0)>0;
      const lvLabel=isActive?` L${sk.currentLevel}`:"";
      return `<span class="garden-dot ${isActive?"active":"dormant"}" title="${esc(sk.name)}${isActive?" (L"+sk.currentLevel+")":" — dormant"}">${esc(sk.name.length>14?sk.name.slice(0,13)+"…":sk.name)}${lvLabel}</span>`;
    }).join("")+(extra>0?`<span class="garden-more">+${extra} more</span>`:"");

    // Lore: first sentence only for compactness
    const loreShort=pm.lore.split(".")[0]+".";

    const rgb=PATH_RGB[cat]||"184,160,106";

    return `<div class="garden-card ${glowClass}" style="--path-color:${pm.color};--path-rgb:${rgb};--idol-gray:${grayAmt}%;--idol-opacity:${opacity}">
      <div class="garden-idol">${pm.icon}</div>
      <div class="garden-idol-name">${pm.idol}</div>
      <div class="garden-path-name">${pm.name}</div>
      <div class="garden-level">Level ${lvl} · ${xp} XP total</div>
      <div class="garden-bar"><div class="garden-bar-fill" style="width:${pct}%"></div></div>
      <div class="garden-lore">${loreShort}</div>
      ${pathSkills.length?`<div class="garden-skills">${dotsHtml}</div>`:""}
    </div>`;
  }).join("");
}
