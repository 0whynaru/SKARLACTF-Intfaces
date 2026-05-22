// =============================================
// TAMBAHKAN CHALLENGE DI SINI
// Format:
// { id:1, name:"Nama", cat:"WEB", pts:100, diff:"EASY", solves:0, solved:false,
//   desc:"Deskripsi.", hint:"Hint (opsional).", flag:"ByteBreaker{flag}" }
// Kategori: WEB | CRYPTO | FORENSICS | PWN | REV | MISC
// Difficulty: EASY | MEDIUM | HARD
// =============================================
const challenges = [
  {
  id: 1,
  name: "Kalem RSA doang",
  cat: "CRYPTO",
  pts: 0,
  diff: "MEDIUM",
  solves: "UNDEFINED",
  solved: false,
  desc: "Sepertinya kita bisa memfaktorkannya dlu deh <a>A</a>",
  hint: "Coba cari nilai p dan q",
  flag: "SKRCTF{sql_injection_easy}",
  file: "/codex/py.py"
  
},
  {
  id: 2,
  name: "Praroro",
  cat: "WEB",
  pts: 0,
  diff: "EASY",
  solves: "UNDEFINED",
  solved: false,
  desc: "Oke gas, oke gas.",
  hint: "Coba cari nilai p dan q",
  flag: "SKRCTF{sql_injection_easy}",
  link: "https://chall.example.com"
  
},
  {
  id: 3,
  name: "MISI PAK HABIBIE",
  cat: "CRYPTO",
  pts: 0,
  diff: "HARD",
  solves: "UNDEFINED",
  solved: false,
  desc: "bantu pak habibie memecahkan ini",
  hint: "Coba cari nilai p dan q",
  flag: "SKRCTF{sql_injection_easy}",
  file: '/assets/rsaAES.py'
  
},
  {
  id: 4,
  name: "Bantu Nara Aprilia",
  cat: "WEB",
  pts: 0,
  diff: "EASY",
  solves: "UNDEFINED",
  solved: false,
  desc: "Sepertinya Nara kesulitan cari kukis",
  hint: "Coba cari nilai p dan q",
  flag: "SKRCTF{sql_injection_easy}",
  link: '/web/nocturnal/1.html'
  
},
  {
  id: 5,
  name: "Ular kadut piton",
  cat: "REV",
  pts: 0,
  diff: "MEDIUM",
  solves: "UNDEFINED",
  solved: false,
  desc: "Ularnya bingung. coba deh kita putar ularnya",
  hint: "Coba cari nilai p dan q",
  flag: "SKRCTF{sql_injection_easy}",
  link: '/web/nocturnal/1.html'
  
},



];

// =============================================

let currentCat = 'ALL', currentDiff = 'ALL', currentSearch = '';
let activeChallenge = null, hintRevealed = false;

const catMap   = { WEB:'cat-web', CRYPTO:'cat-crypto', FORENSICS:'cat-forensics', PWN:'cat-pwn', REV:'cat-rev',};
const catNames = { WEB:'Web Exploitation', CRYPTO:'Crypto', FORENSICS:'Forensics', PWN:'Pwn', REV:'Reverse Engineering' };
const diffPips = { EASY:1, MEDIUM:3, HARD:5 };

function getDiffColor(d) {
  return d === 'EASY' ? 'fill-easy' : d === 'MEDIUM' ? 'fill-medium' : 'fill-hard';
}
function getSolveClass(diff) {
  if (diff === 'EASY') return 'ch-solve-easy';
  if (diff === 'MEDIUM') return 'ch-solve-medium';
  if (diff === 'HARD') return 'ch-solve-hard';
  return '';
}

function updateCounts() {
  const cats = ['ALL','WEB','CRYPTO','FORENSICS','PWN','REV',];
  cats.forEach(cat => {
    const el = document.getElementById('cnt-' + cat);
    if (el) el.textContent = cat === 'ALL' ? challenges.length : challenges.filter(c => c.cat === cat).length;
  });
}

function renderChallenges() {
  const grid = document.getElementById('challenges-grid');
  const filtered = challenges.filter(c => {
    const catOk    = currentCat  === 'ALL' || c.cat  === currentCat;
    const diffOk   = currentDiff === 'ALL' || c.diff === currentDiff;
    const searchOk = !currentSearch || c.name.toLowerCase().includes(currentSearch) || c.cat.toLowerCase().includes(currentSearch);
    return catOk && diffOk && searchOk;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;color:var(--text-muted);font-family:Poppins,monospace;font-size:12px;">${challenges.length === 0 ? '// belum ada challengenya wok' : 'MAAF WOK, BELUM DI TAMBAHIN YG BARU'}</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const pips = Array.from({length:5}, (_,i) => `<div class="diff-pip ${i < diffPips[c.diff] ? getDiffColor(c.diff) : ''}"></div>`).join('');
    return `<div class="challenge-card ${c.solved ? 'solved' : ''}" onclick="openModal(${c.id})">
      ${c.solved ? '<div class="solved-check">✓</div>' : ''}
      <div class="ch-top">
        <span class="ch-cat-badge ${catMap[c.cat]}">${catNames[c.cat]}</span>
      </div>
      <div class="ch-name">${c.name}</div>
      <div class="ch-desc">${c.desc}</div>
      <div class="ch-bottom">
        <div class="ch-diff">${pips}</div>
        <div class="${getSolveClass(c.diff)}">
  ${c.diff}
</div>
      </div>
    </div>`;
  }).join('');
}

function openModal(id) {
  const c = challenges.find(x => x.id === id);
  activeChallenge = c;
  hintRevealed = false;
  document.getElementById('modal-title').textContent = c.name;
  document.getElementById('modal-meta').textContent  = `${catNames[c.cat]} · ${c.diff} · ${c.solves} solves`;
  document.getElementById('modal-desc').textContent  = c.desc;
  document.getElementById('modal-pts').textContent   = c.pts;
  document.getElementById('modal-solves').textContent= c.solves;
  document.getElementById('modal-diff').textContent  = c.diff;
  document.getElementById('flag-input').value        = '';
  document.getElementById('flag-result').style.display  = 'none';
  document.getElementById('hint-content').style.display = 'none';
  document.getElementById('hint-toggle').textContent = '💡 REVEAL HINT (CUPU BANGET JIR)';
  document.getElementById('modal-overlay').classList.add('open');
  const downloadArea = document.getElementById('download-area');

  if (c.file) {

    downloadArea.innerHTML = `
      <a href="${c.file}" download class="download-btn">
        <i class="ri-download-2-line"></i> DOWNLOAD FILE
      </a>
    `;

  } else if (c.link) {

    downloadArea.innerHTML = `
      <a href="${c.link}" target="_blank" class="download-btn">
        <i class="ri-links-line"></i> OPEN WEBSITE
      </a>
    `;

  } else {

    downloadArea.innerHTML = '';

  }
}

function closeModal(e) { if (e.target === document.getElementById('modal-overlay')) closeModalDirect(); }
function closeModalDirect() { document.getElementById('modal-overlay').classList.remove('open'); activeChallenge = null; }

function toggleHint() {
  if (hintRevealed) return;
  hintRevealed = true;
  document.getElementById('hint-content').textContent    = activeChallenge.hint || '(tidak ada hint)';
  document.getElementById('hint-content').style.display  = 'block';
  document.getElementById('hint-toggle').textContent     = '💡 HINT DIPERLIHATKAN (KOCAK)';
}

function submitFlag() {
  if (!activeChallenge) return;
  const input  = document.getElementById('flag-input').value.trim();
  const result = document.getElementById('flag-result');
  if (input === activeChallenge.flag) {
    result.className   = 'flag-result correct';
    result.textContent = `YUHUUU HOREEE Benar! ANJAYYY🎉`;
    result.style.display = 'block';
    const ch = challenges.find(x => x.id === activeChallenge.id);
    if (!ch.solved) { ch.solved = true; setTimeout(() => { closeModalDirect(); renderChallenges(); }, 1200); }
  } else {
    result.className   = 'flag-result wrong';
    result.textContent = '[WARNING] Flag salah, coba lagi.';
    result.style.display = 'block';
  }
}

document.getElementById('flag-input').addEventListener('keydown', e => { if (e.key === 'Enter') submitFlag(); });

function filterCat(cat, el) {
  currentCat = cat;
  document.querySelectorAll('.cat-item').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  renderChallenges();
}

function setDiff(diff, el) {
  currentDiff = diff;
  document.querySelectorAll('.diff-btn').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  renderChallenges();
}

function filterSearch() {
  currentSearch = document.getElementById('search-input').value.toLowerCase();
  renderChallenges();
}

function showTab(tab, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

updateCounts();
renderChallenges();
  const intro = document.getElementById('intro');
  const main  = document.getElementById('main');

  function masuk() {
    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.style.display = 'none';
      main.classList.add('visible');
    }, 100);
  }

  // otomatis masuk setelah 4.5 detik, atau klik/tap intro untuk skip
  setTimeout(masuk, 400);
  intro.addEventListener('click', masuk);
