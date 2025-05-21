document.addEventListener('DOMContentLoaded', () => {
  // Pega o ID da URL (ex: ?id=2)
  const urlParams = new URLSearchParams(window.location.search);
  let id = parseInt(urlParams.get("id"), 10);
  if (isNaN(id)) id = 1; // Se não houver ID, assume o valor 1

  // Busca os dados da página com base no ID
  const page = extraPagesData.find(p => p.id === id);
  if (!page) {
    showNotFound(); // Se não encontrar a página, exibe "não encontrada"
    return;
  }

  // Referências aos elementos da página HTML
  const extraHeading = document.getElementById('extra-heading');
  const extraDescription = document.getElementById('extra-description');
  const backgroundCover = document.getElementById('background-cover');
  const imageColumnLeft = document.getElementById('image-column-left');
  const imageColumnRight = document.getElementById('image-column-right');
  const extraPagesTheme = document.getElementById('extra-pages-theme');
  const playButton = document.getElementById('play-button');
  const backButton = document.getElementById('back-button');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  // Som de clique para feedback sonoro
  const uiSoundClicks = document.getElementById('ui-sound-clicks');
  uiSoundClicks.volume = 0.4;

  function playUiSoundClicks() {
    uiSoundClicks.currentTime = 0;
    uiSoundClicks.play().catch(err => console.warn('Erro ao tocar som de clique:', err));
  }

  // Atualiza o título e a descrição da página
  if (extraHeading) extraHeading.textContent = page.titulo || "Sem título";
  if (extraDescription) extraDescription.textContent = page.texto || "Sem conteúdo disponível.";

  // Define o plano de fundo da página, se houver
  if (backgroundCover && page.background) {
    backgroundCover.style.backgroundImage = `url('${page.background}')`;
    backgroundCover.style.backgroundSize = 'cover';
    backgroundCover.style.backgroundPosition = 'center';
    backgroundCover.style.backgroundRepeat = 'no-repeat';
  }

  // DISTRIBUI AS IMAGENS NAS DUAS COLUNAS (esquerda e direita)
  if (Array.isArray(page.imagens) && imageColumnLeft && imageColumnRight) {
    imageColumnLeft.innerHTML = '';
    imageColumnRight.innerHTML = '';

    page.imagens.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = page.titulo;
      img.style.cursor = 'zoom-in';

      // Alterna entre as colunas (par na esquerda, ímpar na direita)
      if (index % 2 === 0) {
        imageColumnLeft.appendChild(img);
      } else {
        imageColumnRight.appendChild(img);
      }
    });

    // Só chama o zoom após adicionar as imagens
    setupImageZoom();
  }

  // Define a trilha sonora se existir
  if (extraPagesTheme && page.trilha) {
    extraPagesTheme.src = page.trilha;
    extraPagesTheme.load();
  }

  // Botão para tocar a trilha sonora
  if (playButton && extraPagesTheme) {
    playButton.addEventListener('click', () => {
      playUiSoundClicks();
      setTimeout(() => {
        extraPagesTheme.volume = 0.2;
        extraPagesTheme.currentTime = 0;
        extraPagesTheme.play().catch(err => console.warn('Erro ao tocar o áudio:', err));
      }, 500);
    });
  }

  // Botão para voltar para a index
  if (backButton) {
    backButton.addEventListener('click', () => {
      playUiSoundClicks();
      setTimeout(() => {
        window.location.href = 'index.html?skipOverlay=true';
      }, 500);
    });
  }

  // Navegação entre páginas extras (anterior e próxima)
  setupNavigation(id);

  function setupNavigation(currentId) {
    const maxId = extraPagesData.length;

    if (prevButton) {
      if (currentId > 1) {
        prevButton.addEventListener('click', () => {
          playUiSoundClicks();
          setTimeout(() => {
            window.location.href = `extra-pages.html?id=${currentId - 1}`;
          }, 500);
        });
      } else {
        // Desabilita o botão anterior se estiver na primeira página
        prevButton.disabled = true;
        prevButton.style.opacity = 0.5;
        prevButton.style.cursor = "not-allowed";
      }
    }

    if (nextButton) {
      if (currentId < maxId) {
        nextButton.addEventListener('click', () => {
          playUiSoundClicks();
          setTimeout(() => {
            window.location.href = `extra-pages.html?id=${currentId + 1}`;
          }, 500);
        });
      } else {
        // Desabilita o botão próximo se estiver na última página
        nextButton.disabled = true;
        nextButton.style.opacity = 0.5;
        nextButton.style.cursor = "not-allowed";
      }
    }
  }

  // FUNÇÃO QUE ATIVA O ZOOM NAS IMAGENS AO CLICAR
  function setupImageZoom() {
    const zoomOverlay = document.createElement('div');
    zoomOverlay.style.position = 'fixed';
    zoomOverlay.style.top = 0;
    zoomOverlay.style.left = 0;
    zoomOverlay.style.width = '100vw';
    zoomOverlay.style.height = '100vh';
    zoomOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    zoomOverlay.style.display = 'flex';
    zoomOverlay.style.alignItems = 'center';
    zoomOverlay.style.justifyContent = 'center';
    zoomOverlay.style.zIndex = 9999;
    zoomOverlay.style.cursor = 'zoom-out';
    zoomOverlay.style.transition = 'opacity 0.3s ease';
    zoomOverlay.style.opacity = 0;
    zoomOverlay.style.pointerEvents = 'none';

    const zoomedImg = document.createElement('img');
    zoomedImg.style.maxWidth = '90%';
    zoomedImg.style.maxHeight = '90%';
    zoomedImg.style.border = '4px solid white';
    zoomedImg.style.borderRadius = '8px';
    zoomedImg.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.5)';
    zoomOverlay.appendChild(zoomedImg);

    document.body.appendChild(zoomOverlay);

    // Associa o evento de clique a cada imagem da galeria
    const galleryImages = document.querySelectorAll('#image-column-left img, #image-column-right img');
    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        zoomedImg.src = img.src;
        zoomOverlay.style.opacity = 1;
        zoomOverlay.style.pointerEvents = 'auto';
      });
    });

    // Função para esconder o zoom ao clicar fora ou apertar ESC
    function hideZoomOverlay() {
      zoomOverlay.style.opacity = 0;
      zoomOverlay.style.pointerEvents = 'none';
    }

    zoomOverlay.addEventListener('click', hideZoomOverlay);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideZoomOverlay();
    });
  }

  // Página de erro caso o ID não seja encontrado
  function showNotFound() {
    document.body.innerHTML = `
      <main class="colossus-page">
        <h1>Página extra não encontrada</h1>
        <button class="back-button" onclick="window.location.href='index.html'">Voltar</button>
      </main>
    `;
  }
});