// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Minimal mode: no scroll observers needed

// Add click effects to contact cards
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Inject GitHub Pages (github.io) card if GitHub username is present on page
document.addEventListener('DOMContentLoaded', function() {
    const githubCard = document.querySelector('.contact-card.github .contact-info p');
    if (!githubCard) return;

    const username = (githubCard.textContent || '').trim().replace(/^@/, '');
    if (!username) return;

    const pagesUrl = `https://${username}.github.io`;

    // Avoid duplicate injection
    const grid = document.querySelector('.contact-grid');
    const exists = grid && grid.querySelector('[data-generated="github-pages"]');
    if (grid && !exists) {
        const a = document.createElement('a');
        a.href = pagesUrl;
        a.target = '_blank';
        a.className = 'contact-card';
        a.setAttribute('data-generated', 'github-pages');
        a.innerHTML = `
            <i class="fas fa-globe"></i>
            <div class="contact-info">
                <h3>GitHub Pages</h3>
                <p>${pagesUrl}</p>
            </div>
        `;
        grid.appendChild(a);
    }
});

// Auto-link raw URLs (including github.io) inside any element with data-auto-link-scope
document.addEventListener('DOMContentLoaded', function() {
    const scope = document.querySelector('[data-auto-link-scope]');
    if (!scope) return;

    const urlRegex = /(https?:\/\/[\w.-]+\.[A-Za-z]{2,}(?:\/[\w#?=&.%_-]*)?)/g;

    function linkify(node) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
        const textNodes = [];
        let current;
        while ((current = walker.nextNode())) {
            // skip if parent already a link or icon
            if (current.parentElement && (current.parentElement.tagName === 'A' || current.parentElement.classList.contains('fa'))) continue;
            if (current.nodeValue && urlRegex.test(current.nodeValue)) {
                textNodes.push(current);
            }
        }
        textNodes.forEach(tn => {
            const html = tn.nodeValue.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
            const span = document.createElement('span');
            span.innerHTML = html;
            tn.parentNode.replaceChild(span, tn);
        });
    }

    linkify(scope);
});

// Removed skill card hover handlers (section removed)

// Add typing effect to the title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.querySelector('.title');
    const originalText = titleElement.textContent;
    
    setTimeout(() => {
        typeWriter(titleElement, originalText, 80);
    }, 1000);
});

// Parallax removed for a simpler, calmer layout

// Add phone number formatting
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,4})(\d{3})(\d{3})(\d{3})$/);
    
    if (match) {
        return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    
    return phoneNumber;
}

// Initialize phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneElement = document.querySelector('.contact-card.phone .contact-info p');
    if (phoneElement) {
        const formattedPhone = formatPhoneNumber(phoneElement.textContent);
        phoneElement.textContent = formattedPhone;
    }
});

// Add a simple visitor counter (using localStorage)
function updateVisitorCounter() {
    let visits = localStorage.getItem('visits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('visits', visits);
    
    // You can display this somewhere if needed
    console.log(`Visits: ${visits}`);
}

document.addEventListener('DOMContentLoaded', updateVisitorCounter);

// All GitHub calendar and snake game code removed, as it's being replaced.

// YouTube Music Player
let player;
const videoId = '0dHiDF_Kl7k';
let progressInterval;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player-container', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1,
            'fs': 0,
            'cc_load_policy': 0,
            'iv_load_policy': 3,
            'autohide': 0,
            'playlist': videoId,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    event.target.mute(); // Muted by default as you requested
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        document.getElementById('video-bg').style.opacity = 1; // Make video visible

        const videoData = player.getVideoData();
        document.getElementById('song-title').textContent = videoData.title;
        document.getElementById('song-youtube-link').href = player.getVideoUrl();
        
        document.getElementById('player-input-view').classList.add('hidden');
        document.getElementById('player-playing-view').classList.remove('hidden');

        const duration = player.getDuration();
        document.getElementById('progress-bar').max = duration;
        document.getElementById('total-duration').textContent = formatTime(duration);

        progressInterval = setInterval(updateProgress, 1000);
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        clearInterval(progressInterval);
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';

        // Only switch view if the video has ended
        if (event.data === YT.PlayerState.ENDED) {
            document.getElementById('player-input-view').classList.remove('hidden');
            document.getElementById('player-playing-view').classList.add('hidden');
        }
    }
}

function updateProgress() {
    const currentTime = player.getCurrentTime();
    document.getElementById('progress-bar').value = currentTime;
    document.getElementById('current-time').textContent = formatTime(currentTime);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

document.getElementById('progress-bar').addEventListener('input', (e) => {
    player.seekTo(e.target.value, true);
});

document.getElementById('mute-unmute-btn').addEventListener('click', () => {
    if (player.isMuted()) {
        player.unMute();
        document.getElementById('mute-unmute-btn').innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        player.mute();
        document.getElementById('mute-unmute-btn').innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// Modal and Player Logic
const musicPlayerButton = document.getElementById('music-player-button');
const musicPlayerModal = document.getElementById('music-player-modal');
const closeModalButton = document.querySelector('.close-btn');
const playYoutubeButton = document.getElementById('play-youtube-button');
const youtubeUrlInput = document.getElementById('youtube-url-input');

function showModal() {
    musicPlayerModal.classList.remove('hidden');
}

function hideModal() {
    musicPlayerModal.classList.add('hidden');
}

musicPlayerButton.addEventListener('click', showModal);
closeModalButton.addEventListener('click', hideModal);

function extractVideoId(url) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
    } else if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('watch?v=')[1];
    }
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }
    return videoId;
}

playYoutubeButton.addEventListener('click', () => {
    const url = youtubeUrlInput.value;
    let newVideoId = extractVideoId(url);
    if (newVideoId) {
        player.loadVideoById(newVideoId);
        hideModal();
    } else {
        // Default video if input is empty or invalid
        player.loadVideoById(videoId);
        hideModal();
    }
});

// Player controls
const playPauseBtn = document.getElementById('play-pause-btn');
const changeVideoBtn = document.getElementById('change-video-btn');
const cancelChangeBtn = document.getElementById('cancel-change-btn');
const volumeSlider = document.getElementById('volume-slider');

playPauseBtn.addEventListener('click', () => {
    const playerState = player.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        player.playVideo();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
});

changeVideoBtn.addEventListener('click', () => {
    document.getElementById('player-input-view').classList.remove('hidden');
    document.getElementById('player-playing-view').classList.add('hidden');
});

cancelChangeBtn.addEventListener('click', () => {
    // Only switch back if a video is actually loaded/playing/paused
    if (player.getPlayerState() !== YT.PlayerState.UNSTARTED && player.getPlayerState() !== YT.PlayerState.ENDED) {
        document.getElementById('player-input-view').classList.add('hidden');
        document.getElementById('player-playing-view').classList.remove('hidden');
    }
});

volumeSlider.addEventListener('input', () => {
    player.setVolume(volumeSlider.value);
    if (player.isMuted() && volumeSlider.value > 0) {
        player.unMute();
        document.getElementById('mute-unmute-btn').innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (!player.isMuted() && volumeSlider.value == 0) {
        player.mute();
        document.getElementById('mute-unmute-btn').innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .contact-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
