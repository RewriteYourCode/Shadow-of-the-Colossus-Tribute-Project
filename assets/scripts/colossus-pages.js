document.addEventListener('DOMContentLoaded', () => { 
  const urlParams = new URLSearchParams(window.location.search); 
  const id = parseInt(urlParams.get("id"), 10);
  
  if (!id || !colossusPagesData[id]) {  
    showNotFound(); 
    return; 
  }

  const colossus = colossusPagesData[id];  

  const pagesTitle = document.getElementById('pages-title');  
  const pagesDescription = document.getElementById('pages-description');         
  const soundTheme = document.getElementById('sound-theme');                     
  const playButton = document.getElementById('play-button');             
  const colossusPages = document.querySelector('.colossus-pages');         

  const soundClicks = document.getElementById('sound-clicks');       
  soundClicks.volume = 0.4;         
  function playSoundClicks() {       
    soundClicks.currentTime = 0;      
    soundClicks.play().catch(err => console.warn('Erro ao tocar som de clique:', err)); 
  }

  if (pagesTitle) pagesTitle.textContent = colossus.name || "Sem título"; 
  if (pagesDescription) pagesDescription.textContent = colossus.description || "Sem descrição disponível."; 

  if (colossusPages && colossus.image) { 
    colossusPages.style.backgroundImage = `url(${colossus.image})`; 
    colossusPages.style.backgroundSize = 'cover'; 
    colossusPages.style.backgroundPosition = 'center'; 
    colossusPages.style.backgroundRepeat = 'no-repeat'; 
  }

  if (soundTheme && colossus.audio) { 
    soundTheme.src = colossus.audio; 
    soundTheme.load(); 
  }

  if (playButton && soundTheme) { 
    playButton.addEventListener('click', () => { 
      playSoundClicks(); 
      setTimeout(() => {
        soundTheme.currentTime = 0; 
        soundTheme.play().catch(err => console.warn('Erro ao tocar o áudio:', err)); 
      }, 500);
    }); 
  }

  const backButton = document.getElementById('back-button'); 
  if (backButton) { 
    backButton.addEventListener('click', () => { 
      playSoundClicks(); 
      setTimeout(() => {
        window.location.href = '../../index.html?skipOverlay=true';
      }, 500);
    }); 
  }

  setupNavigation(id); 
  setupColossoGallery(colossus.galleryImages); 
  createImageOverlay();

  function setupNavigation(currentId) {  
    const prevButton = document.getElementById('prev-button');    
    const nextButton = document.getElementById('next-button');     
    const maxId = Object.keys(colossusPagesData).length;

    if (prevButton) {     
      if (currentId > 1) {
        prevButton.addEventListener('click', () => {    
          playSoundClicks();     
          setTimeout(() => {
            window.location.href = `colossus-pages.html?id=${currentId - 1}`;
          }, 500);
        });
      } else {
        prevButton.disabled = true; 
        prevButton.style.opacity = 0.5; 
        prevButton.style.cursor = "not-allowed"; 
      }
    }

    if (nextButton) {  
      if (currentId < maxId) {
        nextButton.addEventListener('click', () => { 
          playSoundClicks();  
          setTimeout(() => {
            window.location.href = `colossus-pages.html?id=${currentId + 1}`;
          }, 500);
        });
      } else {
        nextButton.disabled = true;     
        nextButton.style.opacity = 0.5;       
        nextButton.style.cursor = "not-allowed";    
      }
    }
  }

  function setupColossoGallery(images) {     
    const colossoThumbnail = document.getElementById('colosso-thumbnail');      
    const prevCarousel = document.querySelector('.prev-carousel'); 
    const nextCarousel = document.querySelector('.next-carousel');

    if (!colossoThumbnail || !Array.isArray(images)) return;  

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
      colossoThumbnail.appendChild(li);    
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
