/* Student Management System: shared data + page logic. Data is kept in the browser (localStorage). */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const grade=m=>m>=70?'A':m>=60?'B':m>=50?'C':m>=40?'D':'F';
const day=o=>new Date(Date.now()-o*864e5).toLocaleDateString('en-CA');
const KEY='sms_data_v1';

const SEED={
 students:[
  {id:'S001',name:'Amina Yusuf',email:'amina.yusuf@school.edu',course:'ICT101',year:1,status:'Active'},
  {id:'S002',name:'Brian Okello',email:'brian.okello@school.edu',course:'ICT101',year:1,status:'Active'},
  {id:'S003',name:'Chloe Mensah',email:'chloe.mensah@school.edu',course:'BUS201',year:2,status:'Active'},
  {id:'S004',name:'Daniel Kimani',email:'daniel.kimani@school.edu',course:'CSC110',year:1,status:'Active'},
  {id:'S005',name:'Esther Wanjiru',email:'esther.wanjiru@school.edu',course:'MAT120',year:2,status:'Inactive'},
  {id:'S006',name:'Farid Hassan',email:'farid.hassan@school.edu',course:'CSC110',year:3,status:'Active'},
  {id:'S007',name:'Grace Achieng',email:'grace.achieng@school.edu',course:'BUS201',year:2,status:'Active'},
  {id:'S008',name:'Hassan Omar',email:'hassan.omar@school.edu',course:'ICT101',year:3,status:'Active'}],
 courses:[
  {code:'ICT101',name:'Introduction to ICT',lecturer:'Dr. A. Njoroge',credits:3},
  {code:'CSC110',name:'Programming Basics',lecturer:'Ms. R. Patel',credits:4},
  {code:'BUS201',name:'Business Studies',lecturer:'Mr. J. Banda',credits:3},
  {code:'MAT120',name:'Applied Mathematics',lecturer:'Dr. L. Otieno',credits:4}],
 results:[
  {sid:'S001',course:'ICT101',mark:78},{sid:'S002',course:'ICT101',mark:64},{sid:'S003',course:'BUS201',mark:55},
  {sid:'S004',course:'CSC110',mark:82},{sid:'S005',course:'MAT120',mark:38},{sid:'S006',course:'CSC110',mark:71},
  {sid:'S007',course:'BUS201',mark:67},{sid:'S008',course:'ICT101',mark:49}],
 attendance:{}
};
[1,2,3].forEach(i=>{SEED.attendance[day(i)]={};SEED.students.forEach((s,j)=>{SEED.attendance[day(i)][s.id]=(j+i)%7===0?'Absent':(j*i)%5===0?'Late':'Present'})});

function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.students)return d}catch(e){}return JSON.parse(JSON.stringify(SEED))}
let DB=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}

const sName=id=>(DB.students.find(s=>s.id===id)||{name:'(removed)'}).name;
const cName=c=>(DB.courses.find(x=>x.code===c)||{name:c}).name;
const nextId=()=>'S'+String(Math.max(0,...DB.students.map(s=>+s.id.slice(1)))+1).padStart(3,'0');
const opts=(arr,v,l)=>arr.map(x=>`<option value="${esc(x[v])}">${esc(x[l])}</option>`).join('');
const badge=t=>`<span class="badge ${t}">${t}</span>`;
const none=n=>`<tr><td colspan="${n}" class="empty">Nothing here yet.</td></tr>`;
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('show'),2200)}
function bars(el,rows,max){max=max||Math.max(1,...rows.map(r=>r[1]));el.innerHTML=rows.map(r=>`<div class="bar-row"><span>${esc(r[0])}</span><div class="bar"><i style="width:${Math.round(r[1]/max*100)}%"></i></div><b>${r[1]}</b></div>`).join('')||'<p class="empty">No data yet.</p>'}
function csv(name,rows){const t=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download=name;a.click()}
function attStats(){let p=0,t=0;const per={};Object.values(DB.attendance).forEach(d=>Object.entries(d).forEach(([id,s])=>{t++;per[id]=per[id]||[0,0];per[id][1]++;if(s!=='Absent'){p++;per[id][0]++}}));return{rate:t?Math.round(p/t*100):0,per}}
const avgMark=()=>DB.results.length?Math.round(DB.results.reduce((a,r)=>a+r.mark,0)/DB.results.length):0;

/* Shared layout: sidebar + mobile menu */
const NAV=[['index','Dashboard','🏠'],['students','Student records','👤'],['courses','Courses','📚'],['attendance','Attendance','✅'],['results','Examination results','📝'],['reports','Reports','📊']];
function layout(page){
 $('#sidebar').innerHTML='<div class="brand">Student Management<small>School administration</small></div>'+
  NAV.map(n=>`<a class="nav ${n[0]===page?'active':''}" href="${n[0]}.html"><span>${n[2]}</span>${n[1]}</a>`).join('')+
  '<button class="reset" id="reset">Reset sample data</button>';
 $('#reset').onclick=()=>{if(confirm('Replace all data with the original sample records?')){localStorage.removeItem(KEY);location.reload()}};
 $('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
 $('.main').addEventListener('click',e=>{if(!e.target.closest('#menuBtn'))$('#sidebar').classList.remove('open')});
 const d=$('.date');if(d)d.textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

/* Dashboard */
function pageIndex(){
 const a=attStats();
 $('#stats').innerHTML=[[DB.students.length,'Students enrolled'],[DB.courses.length,'Courses offered'],[a.rate+'%','Overall attendance'],[avgMark()+'%','Average exam mark']].map(c=>`<div class="card"><b>${c[0]}</b><span>${c[1]}</span></div>`).join('');
 $('#recent').innerHTML=DB.students.slice(-5).reverse().map(s=>`<tr><td>${s.id}</td><td>${esc(s.name)}</td><td>${esc(cName(s.course))}</td><td>${badge(s.status)}</td></tr>`).join('')||none(4);
 bars($('#bars'),DB.courses.map(c=>[c.code,DB.students.filter(s=>s.course===c.code).length]));
 $('#top').innerHTML=[...DB.results].sort((x,y)=>y.mark-x.mark).slice(0,5).map(r=>`<tr><td>${esc(sName(r.sid))}</td><td>${esc(cName(r.course))}</td><td>${r.mark}</td><td>${badge(grade(r.mark))}</td></tr>`).join('')||none(4);
}

/* Student records */
function pageStudents(){
 $('#course').innerHTML=opts(DB.courses,'code','name');
 let edit=null;const f=$('#form');
 function draw(){
  const q=$('#q').value.toLowerCase(),st=$('#fs').value;
  const list=DB.students.filter(s=>(!st||s.status===st)&&(s.id+s.name+s.email+cName(s.course)).toLowerCase().includes(q));
  $('#tb').innerHTML=list.map(s=>`<tr><td>${s.id}</td><td>${esc(s.name)}</td><td>${esc(s.email)}</td><td>${esc(cName(s.course))}</td><td>${s.year}</td><td>${badge(s.status)}</td><td><button class="btn sm alt" data-e="${s.id}">Edit</button> <button class="btn sm danger" data-d="${s.id}">Delete</button></td></tr>`).join('')||none(7);
  $('#count').textContent=list.length+' of '+DB.students.length+' students';
 }
 function reset(){edit=null;f.reset();$('#saveBtn').textContent='Add student';$('#cancel').hidden=true}
 f.onsubmit=e=>{e.preventDefault();
  const name=$('#name').value.trim(),email=$('#email').value.trim();
  if(!name||!/^\S+@\S+\.\S+$/.test(email)){toast('Enter a name and a valid email address');return}
  const d={name,email,course:$('#course').value,year:+$('#year').value,status:$('#status').value};
  if(edit){Object.assign(DB.students.find(s=>s.id===edit),d);toast('Student updated')}
  else{DB.students.push({id:nextId(),...d});toast('Student added')}
  save();reset();draw()};
 $('#cancel').onclick=reset;$('#q').oninput=draw;$('#fs').onchange=draw;
 $('#tb').onclick=e=>{
  const ed=e.target.dataset.e,del=e.target.dataset.d;
  if(ed){const s=DB.students.find(x=>x.id===ed);edit=ed;$('#name').value=s.name;$('#email').value=s.email;$('#course').value=s.course;$('#year').value=s.year;$('#status').value=s.status;$('#saveBtn').textContent='Save changes';$('#cancel').hidden=false;scrollTo({top:0,behavior:'smooth'})}
  if(del&&confirm('Delete '+sName(del)+' and their results?')){DB.students=DB.students.filter(s=>s.id!==del);DB.results=DB.results.filter(r=>r.sid!==del);save();draw();toast('Student deleted')}};
 draw();
}

/* Courses */
function pageCourses(){
 const f=$('#form');
 function draw(){
  const q=$('#q').value.toLowerCase();
  const list=DB.courses.filter(c=>(c.code+c.name+c.lecturer).toLowerCase().includes(q));
  $('#tb').innerHTML=list.map(c=>`<tr><td>${esc(c.code)}</td><td>${esc(c.name)}</td><td>${esc(c.lecturer)}</td><td>${c.credits}</td><td>${DB.students.filter(s=>s.course===c.code).length}</td><td><button class="btn sm danger" data-d="${esc(c.code)}">Delete</button></td></tr>`).join('')||none(6);
 }
 f.onsubmit=e=>{e.preventDefault();
  const code=$('#code').value.trim().toUpperCase(),name=$('#cname').value.trim();
  if(!code||!name){toast('Enter a course code and name');return}
  if(DB.courses.some(c=>c.code===code)){toast('That course code already exists');return}
  DB.courses.push({code,name,lecturer:$('#lect').value.trim()||'To be assigned',credits:+$('#credits').value||3});
  save();f.reset();draw();toast('Course added')};
 $('#q').oninput=draw;
 $('#tb').onclick=e=>{const c=e.target.dataset.d;if(!c)return;
  if(DB.students.some(s=>s.course===c)){toast('Move the enrolled students to another course first');return}
  if(confirm('Delete course '+c+'?')){DB.courses=DB.courses.filter(x=>x.code!==c);DB.results=DB.results.filter(r=>r.course!==c);save();draw();toast('Course deleted')}};
 draw();
}

/* Attendance */
function pageAttendance(){
 $('#date').value=day(0);$('#fc').innerHTML='<option value="">All courses</option>'+opts(DB.courses,'code','name');
 function draw(){
  const d=$('#date').value,c=$('#fc').value,rec=DB.attendance[d]||{};
  const list=DB.students.filter(s=>s.status==='Active'&&(!c||s.course===c));
  $('#tb').innerHTML=list.map(s=>`<tr><td>${s.id}</td><td>${esc(s.name)}</td><td>${esc(cName(s.course))}</td><td><select data-id="${s.id}"><option value="" ${rec[s.id]?'':'selected'}>Not marked</option>${['Present','Late','Absent'].map(v=>`<option ${rec[s.id]===v?'selected':''}>${v}</option>`).join('')}</select></td></tr>`).join('')||none(4);
  const n=k=>list.filter(s=>(rec[s.id]||'')===k).length;
  $('#sum').textContent=`Present ${n('Present')} · Late ${n('Late')} · Absent ${n('Absent')} · Not marked ${list.length-n('Present')-n('Late')-n('Absent')}`;
 }
 function set(id,v){const d=$('#date').value;if(!d)return;(DB.attendance[d]=DB.attendance[d]||{})[id]=v}
 $('#tb').onchange=e=>{if(e.target.dataset.id){const v=e.target.value,d=$('#date').value;if(v)set(e.target.dataset.id,v);else if(DB.attendance[d])delete DB.attendance[d][e.target.dataset.id];save();draw();toast('Attendance saved')}};
 $('#allPresent').onclick=()=>{document.querySelectorAll('#tb select').forEach(s=>set(s.dataset.id,'Present'));save();draw();toast('Everyone marked present')};
 $('#date').onchange=draw;$('#fc').onchange=draw;draw();
}

/* Examination results */
function pageResults(){
 const fill=()=>{$('#sid').innerHTML=opts(DB.students.map(s=>({id:s.id,l:s.id+' - '+s.name})),'id','l');$('#rc').innerHTML=opts(DB.courses,'code','name')};fill();
 function draw(){
  const q=$('#q').value.toLowerCase();
  const list=DB.results.filter(r=>(sName(r.sid)+cName(r.course)).toLowerCase().includes(q));
  $('#tb').innerHTML=list.map(r=>`<tr><td>${esc(sName(r.sid))}</td><td>${esc(cName(r.course))}</td><td>${r.mark}</td><td>${badge(grade(r.mark))}</td><td><button class="btn sm danger" data-s="${r.sid}" data-c="${esc(r.course)}">Delete</button></td></tr>`).join('')||none(5);
 }
 $('#form').onsubmit=e=>{e.preventDefault();
  const mark=+$('#mark').value,sid=$('#sid').value,course=$('#rc').value;
  if(!sid||!course||$('#mark').value===''||mark<0||mark>100){toast('Choose a student and course, and enter a mark from 0 to 100');return}
  const ex=DB.results.find(r=>r.sid===sid&&r.course===course);
  if(ex){ex.mark=mark;toast('Result updated')}else{DB.results.push({sid,course,mark});toast('Result added')}
  save();$('#mark').value='';draw()};
 $('#q').oninput=draw;
 $('#tb').onclick=e=>{const s=e.target.dataset.s;if(s&&confirm('Delete this result?')){DB.results=DB.results.filter(r=>!(r.sid===s&&r.course===e.target.dataset.c));save();draw();toast('Result deleted')}};
 draw();
}

/* Reports */
function pageReports(){
 const a=attStats(),act=DB.students.filter(s=>s.status==='Active').length,pass=DB.results.filter(r=>r.mark>=40).length;
 $('#stats').innerHTML=[[DB.students.length,'Total students'],[act,'Active students'],[a.rate+'%','Attendance rate'],[(DB.results.length?Math.round(pass/DB.results.length*100):0)+'%','Pass rate']].map(c=>`<div class="card"><b>${c[0]}</b><span>${c[1]}</span></div>`).join('');
 bars($('#gb'),['A','B','C','D','F'].map(g=>[g,DB.results.filter(r=>grade(r.mark)===g).length]));
 $('#ct').innerHTML=DB.courses.map(c=>{const r=DB.results.filter(x=>x.course===c.code);return `<tr><td>${esc(c.name)}</td><td>${DB.students.filter(s=>s.course===c.code).length}</td><td>${r.length?Math.round(r.reduce((t,x)=>t+x.mark,0)/r.length)+'%':'-'}</td></tr>`}).join('')||none(3);
 $('#at').innerHTML=DB.students.map(s=>{const p=a.per[s.id];const pc=p?Math.round(p[0]/p[1]*100):null;return `<tr><td>${esc(s.name)}</td><td>${p?p[0]+' / '+p[1]:'-'}</td><td>${pc===null?'-':pc+'%'}</td></tr>`}).join('')||none(3);
 $('#expS').onclick=()=>csv('students.csv',[['ID','Name','Email','Course','Year','Status'],...DB.students.map(s=>[s.id,s.name,s.email,cName(s.course),s.year,s.status])]);
 $('#expR').onclick=()=>csv('results.csv',[['Student','Course','Mark','Grade'],...DB.results.map(r=>[sName(r.sid),cName(r.course),r.mark,grade(r.mark)])]);
 $('#print').onclick=()=>print();
}

document.addEventListener('DOMContentLoaded',()=>{
 const p=document.body.dataset.page;layout(p);
 ({index:pageIndex,students:pageStudents,courses:pageCourses,attendance:pageAttendance,results:pageResults,reports:pageReports})[p]();
});
