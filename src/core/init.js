/* ---------------- Service worker (offline) ---------------- */
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{});}

seedSkillsIfEmpty();
render();

