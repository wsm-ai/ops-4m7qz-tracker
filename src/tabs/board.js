function renderBoard(){
  const list=document.getElementById("boardList");
  if(!list) return;
  document.getElementById("branchGoalHint").textContent="goal: "+(S.branchGoal||"Cyber");
  const done=S.boardTasks.filter(t=>t.done).length;
  document.getElementById("boardProg").textContent=done+"/"+S.boardTasks.length+" complete";
  list.innerHTML=S.boardTasks.map(t=>`<li class="card board-item ${t.done?'done':''}">
    <div class="check" data-bt="${t.id}">${t.done?'✓':''}</div>
    <div class="c-body"><div class="c-name">${esc(t.name)}</div></div>
    <button class="del" data-dbt="${t.id}">✕</button>
  </li>`).join("");
}
document.body.addEventListener("click",e=>{
  const t=e.target;
  if(t.dataset.bt){const task=S.boardTasks.find(x=>x.id===t.dataset.bt);if(task){const was=task.done;task.done=!task.done;if(!was&&task.done){grant(20,10,"Board prep task done","knowledge");}else{save();render();}}return;}
  if(t.dataset.dbt){S.boardTasks=S.boardTasks.filter(x=>x.id!==t.dataset.dbt);save();render();return;}
});
const _btAdd=document.getElementById("btAdd");
if(_btAdd) _btAdd.onclick=()=>{
  const n=document.getElementById("btName").value.trim();if(!n)return;
  S.boardTasks.push({id:id(),name:n,done:false});
  document.getElementById("btName").value="";save();render();
};

