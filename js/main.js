let mangaData = [];

fetch('data/manga.json')
  .then(res => res.json())
  .then(data => {
    mangaData = data;

    if (document.getElementById('list')) renderHome();
    if (document.getElementById('chapters')) renderManga();
    if (document.getElementById('pageImg')) renderReader();
  });

// 首页
function renderHome() {
  const list = document.getElementById('list');
  list.innerHTML = '';

  mangaData.forEach(m => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${m.title}</h3>`;
    div.onclick = () => {
      localStorage.setItem('manga', JSON.stringify(m));
      location.href = 'manga.html';
    };
    list.appendChild(div);
  });
}

// 搜索
function searchManga() {
  const k = document.getElementById('search').value.toLowerCase();
  const list = document.getElementById('list');
  list.innerHTML = '';

  mangaData
    .filter(m => m.title.toLowerCase().includes(k))
    .forEach(m => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${m.title}</h3>`;
      div.onclick = () => {
        localStorage.setItem('manga', JSON.stringify(m));
        location.href = 'manga.html';
      };
      list.appendChild(div);
    });
}

// 章节页
function renderManga() {
  const manga = JSON.parse(localStorage.getItem('manga'));
  document.getElementById('title').innerText = manga.title;

  const div = document.getElementById('chapters');
  manga.chapters.forEach(ch => {
    const btn = document.createElement('button');
    btn.innerText = ch.name;

    btn.onclick = () => {
      localStorage.setItem('chapter', JSON.stringify(ch));
      location.href = 'reader.html';
    };

    div.appendChild(btn);
  });
}

// 阅读
let currentPage = 0;
let pages = [];
let scrollMode = false;
let zoom = false;

function renderReader() {
  const ch = JSON.parse(localStorage.getItem('chapter'));
  pages = ch.pages;
  currentPage = 0;
  showPage();
}

function showPage() {
  if (scrollMode) return renderScroll();

  document.getElementById('pageImg').src = pages[currentPage];
  document.getElementById('pageInfo').innerText =
    `Page ${currentPage + 1} / ${pages.length}`;
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    currentPage++;
    animate();
    showPage();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    animate();
    showPage();
  }
}

function animate() {
  const img = document.getElementById('pageImg');
  img.style.transform = 'scale(0.95)';
  setTimeout(() => img.style.transform = 'scale(1)', 150);
}

// 滑动
let startX = 0;
document.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

document.addEventListener('touchend', e => {
  let diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 50) return;

  if (diff > 0) nextPage();
  else prevPage();
});

// 双击放大
document.addEventListener('dblclick', () => {
  const img = document.getElementById('pageImg');
  zoom = !zoom;
  img.style.transform = zoom ? 'scale(2)' : 'scale(1)';
});

// 滚动模式
function toggleMode() {
  scrollMode = !scrollMode;
  showPage();
}

function renderScroll() {
  const body = document.body;
  body.innerHTML = '';

  pages.forEach(p => {
    const img = document.createElement('img');
    img.src = p;
    img.style.width = '100%';
    body.appendChild(img);
  });
}
