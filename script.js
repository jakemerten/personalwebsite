// Theme handling (default dark)
(function() {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme'); // 'dark' | 'light' | null
  if (stored === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    root.classList.add('dark'); // default
    root.classList.remove('light');
  }

  const btn = document.getElementById('theme-toggle');
  const setIcon = () => {
    const isDark = !root.classList.contains('light');
    btn.textContent = isDark ? '🌙' : '☀️';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  setIcon();
  btn.addEventListener('click', () => {
    root.classList.toggle('light');
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    setIcon();
  });
})();

// IntersectionObserver for fade-ins
(function() {
  const IO = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        IO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 }) : null;

  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach(el => {
    if (IO) IO.observe(el);
    else el.classList.add('is-visible');
  });
})();

// Medium RSS fetch (auto-updating blog)
(function() {
  const target = document.getElementById('blog-posts');
  const FEED = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://medium.com/feed/@jakemer10');

  fetch(FEED, { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      if (!data || !Array.isArray(data.items)) throw new Error('Bad feed');
      target.innerHTML = '';
      data.items.slice(0, 6).forEach(item => {
        const a = document.createElement('article');
        a.className = 'post';
        a.innerHTML = `
          <h3><a target="_blank" rel="noopener" href="${item.link}">${item.title}</a></h3>
          <p class="muted">${new Date(item.pubDate).toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'})}</p>
        `;
        target.appendChild(a);
        // animate-in each post
        requestAnimationFrame(() => a.classList.add('is-visible'));
      });
      if (!target.children.length) target.innerHTML = '<p class="muted">No posts yet.</p>';
    })
    .catch(() => {
      target.innerHTML = '<p class="muted">Could not load Medium posts right now.</p>';
    });
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();