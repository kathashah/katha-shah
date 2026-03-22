/* ── LOVE BUZZER — JSONBin + localStorage ── */
const lbtn=document.getElementById('lbtn'),lct=document.getElementById('lct');
const JSONBIN_BIN_ID  = 'YOUR_BIN_ID';
const JSONBIN_API_KEY = 'YOUR_API_KEY';
const BIN_URL='https://api.jsonbin.io/v3/b/'+JSONBIN_BIN_ID;
const HEADERS={'Content-Type':'application/json','X-Master-Key':JSONBIN_API_KEY,'X-Bin-Versioning':'false'};
const LS_KEY='ks_love_liked';
let globalCount=111,liked=localStorage.getItem(LS_KEY)==='true';

function spawnHeart(){
  const h=document.createElement('div');h.className='hf';h.textContent='♥';
  // Use fixed bottom-right anchor directly — immune to parent transforms
  const lb=document.getElementById('lb');
  const r=lb.getBoundingClientRect();
  h.style.position='fixed';
  h.style.left=(r.left+r.width/2)+'px';
  h.style.top=(r.top-10)+'px';
  h.style.marginLeft='-8px';
  document.body.appendChild(h);setTimeout(()=>h.remove(),1100);
}
function setDisplay(n,l){lct.textContent=n+' loves';lbtn.classList.toggle('liked',l);}
async function fetchCount(){
  if(JSONBIN_BIN_ID==='YOUR_BIN_ID'){setDisplay(111,liked);return;}
  try{const d=await(await fetch(BIN_URL+'/latest',{headers:HEADERS})).json();globalCount=d.record?.count??111;setDisplay(globalCount,liked);}
  catch(e){setDisplay(globalCount,liked);}
}
async function saveCount(n){
  if(JSONBIN_BIN_ID==='YOUR_BIN_ID')return;
  try{await fetch(BIN_URL,{method:'PUT',headers:HEADERS,body:JSON.stringify({count:n})});}catch(e){}
}
/* ── CONTACT FORM — Web3Forms + localStorage guard ── */
const contactForm    = document.getElementById('contactForm');
const fsubmit        = document.getElementById('fsubmit');
const formSuccess    = document.getElementById('form-success');
const formError      = document.getElementById('form-error');
const alreadySent    = document.getElementById('form-already-sent');
const LS_FORM_KEY    = 'ks_form_sent';

function showAlreadySent(){
  if(!contactForm || !alreadySent) return;
  contactForm.style.display = 'none';
  alreadySent.classList.add('show');
}

// On page load — check if already sent
if(localStorage.getItem(LS_FORM_KEY) === 'true'){
  showAlreadySent();
}

if(contactForm){
  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();

    // hCaptcha client-side validation
    const hCaptcha = contactForm.querySelector('textarea[name=h-captcha-response]');
    if(hCaptcha && !hCaptcha.value){
      alert('Please complete the captcha before sending.');
      return;
    }

    fsubmit.textContent = 'Sending…';
    fsubmit.style.opacity = '.6';
    fsubmit.disabled = true;

    const formData = new FormData(contactForm);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(data.success){
        // Set localStorage flag
        localStorage.setItem(LS_FORM_KEY, 'true');
        // Small delay so user sees "Sent ✓" briefly before the swap
        fsubmit.textContent = 'Sent ✓';
        fsubmit.style.background = 'var(--rose)';
        setTimeout(() => showAlreadySent(), 1200);
      } else {
        throw new Error('Form failed');
      }
    } catch(err){
      formError.style.display = 'block';
      formSuccess.style.display = 'none';
      fsubmit.textContent = 'Send Message';
      fsubmit.style.opacity = '1';
      fsubmit.disabled = false;
    }
  });
}

lbtn.addEventListener('click',async()=>{
  liked=!liked;globalCount+=liked?1:-1;
  localStorage.setItem(LS_KEY,liked?'true':'false');
  lbtn.classList.toggle('liked',liked);lbtn.classList.add('pop');
  setDisplay(globalCount,liked);
  setTimeout(()=>lbtn.classList.remove('pop'),400);
  if(liked)spawnHeart();
  await saveCount(globalCount);
});
fetchCount();