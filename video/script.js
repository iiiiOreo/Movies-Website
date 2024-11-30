document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const playPauseButton = document.getElementById('play-pause');
    const fullScreenButton = document.getElementById('full-screen');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const volumeSlider = document.getElementById('volume-slider');
    const subtitleUpload = document.getElementById('subtitle-upload');
    const playbackSpeed = document.getElementById('playback-speed');
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    const qualitySelect = document.getElementById('quality-select');
    const pipButton = document.getElementById('pip-mode');
    const videoWrapper = document.querySelector('.video-wrapper');

    // Format time in MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Play/Pause the video and update the icon
    playPauseButton.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Update the progress bar as the video plays
    video.addEventListener('timeupdate', function () {
        const percentage = (video.currentTime / video.duration) * 100;
        progress.style.width = `${percentage}%`;
        currentTimeDisplay.textContent = formatTime(video.currentTime);
    });

    // Set total duration once the video metadata is loaded
    video.addEventListener('loadedmetadata', function () {
        totalTimeDisplay.textContent = formatTime(video.duration);
    });

    // Click to seek within the video
    progressBar.addEventListener('click', function (event) {
        const barWidth = progressBar.offsetWidth;
        const clickPosition = event.offsetX;
        const clickPercentage = clickPosition / barWidth;
        video.currentTime = clickPercentage * video.duration;
    });

    // Fullscreen mode
    fullScreenButton.addEventListener('click', function () {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Safari
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen(); // IE11
        }
    });

    // Handle volume slider
    volumeSlider.addEventListener('input', function () {
        video.volume = volumeSlider.value;
    });

    // Handle subtitle upload
    subtitleUpload.addEventListener('change', function () {
        const file = subtitleUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const track = document.createElement('track');
                track.kind = 'subtitles';
                track.label = 'User Uploaded';
                track.srclang = 'en';
                track.src = URL.createObjectURL(new Blob([event.target.result], { type: 'text/vtt' }));
                track.default = true;
                video.appendChild(track);
            };
            reader.readAsText(file);
        }
    });

    // Picture-in-Picture mode
    pipButton.addEventListener('click', async function () {
        if (video !== document.pictureInPictureElement) {
            try {
                await video.requestPictureInPicture();
            } catch (error) {
                console.error('Error entering Picture-in-Picture mode:', error);
            }
        } else {
            await document.exitPictureInPicture();
        }
    });

    // Toggle settings menu and animate settings button
    settingsButton.addEventListener('click', function () {
        settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
        settingsButton.classList.toggle('active');
    });

    // Adjust playback speed
    playbackSpeed.addEventListener('change', function () {
        video.playbackRate = playbackSpeed.value;
    });

    // Handle quality selection (for demonstration purposes, this won't affect real video resolution)
    qualitySelect.addEventListener('change', function () {
        alert(`Video quality set to: ${qualitySelect.value}`);
    });
});
