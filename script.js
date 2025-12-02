// Simple JS features for student project
document.addEventListener('DOMContentLoaded', function () {
  setGreeting();
  setupCarousel();
  setupSynopsisToggles();
  setupLightbox();
  setupContactForm();
  setupCharacterSlideshows();
  revealHome();
});

// random bg
function setRandomBackgroundVideo() {
  // List of your video files
  const videos = [
    'assets/videos/gojo-hand-sign.3840x2160.mp4',
    'assets/videos/yuji-doimain.1920x1080.mp4',
    'assets/videos/yuta-from-jujutsu-kaisen.1920x1080.mp4'
  ];

  // Pick a random video
  const randomVideo = videos[Math.floor(Math.random() * videos.length)];

  // Set it as the video source
  const videoSource = document.getElementById('bg-source');
  videoSource.src = randomVideo;

  // Reload the video element to apply the new source
  const video = document.getElementById('bg-video');
  video.load();
}

function setGreeting(){
  const el = document.getElementById('greeting');
  if(!el) return;
  const hour = new Date().getHours();
  let text = 'Hello, visitor!';
  if(hour >= 5 && hour < 12) text = 'Good morning, sorcerer!';
  else if(hour >= 12 && hour < 18) text = 'Good afternoon, sorcerer!';
  else text = 'Good evening, sorcerer!';
  el.textContent = text;
}

// Per-character mini slideshows inside the Characters page
function setupCharacterSlideshows(){
  const slideshows = document.querySelectorAll('.char-slideshow');
  slideshows.forEach((ss, idx) => {
    const slidesWrap = ss.querySelector('.char-slides');
    const slides = ss.querySelectorAll('.char-slide');
    const prev = ss.querySelector('.char-prev');
    const next = ss.querySelector('.char-next');
    if(!slidesWrap || slides.length === 0) return;
    let current = 0;
    const total = slides.length;
    const intervalMs = parseInt(ss.dataset.interval, 10) || 4000;

    function show(i){
      current = (i + total) % total;
      const slideWidth = slides[0].clientWidth || 220;
      slidesWrap.style.transform = `translateX(${-current * slideWidth}px)`;
    }

    if(prev) prev.addEventListener('click', () => { show(current - 1); });
    if(next) next.addEventListener('click', () => { show(current + 1); });

    // auto-advance with pause on hover
    let t = setInterval(() => { show(current + 1); }, intervalMs);
    ss.addEventListener('mouseenter', () => { clearInterval(t); });
    ss.addEventListener('mouseleave', () => { t = setInterval(() => { show(current + 1); }, intervalMs); });

    // responsive: recalc transform on resize
    window.addEventListener('resize', () => show(current));
    // initial show
    show(0);
  });
}

// Small homepage reveal animation: adds class to body to trigger CSS transitions
function revealHome(){
  const body = document.body;
  setTimeout(()=> body.classList.add('loaded'), 200);
}

// Carousel for characters
function setupCarousel(){
  const slides = document.getElementById('charSlides');
  if(!slides) return;
  const slideCount = slides.children.length;
  let index = 0;
  function show(i){
    const slideEl = slides.children[0];
    const w = (slideEl && slideEl.clientWidth) ? slideEl.clientWidth : slides.clientWidth;
    slides.style.transform = `translateX(${-i * w}px)`;
  }
  const prevBtn = document.getElementById('prevChar');
  const nextBtn = document.getElementById('nextChar');
  if(prevBtn) prevBtn.addEventListener('click', function(){ index = (index - 1 + slideCount) % slideCount; show(index); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ index = (index + 1) % slideCount; show(index); });
  // auto-advance every 5s
  setInterval(function(){ index = (index + 1) % slideCount; show(index); }, 5000);
}

// Toggle synopsis
function setupSynopsisToggles(){
  document.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const p = document.getElementById(id);
      if(!p) return;
      p.style.display = p.style.display === 'block' ? 'none' : 'block';
    });
  });
}

// Lightbox for gallery
function setupLightbox(){
  const thumbs = document.querySelectorAll('.thumb');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImage');
  const lbCap = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  if(!lb) return;
  thumbs.forEach(img => {
    img.addEventListener('click', () => {
      // Use the same source (placeholders may be small); for real projects replace with larger images
      lbImg.src = img.src;
      lbCap.textContent = img.alt || '';
      lb.style.display = 'flex';
      lb.setAttribute('aria-hidden','false');
    });
  });
  lbClose.addEventListener('click', () => { lb.style.display = 'none'; lb.setAttribute('aria-hidden','true'); });
  lb.addEventListener('click', (e) => { if(e.target === lb) { lb.style.display='none'; lb.setAttribute('aria-hidden','true'); } });
}

// Simple front-end validation for contact form
function setupContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!name || !email || !message){
      alert('Please fill all fields.');
      return;
    }
    if(!emailValid){
      alert('Please enter a valid email.');
      return;
    }
    // Show thank you message (simple animation)
    const ty = document.getElementById('thankYou');
    ty.style.display = 'block';
    ty.setAttribute('aria-hidden','false');
    form.reset();
    setTimeout(() => { ty.style.display = 'none'; ty.setAttribute('aria-hidden','true'); }, 3500);
  });
}

