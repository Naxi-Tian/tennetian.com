const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const progressBar = document.querySelector('.scroll-progress');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

const updateProgress = () => {
  const distance = document.documentElement.scrollHeight - innerHeight;
  if (progressBar) progressBar.style.width = `${distance > 0 ? scrollY / distance * 100 : 0}%`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

let selectedType = 'all';
const cards = [...document.querySelectorAll('.project-card')];
const emptyState = document.querySelector('.no-results');

function applyProjectFilters() {
  let totalVisible = 0;
  cards.forEach((card) => {
    const typeMatch = selectedType === 'all' || card.dataset.category.split(' ').includes(selectedType);
    card.hidden = !typeMatch;
    if (!card.hidden) totalVisible += 1;
  });
  if (emptyState) emptyState.hidden = totalVisible > 0;
}

document.querySelectorAll('.filter').forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
  button.addEventListener('click', () => {
    selectedType = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    applyProjectFilters();
  });
});

const dialog = document.querySelector('#project-dialog');
const dialogContent = dialog?.querySelector('.dialog-content');
const closeButton = dialog?.querySelector('.dialog-close');

const supplementalGalleries = {
  iris: [
    ['assets/projects/iris/gallery/object-detection.png', 'IRIS identifying a bottle and generating context-aware communication choices'],
    ['assets/projects/iris/gallery/wearable-design.png', 'Wearable frame and camera-arm design'],
    ['assets/projects/iris/gallery/problem-context.png', 'The communication challenge that motivated IRIS'],
    ['assets/projects/iris/gallery/iris-prototype.png', 'The assembled IRIS eye-tracking prototype'],
  ],
  scent: [
    ['assets/projects/scent/gallery/clustered-sensor-data.png', 'Clustered IAQ, VOC, and gas-resistance measurements over time'],
    ['assets/projects/scent/gallery/test-chamber.png', 'A scent sample inside the prototype test chamber'],
    ['assets/projects/scent/gallery/mq-gas-sensor.png', 'MQ-series gas sensor used in the sensing system'],
  ],
  pollenNetwork: [
    ['assets/projects/pollen-network/gallery/field-station.png', 'A pollen monitoring station deployed outdoors'],
    ['assets/projects/pollen-network/gallery/station-cap.png', 'The station’s protective collection cap'],
    ['assets/projects/pollen-network/gallery/electronics-prototype.jpg', 'Breadboard electronics and airflow prototype'],
  ],
};

function createSupplementalGallery(projectKey, forProjectPage = false) {
  const images = supplementalGalleries[projectKey];
  if (!images) return null;
  const pathPrefix = forProjectPage ? '../' : '';
  const section = document.createElement('section');
  section.className = 'detail-gallery-section';
  section.dataset.gallery = projectKey;
  const heading = document.createElement('h3');
  heading.textContent = 'Project gallery';
  const grid = document.createElement('div');
  grid.className = `detail-photo-grid detail-photo-grid-${images.length}`;
  images.forEach(([source, caption]) => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = `${pathPrefix}${source}`;
    image.alt = caption;
    image.loading = 'lazy';
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = caption;
    figure.append(image, figcaption);
    grid.append(figure);
  });
  section.append(heading, grid);
  return section;
}

function galleryKeyForTitle(title = '') {
  if (title.includes('IRIS')) return 'iris';
  if (title.includes('Scent Sensor')) return 'scent';
  if (title.includes('Pollen Detection Network')) return 'pollenNetwork';
  return null;
}

function mountProjectPageGallery() {
  const projectKey = location.pathname.endsWith('/iris.html') ? 'iris'
    : location.pathname.endsWith('/scent-classifier.html') ? 'scent'
      : location.pathname.endsWith('/pollen-network.html') ? 'pollenNetwork' : null;
  if (!projectKey || document.querySelector(`[data-gallery="${projectKey}"]`)) return;
  const existingGallery = document.querySelector('.case-row:last-of-type .project-gallery');
  const gallery = createSupplementalGallery(projectKey, true);
  if (existingGallery && gallery) existingGallery.insertAdjacentElement('afterend', gallery);
}

mountProjectPageGallery();

function hydrateYouTubeEmbeds(root = document) {
  if (location.protocol === 'file:') return;
  root.querySelectorAll('.youtube-embed[data-youtube-id]').forEach((container) => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${container.dataset.youtubeId}?rel=0&playsinline=1`;
    iframe.title = container.dataset.youtubeTitle || 'Project video';
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    container.replaceChildren(iframe);
  });
}

hydrateYouTubeEmbeds();

document.querySelectorAll('.project-open').forEach((button) => button.addEventListener('click', () => {
  const template = button.closest('.project-card')?.querySelector('template');
  if (!dialog || !dialogContent || !template) return;
  dialogContent.replaceChildren(template.content.cloneNode(true));
  const projectKey = galleryKeyForTitle(dialogContent.querySelector('h2')?.textContent || '');
  const gallery = createSupplementalGallery(projectKey);
  const galleryAnchor = dialogContent.querySelector('.modal-media-section, .modal-resources');
  if (gallery) galleryAnchor ? dialogContent.insertBefore(gallery, galleryAnchor) : dialogContent.append(gallery);
  hydrateYouTubeEmbeds(dialogContent);
  const title = dialogContent.querySelector('h2');
  if (title) title.id = 'dialog-title';
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));

function closeDialog() {
  dialogContent?.querySelectorAll('video').forEach((video) => video.pause());
  dialogContent?.querySelectorAll('iframe').forEach((frame) => {
    frame.src = frame.src;
  });
  dialog?.close();
  document.body.style.overflow = '';
}

closeButton?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});
dialog?.addEventListener('close', () => { document.body.style.overflow = ''; });

const heroVideos = [...document.querySelectorAll('[data-hero-video]')];
const footageCues = [...document.querySelectorAll('.footage-cue')];
const footageToggle = document.querySelector('.footage-toggle');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeVideoIndex = 0;
let footagePaused = reduceMotion;
let progressFrame;

function renderFootageProgress() {
  const video = heroVideos[activeVideoIndex];
  const cue = footageCues[activeVideoIndex];
  if (video && cue && Number.isFinite(video.duration) && video.duration > 0) {
    cue.style.setProperty('--video-progress', `${video.currentTime / video.duration * 100}%`);
  }
  progressFrame = requestAnimationFrame(renderFootageProgress);
}

function showHeroVideo(index, restart = false) {
  if (!heroVideos.length) return;
  activeVideoIndex = (index + heroVideos.length) % heroVideos.length;
  heroVideos.forEach((video, videoIndex) => {
    const active = videoIndex === activeVideoIndex;
    video.classList.toggle('is-active', active);
    if (!active) video.pause();
  });
  footageCues.forEach((cue, cueIndex) => {
    cue.classList.toggle('is-active', cueIndex === activeVideoIndex);
    if (cueIndex !== activeVideoIndex) cue.style.setProperty('--video-progress', '0%');
  });
  const activeVideo = heroVideos[activeVideoIndex];
  if (restart) activeVideo.currentTime = 0;
  if (!footagePaused) activeVideo.play().catch(() => {
    footagePaused = true;
    footageToggle?.setAttribute('aria-pressed', 'true');
    footageToggle?.setAttribute('aria-label', 'Play background footage');
    if (footageToggle) footageToggle.textContent = '▶';
  });
}

heroVideos.forEach((video, index) => {
  video.addEventListener('ended', () => showHeroVideo(index + 1, true));
  video.addEventListener('error', () => {
    if (index === activeVideoIndex) showHeroVideo(index + 1, true);
  });
});

footageCues.forEach((cue) => cue.addEventListener('click', () => {
  footagePaused = false;
  footageToggle?.setAttribute('aria-pressed', 'false');
  footageToggle?.setAttribute('aria-label', 'Pause background footage');
  if (footageToggle) footageToggle.textContent = 'Ⅱ';
  showHeroVideo(Number(cue.dataset.videoIndex), true);
}));

footageToggle?.addEventListener('click', () => {
  footagePaused = !footagePaused;
  footageToggle.setAttribute('aria-pressed', String(footagePaused));
  footageToggle.setAttribute('aria-label', footagePaused ? 'Play background footage' : 'Pause background footage');
  footageToggle.textContent = footagePaused ? '▶' : 'Ⅱ';
  if (footagePaused) heroVideos[activeVideoIndex]?.pause();
  else heroVideos[activeVideoIndex]?.play().catch(() => {});
});

if (heroVideos.length) {
  if (!reduceMotion) showHeroVideo(0, true);
  else heroVideos[0].pause();
  cancelAnimationFrame(progressFrame);
  renderFootageProgress();
}
