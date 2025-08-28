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

// Inject Facebook card 
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.contact-grid');
    const exists = grid && grid.querySelector('[data-generated="facebook"]');
    if (grid && !exists) {
        const a = document.createElement('a');
        a.href = 'https://www.facebook.com/nguyen.hieu.641586/';
        a.target = '_blank';
        a.className = 'contact-card facebook';
        a.setAttribute('data-generated', 'facebook');
        a.innerHTML = `
            <i class="fab fa-facebook"></i>
            <div class="contact-info">
                <h3>Facebook</h3>
                <p>nguyen.hieu.641586</p>
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
let musicStarted = false; // Track if music has started from scrolling

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
    event.target.setVolume(50);
    event.target.unMute();
    targetVolume = 50; // Initialize target volume
    
    // Update UI
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.value = 50;
    }
    const muteBtn = document.getElementById('mute-unmute-btn');
    if (muteBtn) {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    
    // Don't auto-play immediately, wait for user scroll
    console.log('YouTube player ready - waiting for user scroll to start music');
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        document.getElementById('video-bg').style.opacity = 1; // Make video visible
        musicStarted = true; // Mark that music has started

        // Add glowing effect to music button
        addMusicButtonGlow();

        const videoData = player.getVideoData();
        document.getElementById('song-title').textContent = videoData.title;
        document.getElementById('song-youtube-link').href = player.getVideoUrl();
        
        // Always show the playing view when video is playing
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

        // Remove glowing effect when not playing
        removeMusicButtonGlow();

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

musicPlayerButton.addEventListener('click', () => {
    if (player) {
        const currentVideoData = player.getVideoData();
        const currentVideoId = currentVideoData ? currentVideoData.video_id : null;
        const playerState = player.getPlayerState();
        
        // Only load video if:
        // - No video loaded yet (UNSTARTED)
        // - Different video is loaded
        // - Video has ended
        if (playerState === YT.PlayerState.UNSTARTED || 
            currentVideoId !== videoId || 
            playerState === YT.PlayerState.ENDED) {
            player.loadVideoById(videoId);
        }
        
        // Always show the player view (not input view)
        document.getElementById('player-input-view').classList.add('hidden');
        document.getElementById('player-playing-view').classList.remove('hidden');
    }
    showModal();
});

closeModalButton.addEventListener('click', hideModal);

// Close modal when clicking outside of it
musicPlayerModal.addEventListener('click', (event) => {
    // Only close if clicking on the modal background, not the content
    if (event.target === musicPlayerModal) {
        hideModal();
    }
});

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
    // Clear the input field for new URL
    youtubeUrlInput.value = '';
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
    const newVolume = volumeSlider.value;
    player.setVolume(newVolume);
    targetVolume = newVolume; // Update target volume (safe to update here)
    
    // Stop any ongoing fades since user is manually adjusting
    clearInterval(fadeInterval);
    isFading = false;
    
    if (player.isMuted() && newVolume > 0) {
        player.unMute();
        document.getElementById('mute-unmute-btn').innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (!player.isMuted() && newVolume == 0) {
        player.mute();
        document.getElementById('mute-unmute-btn').innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// Start music on any user interaction (scroll OR click)
function startMusicOnInteraction() {
    if (musicStarted || !player) return;
    
    try {
        player.playVideo();
        musicStarted = true;
        console.log('🎵 Music started from user interaction');
        
        // Remove all listeners since we only need it once
        removeInteractionListeners();
        
    } catch (error) {
        console.log('Music start failed, but will try again on next interaction');
    }
}

function removeInteractionListeners() {
    // Remove scroll listeners
    window.removeEventListener('scroll', startMusicOnInteraction);
    document.removeEventListener('touchmove', startMusicOnInteraction);
    document.removeEventListener('wheel', startMusicOnInteraction);
    
    // Remove click listeners
    document.removeEventListener('click', startMusicOnInteraction);
    document.removeEventListener('touchstart', startMusicOnInteraction);
}

// Smooth volume transitions when switching tabs
let targetVolume = 50; // The true target volume (never changes during fades)
let fadeInterval;
let isFading = false;

function fadeVolumeOut() {
    if (!player || !musicStarted) return;
    
    clearInterval(fadeInterval);
    isFading = true;
    
    // Only save current volume as target if we're not already fading
    if (!isFading || player.getVolume() === targetVolume) {
        const currentVol = player.getVolume();
        if (currentVol > 0) {
            targetVolume = currentVol; // Only save if not already at 0
        }
    }
    
    // Dim the glow effect when audio fades out
    dimMusicButtonGlow();
    
    let currentVol = player.getVolume();
    
    fadeInterval = setInterval(() => {
        currentVol -= 5;
        if (currentVol <= 0) {
            currentVol = 0;
            player.setVolume(0);
            clearInterval(fadeInterval);
            isFading = false;
            console.log('🔇 Music faded out - user left tab');
        } else {
            player.setVolume(currentVol);
        }
    }, 50); // Smooth 1-second fade out
}

function fadeVolumeIn() {
    if (!player || !musicStarted) return;
    
    clearInterval(fadeInterval);
    isFading = true;
    let currentVol = player.getVolume();
    
    // Restore the glow effect when audio fades in
    restoreMusicButtonGlow();
    
    fadeInterval = setInterval(() => {
        currentVol += 5;
        if (currentVol >= targetVolume) {
            currentVol = targetVolume;
            player.setVolume(targetVolume);
            clearInterval(fadeInterval);
            isFading = false;
            console.log(`🔊 Music faded in to ${targetVolume}% - user returned to tab`);
        } else {
            player.setVolume(currentVol);
        }
    }, 50); // Smooth 1-second fade in
}

// Handle page visibility changes (tab switching)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // User switched to another tab - fade out music
        fadeVolumeOut();
    } else {
        // User came back to tab - fade in music
        fadeVolumeIn();
    }
});

// Handle window focus/blur (clicking on other applications)
window.addEventListener('blur', function() {
    // User clicked outside browser - fade out music
    fadeVolumeOut();
});

window.addEventListener('focus', function() {
    // User came back to browser - fade in music
    fadeVolumeIn();
});

// Add interaction listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Scroll events
    window.addEventListener('scroll', startMusicOnInteraction, { passive: true });
    document.addEventListener('touchmove', startMusicOnInteraction, { passive: true });
    document.addEventListener('wheel', startMusicOnInteraction, { passive: true });
    
    // Click events  
    document.addEventListener('click', startMusicOnInteraction, { passive: true });
    document.addEventListener('touchstart', startMusicOnInteraction, { passive: true });
});

// Music button glow effects
function addMusicButtonGlow() {
    const musicBtn = document.getElementById('music-player-button');
    if (musicBtn) {
        musicBtn.classList.add('music-playing');
        console.log('✨ Music button glow activated');
    }
}

function removeMusicButtonGlow() {
    const musicBtn = document.getElementById('music-player-button');
    if (musicBtn) {
        musicBtn.classList.remove('music-playing', 'music-dimmed');
        console.log('⚫ Music button glow removed');
    }
}

function dimMusicButtonGlow() {
    const musicBtn = document.getElementById('music-player-button');
    if (musicBtn && musicBtn.classList.contains('music-playing')) {
        musicBtn.classList.add('music-dimmed');
        console.log('🔅 Music button glow dimmed');
    }
}

function restoreMusicButtonGlow() {
    const musicBtn = document.getElementById('music-player-button');
    if (musicBtn && musicBtn.classList.contains('music-playing')) {
        musicBtn.classList.remove('music-dimmed');
        console.log('✨ Music button glow restored');
    }
}

// Add CSS for ripple effect and music button glow
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
    
    /* Music button glow effects - Gray/Light theme */
    #music-player-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
    }
    
    #music-player-button.music-playing {
        box-shadow: 
            0 0 20px rgba(200, 200, 200, 0.8),
            0 0 40px rgba(180, 180, 180, 0.6),
            0 0 60px rgba(160, 160, 160, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
        animation: musicPulse 2s ease-in-out infinite;
        border: 2px solid rgba(220, 220, 220, 0.5);
        background: rgba(255, 255, 255, 0.15);
    }
    
    #music-player-button.music-playing.music-dimmed {
        box-shadow: 
            0 0 10px rgba(180, 180, 180, 0.4),
            0 0 20px rgba(160, 160, 160, 0.3);
        animation: musicPulseDimmed 3s ease-in-out infinite;
        background: rgba(255, 255, 255, 0.08);
    }
    
    @keyframes musicPulse {
        0%, 100% {
            box-shadow: 
                0 0 20px rgba(200, 200, 200, 0.8),
                0 0 40px rgba(180, 180, 180, 0.6),
                0 0 60px rgba(160, 160, 160, 0.4),
                inset 0 0 20px rgba(255, 255, 255, 0.2);
            transform: scale(1);
        }
        50% {
            box-shadow: 
                0 0 30px rgba(220, 220, 220, 1.0),
                0 0 50px rgba(200, 200, 200, 0.8),
                0 0 80px rgba(180, 180, 180, 0.6),
                inset 0 0 25px rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }
    }
    
    @keyframes musicPulseDimmed {
        0%, 100% {
            box-shadow: 
                0 0 8px rgba(160, 160, 160, 0.4),
                0 0 16px rgba(140, 140, 140, 0.3);
        }
        50% {
            box-shadow: 
                0 0 12px rgba(180, 180, 180, 0.5),
                0 0 24px rgba(160, 160, 160, 0.4);
        }
    }
    
    /* Add subtle glow to the icon inside - Light theme */
    #music-player-button.music-playing i {
        color: #e0e0e0;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }
`;
document.head.appendChild(style);