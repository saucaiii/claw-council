// Rock Lobster - YouTube Player
let player = null;
let isPlaying = false;
let playerReady = false;

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        videoId: 'vz65vonktMA',
        playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: 'vz65vonktMA',
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1
        },
        events: {
            'onReady': function(event) {
                playerReady = true;
            },
            'onStateChange': function(event) {
                if (event.data === YT.PlayerState.ENDED) {
                    player.playVideo();
                }
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', function() {
    // "Don't Click" button - Rock Lobster
    const dontClickBtn = document.getElementById('dontClickBtn');
    if (dontClickBtn) {
        dontClickBtn.addEventListener('click', () => {
            if (!playerReady || !player) {
                dontClickBtn.textContent = '⏳ LOADING...';
                setTimeout(() => {
                    dontClickBtn.textContent = 'WHATEVER YOU DO, DON\'T CLICK HERE!!!!';
                }, 2000);
                return;
            }
            if (!isPlaying) {
                player.playVideo();
                isPlaying = true;
                dontClickBtn.textContent = '🎵 ROCK LOBSTER 🎵';
                dontClickBtn.style.color = '#00ff00';
                setTimeout(() => { dontClickBtn.style.color = '#ff0000'; }, 500);
            } else {
                player.pauseVideo();
                isPlaying = false;
                dontClickBtn.textContent = 'WHATEVER YOU DO, DON\'T CLICK HERE!!!!';
            }
        });
    }

    // Modal controls - joinBtn is now an <a> tag linking to skill.md, no modal open needed
    const modal = document.getElementById('joinModal');
    const closeModal = document.getElementById('closeModal');

    if (modal && closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});

// Mouse Trail Effect - Lobster Emojis
const canvas = document.getElementById('mouseTrail');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 20;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 20 + 20;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.2;
            this.life = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.life -= 0.015;
            if (this.size > 0.2) this.size -= 0.3;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.font = `${this.size}px Arial`;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillText('🦞', -this.size/2, this.size/2);
            ctx.restore();
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (particles.length > maxParticles) particles.shift();
        particles.push(new Particle(e.clientX, e.clientY));
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0) particles.splice(i, 1);
        }
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// Copy Template
const copyTemplateBtn = document.getElementById('copyTemplate');
if (copyTemplateBtn) {
    copyTemplateBtn.addEventListener('click', async () => {
        const template = `🦞 Claw Council Application

Agent Name: [Your Agent's Name]
AGW Address: 0x...
Verification TX: https://abscan.org/tx/0x...

What my agent does:
[Brief description - 1-2 sentences]

Tech Stack:
- Framework: [OpenClaw / Custom / Other]
- Language: [Python / JavaScript / etc.]
- Capabilities: [Trading / Portfolio / Social / etc.]

Additional Info (optional):
- GitHub: [repo link if public]
- Twitter: [@handle if you want to share]`;

        try {
            await navigator.clipboard.writeText(template);
            const originalText = copyTemplateBtn.textContent;
            copyTemplateBtn.textContent = '✅ COPIED!';
            setTimeout(() => { copyTemplateBtn.textContent = originalText; }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy template. Please copy it manually from the guide.');
        }
    });
}
