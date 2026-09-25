const SUPABASE_URL='https://cpmzjplfqggmgeotmtcd.supabase.co';
const SUPABASE_KEY='sb_publishable_z0kmWe85ybkmBg7bzEtyKA_kMH6WGXW';
const db=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
let rows=[], status='all', selectedPlan='7 Days', selectedPrice=500;
const $=id=>document.getElementById(id);
function key(){const p=()=>Math.random().toString(36).slice(2,6).toUpperCase();return `SXD-${p()}-${p()}-${p()}-${p()}`}
async function signIn(){ $('loginMsg').textContent=''; const {error}=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value}); if(error){$('loginMsg').textContent=error.message;return} showApp(); load(); }
async function showApp(){ $('login').classList.add('hidden'); $('app').classList.remove('hidden') }
async function load(){ const {data,error}=await db.from('licenses').select('*').order('created_at',{ascending:false}); if(error){alert(error.message);return} rows=data||[]; render(); stats(); }
function stats(){['active','unused','paused','expired'].forEach(s=>$(s).textContent=rows.filter(x=>x.status===s).length); $('c7').textContent=rows.filter(x=>x.plan==='7 Days').length+' keys';$('c30').textContent=rows.filter(x=>x.plan==='1 Month').length+' keys';$('clife').textContent=rows.filter(x=>x.plan==='Lifetime').length+' keys'}
function render(){const q=$('search').value.toLowerCase();let a=rows.filter(x=>(status==='all'||x.status===status)&&(!q||`${x.license_key} ${x.device_id||''} ${x.status}`.toLowerCase().includes(q)));$('list').innerHTML=a.map(x=>`<div class="license"><div class="key-icon">🔑</div><div class="license-main"><b>${x.license_key}</b><small>${x.plan} • Device: ${x.device_id||'Not bound'}</small></div><span class="badge ${x.status}">${x.status.toUpperCase()}</span><button class="menu" data-id="${x.id}">⋮</button></div>`).join('')||'<p style="color:#7c8794">No licenses found.</p>';document.querySelectorAll('.menu').forEach(b=>b.onclick=()=>menu(b.dataset.id))}
async function menu(id){const x=rows.find(r=>r.id===id);const action=prompt(`License ${x.license_key}\n\nType: active, paused, expired, delete`);if(!action)return;if(action==='delete'){const {error}=await db.from('licenses').delete().eq('id',id);if(error)alert(error.message)}else if(['active','paused','expired'].includes(action)){const {error}=await db.from('licenses').update({status:action}).eq('id',id);if(error)alert(error.message)}await load()}
async function generate(){const {error}=await db.from('licenses').insert({license_key:key(),plan:selectedPlan,price_lkr:selectedPrice,status:'unused'});if(error)alert(error.message);else await load()}
document.querySelectorAll('.plan').forEach(b=>b.onclick=()=>{document.querySelectorAll('.plan').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedPlan=b.dataset.plan;selectedPrice=Number(b.dataset.price)});
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');status=b.dataset.status;render()});
$('loginBtn').onclick=signIn;$('generate').onclick=generate;$('refresh').onclick=load;$('search').oninput=render;
db.auth.getSession().then(({data})=>{if(data.session){showApp();load()}});
