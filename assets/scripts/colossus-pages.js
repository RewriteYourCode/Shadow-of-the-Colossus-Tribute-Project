document.addEventListener('DOMContentLoaded', () => { 
  const urlParams = new URLSearchParams(window.location.search); 
  const id = parseInt(urlParams.get("id"), 10);
  
  if (!id || !colossusPagesData[id]) { // antigo: 'colossusData'
    showNotFound(); 
    return; 
  }

  const colossus = colossusPagesData[id]; // antigo: 'colossusData'

  const pagesTitle = document.getElementById('pages-title'); // antigo 'id="colossus-title"'' e 'const titleEl'
  const pagesDescription = document.getElementById('pages-description'); // antigo 'id="colossus-description"' e 'const descEl'
  const soundTheme = document.getElementById('sound-theme'); // antigo 'id="colossus-audio"' e 'const audioEl'
  const playButton = document.getElementById('play-button'); // mantido
  const colossusPages = document.querySelector('.colossus-pages'); // antigo 'class="colossus-page"' e 'const pageEl'

  const soundClicks = document.getElementById('sound-clicks'); // antigo 'id="click-sound"' e 'const clickSound'
  soundClicks.volume = 0.4; // antigo 'clickSound'
  function playSoundClicks() { // antigo 'playClickSound'
    soundClicks.currentTime = 0; // antigo 'clickSound'
    soundClicks.play().catch(err => console.warn('Erro ao tocar som de clique:', err)); // antigo 'clickSound'
  }

  if (pagesTitle) pagesTitle.textContent = colossus.name || "Sem título"; // antigo 'titleEl'
  if (pagesDescription) pagesDescription.textContent = colossus.description || "Sem descrição disponível."; // antigo 'descEl'

  if (colossusPages && colossus.image) { // antigo pageEl
    colossusPages.style.backgroundImage = `url(${colossus.image})`; // antigo pageEl
    colossusPages.style.backgroundSize = 'cover'; // antigo pageEl
    colossusPages.style.backgroundPosition = 'center'; // antigo pageEl
    colossusPages.style.backgroundRepeat = 'no-repeat'; // antigo pageEl
  }

  if (soundTheme && colossus.audio) { // antigo audioEl
    soundTheme.src = colossus.audio; // antigo audioEl
    soundTheme.load(); // antigo audioEl
  }

  if (playButton && soundTheme) { // antigo audioEl
    playButton.addEventListener('click', () => { 
      playSoundClicks(); // antigo 'playClickSound'
      setTimeout(() => {
        soundTheme.currentTime = 0; // antigo audioEl
        soundTheme.play().catch(err => console.warn('Erro ao tocar o áudio:', err)); // antigo audioEl
      }, 500);
    }); 
  }

  const backButton = document.getElementById('back-button'); // mantido
  if (backButton) { 
    backButton.addEventListener('click', () => { 
      playSoundClicks(); // antigo playClickSound
      setTimeout(() => {
        window.location.href = '../../index.html?skipOverlay=true';
      }, 500);
    }); 
  }
// da linha '1' a '59' foi revisto e renomeado
  setupNavigation(id); // define a função 'mantido'
  setupColossoGallery(colossus.galleryImages); // antigo 'setupCarousel' e 'carouselImages'
  createImageOverlay();

  function setupNavigation(currentId) {  // mantido
    const prevButton = document.getElementById('prev-button'); // antigo 'const prevBtn'
    const nextButton = document.getElementById('next-button');  // antigo 'const nextBtn'
    const maxId = Object.keys(colossusPagesData).length;

    if (prevButton) { // antigo 'prevBtn'
      if (currentId > 1) {
        prevButton.addEventListener('click', () => { // antigo 'prevBtn'
          playSoundClicks(); // antigo 'playClickSound'
          setTimeout(() => {
            window.location.href = `colossus-pages.html?id=${currentId - 1}`;
          }, 500);
        });
      } else {
        prevButton.disabled = true; // antigo 'prevBtn'
        prevButton.style.opacity = 0.5; // antigo 'prevBtn'
        prevButton.style.cursor = "not-allowed"; // antigo 'prevBtn'
      }
    }

    if (nextButton) { // antigo 'nextBtn'
      if (currentId < maxId) {
        nextButton.addEventListener('click', () => { // antigo 'nextBtn'
          playSoundClicks(); // playClickSound
          setTimeout(() => {
            window.location.href = `colossus-pages.html?id=${currentId + 1}`;
          }, 500);
        });
      } else {
        nextButton.disabled = true; // antigo 'nextBtn'
        nextButton.style.opacity = 0.5; // antigo 'nextBtn'
        nextButton.style.cursor = "not-allowed"; // antigo 'nextBtn'
      }
    }
  }

  function setupColossoGallery(images) { // antigo 'setupCarousel'
    const colossoThumbnail = document.getElementById('colosso-thumbnail'); // antigo 'const carouselTrack' e 'carousel-track'
    const prevCarousel = document.querySelector('.prev-carousel'); 
    const nextCarousel = document.querySelector('.next-carousel');

    if (!colossoThumbnail || !Array.isArray(images)) return; // antigo 'carouselTrack'

    images.forEach((imgSrc, index) => {
      const li = document.createElement('li');
      li.classList.add('carousel-slide');

      const wrapper = document.createElement('div');
      wrapper.classList.add('image-wrapper');

      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = `Imagem ${index + 1}`;

      img.addEventListener('click', () => {
        const overlay = document.getElementById('image-overlay');
        const overlayImg = document.getElementById('overlay-image');
        if (overlay && overlayImg) {
          overlayImg.src = imgSrc;
          overlay.style.visibility = 'visible';
          overlay.style.opacity = 1;
        }
      });

      wrapper.appendChild(img);
      li.appendChild(wrapper);
      colossoThumbnail.appendChild(li); // antigo 'carouselTrack'
    });

    let scrollAmount = 320;
  }

  function showNotFound() {
    document.body.innerHTML = `
      <main class="colossus-page"> 
        <h1 id="colossus-title">Colossus não encontrado</h1>
        <button class="back-button" onclick="window.location.href='../../index.html'">Voltar</button> 
      </main>
    `;
  }

  function createImageOverlay() { 
    const overlay = document.createElement('div'); 
    overlay.id = 'image-overlay'; 
    overlay.style.position = 'fixed'; 
    overlay.style.top = 0; 
    overlay.style.left = 0; 
    overlay.style.width = '100vw'; 
    overlay.style.height = '100vh'; 
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; 
    overlay.style.display = 'flex'; 
    overlay.style.alignItems = 'center'; 
    overlay.style.justifyContent = 'center'; 
    overlay.style.zIndex = 1000; 
    overlay.style.cursor = 'zoom-out'; 
    overlay.style.opacity = 0; 
    overlay.style.transition = 'opacity 0.3s ease'; 
    overlay.style.visibility = 'hidden';

    const overlayImg = document.createElement('img');
    overlayImg.id = 'overlay-image';
    overlayImg.style.maxWidth = '90%';
    overlayImg.style.maxHeight = '90%';

    // Estilo idêntico ao carrossel
    overlayImg.style.border = '4px solid white';
    overlayImg.style.borderRadius = '8px';
    overlayImg.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.6)';

    overlay.appendChild(overlayImg);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      overlay.style.opacity = 0;
      overlay.style.visibility = 'hidden';
    });
  }
});