// Simple JS features for student project
document.addEventListener('DOMContentLoaded', function () {
  setGreeting();
  setupCarousel();
  setupSynopsisToggles();
  setupLightbox();
  setupContactForm();
  setupCharacterSlideshows();
  revealHome();
  setRandomBackgroundVideo();
});

// random bg
function setRandomBackgroundVideo() {
  const videos = [
    'assets/videos/gojo-hand-sign.3840x2160.mp4',
    'assets/videos/yuji-doimain.1920x1080.mp4',
    'assets/videos/yuta-from-jujutsu-kaisen.1920x1080.mp4',
    'assets/videos/choso-black-and-white.1920x1080.mp4',
    'assets/videos/choso-in-battle-stance.1920x1080.mp4',
    'assets/videos/divine-general-mahoraga.3840x2160.mp4',
    'assets/videos/gojo-purple-hollow-technique.1920x1080.mp4',
    'assets/videos/yuta-okkotsu-jjk.1920x1080.mp4'
  ];

  // Get the last video from localStorage
  const lastVideo = localStorage.getItem('lastVideo');

  let randomVideo;

  do {
    // Pick a random video
    randomVideo = videos[Math.floor(Math.random() * videos.length)];
  } while (videos.length > 1 && randomVideo === lastVideo); 
  // Avoid repeating if more than 1 video exists

  // Set the video source
  const videoSource = document.getElementById('bg-source');
  videoSource.src = randomVideo;

  // Reload the video element to apply the new source
  const video = document.getElementById('bg-video');
  video.load();

  // Save the current video to localStorage for next refresh
  localStorage.setItem('lastVideo', randomVideo);
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
    let autoPlayTimer = null;
    const total = slides.length;
    const intervalMs = parseInt(ss.dataset.interval, 10) || 4000;

    function show(i){
      current = (i + total) % total;
      const slideWidth = slides[0].clientWidth || 220;
      slidesWrap.style.transform = `translateX(${-current * slideWidth}px)`;
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => { show(current + 1); }, intervalMs);
    }

    if(prev) prev.addEventListener('click', () => { 
      clearInterval(autoPlayTimer);
      show(current - 1); 
      startAutoPlay();
    });
    if(next) next.addEventListener('click', () => { 
      clearInterval(autoPlayTimer);
      show(current + 1); 
      startAutoPlay();
    });

    // auto-advance with pause on hover
    startAutoPlay();
    ss.addEventListener('mouseenter', () => { clearInterval(autoPlayTimer); });
    ss.addEventListener('mouseleave', () => { startAutoPlay(); });

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
  const slidesContainer = document.getElementById('charSlides');
  if(!slidesContainer) return;
  
  const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
  const slideCount = slides.length;
  let currentIndex = 0;
  let autoPlayTimer = null;
  
  // Set first slide as active
  slides[0].classList.add('active');
  
  function showSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    slides.forEach((slide, idx) => {
      if(idx === currentIndex) {
        // Remove and re-add active class to trigger animation
        slide.classList.remove('active');
        // Force reflow to restart animation
        void slide.offsetWidth;
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5000);
  }
  
  const prevBtn = document.getElementById('prevChar');
  const nextBtn = document.getElementById('nextChar');
  
  if(prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(autoPlayTimer);
      showSlide(currentIndex - 1);
      startAutoPlay();
    });
  }
  
  if(nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(autoPlayTimer);
      showSlide(currentIndex + 1);
      startAutoPlay();
    });
  }
  
  // Start auto-play
  startAutoPlay();
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



