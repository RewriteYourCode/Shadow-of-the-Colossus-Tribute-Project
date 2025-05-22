document.addEventListener('DOMContentLoaded', () => {
  // Elementos principais
  const introScreen = document.getElementById('intro-screen'); 
  const mainContent = document.getElementById('main-content'); 
  const enterButton = document.getElementById('enter-button');      
  const soundClicks = document.getElementById('sound-clicks');        
  const soundTheme = document.getElementById('sound-theme');        
  const soundEnter = document.getElementById('sound-enter');        

  // Configuração de volume
  const clickVolume = 0.5;
  const themeVolume = 0.2;

  // Função para tocar som
  const playSound = (audio, volume = 0.5) => {
    if (audio) {
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn('Reprodução bloqueada até a interação do usuário.', err);
      });
    }
  };

  // Função que inicializa os eventos do conteúdo principal
  const initMainContent = () => {
    // Clique nas imagens dos colossos
    document.querySelectorAll('.colossus-thumbnail[data-colossus-id]').forEach(img => {        
      img.addEventListener('click', () => {
        playSound(soundClicks, clickVolume);           
        const id = img.dataset.colossusId;
        if (id) {
          setTimeout(() => {
            const target = `./colossus-pages.html?id=${id}&t=${Date.now()}`;
            window.location.href = target;
          }, 500);
        }
      });
    });

    // Clique nos botões de navegação
    document.querySelectorAll('.main-menu button').forEach(button => {      
      button.addEventListener('click', () => {
        playSound(soundClicks, clickVolume);         
        const target = button.getAttribute('data-target-url');         
        if (target) {
          setTimeout(() => {
            window.location.href = target;
          }, 500);
        }
      });
    });
  };

  // Transição da introdução para o conteúdo principal
  const fadeOutIntroScreen = () => {
    introScreen.classList.add('fade-out-transition');       
    setTimeout(() => {
      introScreen.style.display = 'none';
      mainContent.classList.add('show');
    }, 1000);
  };

  // Quando o botão "Entrar" for clicado
  const handleIntro = () => {
    playSound(soundEnter, clickVolume);       
    playSound(soundTheme, themeVolume);       
    fadeOutIntroScreen();
    initMainContent();
  };

  // Se for para pular a introdução (URL com "#skip" ou "?skipOverlay=true")
  if (window.location.hash === '#skip' || window.location.search.includes('skipOverlay=true')) {
    history.replaceState(null, null, window.location.pathname);
    fadeOutIntroScreen();
    setTimeout(() => {
      playSound(soundTheme, themeVolume);       
      initMainContent();
    }, 1000);
    return;
  }

  // Evento do botão "Entrar"
  if (enterButton) {
    enterButton.addEventListener('click', handleIntro);
  }
});
