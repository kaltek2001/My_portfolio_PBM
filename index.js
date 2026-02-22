// Engineering Portfolio - Medium Size with Rocket Fire
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const rocket = document.getElementById('rocket');
    const flameContainer = document.getElementById('flameContainer');
    const launchButton = document.getElementById('launch');
    const formulaLayer = document.getElementById('formulaLayer');
    const backgroundComponents = document.getElementById('backgroundComponents');
    const scene = document.getElementById('scene');

    // Engineering Formulas
    const engineeringFormulas = [
        "F = ma", "τ = rF sinθ", "P = τω",
        "η = W_out/W_in", "Q = mcΔT", "PV = nRT",
        "σ = P/A", "ε = ΔL/L", "E = σ/ε",
        "I = ∫ r² dm", "ω = dθ/dt", "α = dω/dt",
        "v = ωr", "a = αr", "KE = ½Iω²",
        "PE = mgh", "F_s = -kx", "T = 2π√(m/k)",
        "f = 1/T", "λ = v/f", "P = Fv",
        "W = ∫ F·dx", "ΔU = Q - W", "S = k lnΩ",
        "∇·E = ρ/ε₀", "∇×E = -∂B/∂t", "F = q(E + v×B)",
        "V = IR", "P = IV", "F = BIL sinθ",
        "ε = -dΦ/dt", "Φ = BA", "X_C = 1/(ωC)",
        "X_L = ωL", "Z = √(R² + (X_L - X_C)²)", "f₀ = 1/(2π√(LC))"
    ];

    // Background Components Types
    const componentTypes = [
        'bg-wrench', 'bg-gear', 'bg-nut', 'bg-bolt', 'bg-spring',
        'bg-bearing', 'bg-calipers', 'bg-micrometer', 'bg-screwdriver',
        'bg-hammer', 'bg-drill', 'bg-ruler', 'bg-washer', 'bg-pipe',
        'bg-valve', 'bg-motor', 'bg-circuit', 'bg-sensor', 'bg-battery',
        'bg-transformer'
    ];

    // Initialize
    createFloatingFormulas();
    createBackgroundComponents();
    setupInteractions();

    // Create floating formulas
    function createFloatingFormulas() {
        // Initial formulas
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                createFormula();
            }, i * 250);
        }

        // Add new formulas periodically
        setInterval(() => {
            if (formulaLayer.children.length < 18) {
                createFormula();
            }
        }, 4000);

        function createFormula() {
            const formula = document.createElement('div');
            formula.className = 'engineering-formula';
            formula.textContent = engineeringFormulas[Math.floor(Math.random() * engineeringFormulas.length)];

            // Random position
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            formula.style.left = `${startX}%`;
            formula.style.top = `${startY}%`;

            // Random properties
            const size = 14 + Math.random() * 6;
            const hue = 190 + Math.random() * 40;
            const duration = 15 + Math.random() * 20;

            formula.style.fontSize = `${size}px`;
            formula.style.color = `hsla(${hue}, 80%, 70%, 0.8)`;
            formula.style.animationDuration = `${duration}s`;
            formula.style.animationDelay = `${Math.random() * 3}s`;

            formulaLayer.appendChild(formula);

            // Remove after animation
            setTimeout(() => {
                if (formula.parentNode === formulaLayer) {
                    formulaLayer.removeChild(formula);
                }
            }, (duration + 3) * 1000);
        }
    }

    // Create background mechanical components
    function createBackgroundComponents() {
        // Create 30 floating components
        for (let i = 0; i < 30; i++) {
            createComponent();
        }

        function createComponent() {
            const component = document.createElement('div');
            const type = componentTypes[Math.floor(Math.random() * componentTypes.length)];
            component.className = `floating-component ${type}`;

            // Random position
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            component.style.left = `${left}%`;
            component.style.top = `${top}%`;

            // Random animation properties
            const duration = 20 + Math.random() * 25;
            const delay = Math.random() * 5;
            const scale = 0.7 + Math.random() * 0.6;

            component.style.animationDuration = `${duration}s`;
            component.style.animationDelay = `${delay}s`;
            component.style.transform = `scale(${scale})`;

            // Create the component SVG-style drawing
            createComponentDrawing(component, type);

            backgroundComponents.appendChild(component);
        }
    }

    // Create component drawings
    function createComponentDrawing(container, type) {
        // Create SVG-like drawing for each component type
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 100 100");

        let paths = [];

        switch(type) {
            case 'bg-wrench':
                paths = [
                    "M20,50 Q30,30 50,30 Q70,30 80,50 Q70,70 50,70 Q30,70 20,50 Z",
                    "M40,40 L40,60",
                    "M60,40 L60,60"
                ];
                break;
            case 'bg-gear':
                for (let i = 0; i < 8; i++) {
                    const angle = (i * 45) * Math.PI / 180;
                    const x1 = 50 + 35 * Math.cos(angle);
                    const y1 = 50 + 35 * Math.sin(angle);
                    const x2 = 50 + 45 * Math.cos(angle);
                    const y2 = 50 + 45 * Math.sin(angle);
                    paths.push(`M${x1},${y1} L${x2},${y2}`);
                }
                paths.push("M50,50 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0");
                paths.push("M50,50 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0");
                break;
            case 'bg-nut':
                paths = [
                    "M30,50 L40,30 L60,30 L70,50 L60,70 L40,70 Z",
                    "M50,50 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0"
                ];
                break;
            case 'bg-bolt':
                paths = [
                    "M50,20 L50,80",
                    "M40,20 L60,20 L55,30 L45,30 Z",
                    "M40,80 L60,80 L55,70 L45,70 Z"
                ];
                break;
            case 'bg-spring':
                paths = ["M30,20 Q40,30 50,20 Q60,30 70,20 Q80,30 70,40 Q60,50 70,60 Q80,70 70,80 Q60,90 50,80 Q40,70 30,80 Q20,70 30,60 Q20,50 30,40"];
                break;
            default:
                // Simple circle for other types
                paths = ["M50,50 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0"];
        }

        paths.forEach(pathData => {
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", pathData);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "rgba(64, 224, 255, 0.4)");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            svg.appendChild(path);
        });

        container.appendChild(svg);
    }

    // Setup interactions
    function setupInteractions() {
        // Launch button
        launchButton.addEventListener('click', launchSequence);

        // Mechanism click events
        document.querySelectorAll('.device-container').forEach(device => {
            device.style.pointerEvents = 'auto';
            device.addEventListener('click', function(e) {
                e.stopPropagation();
                showDeviceInfo(this);
                createClickEffect(this);
            });
        });
    }

    // Show device info
    function showDeviceInfo(device) {
        const deviceName = device.getAttribute('data-name');
        if (!deviceName) return;

        // Remove existing info
        const existingInfo = document.querySelector('.device-info');
        if (existingInfo) existingInfo.remove();

        // Create info box
        const infoBox = document.createElement('div');
        infoBox.className = 'device-info status-indicator';
        infoBox.textContent = deviceName;
        infoBox.style.animation = 'none';

        document.body.appendChild(infoBox);

        // Add particles
        createInfoParticles(device);

        // Remove after delay
        setTimeout(() => {
            if (infoBox.parentNode) {
                infoBox.style.transition = 'opacity 0.5s, transform 0.5s';
                infoBox.style.opacity = '0';
                infoBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    if (infoBox.parentNode) {
                        infoBox.parentNode.removeChild(infoBox);
                    }
                }, 500);
            }
        }, 2000);
    }

    // Create click effect
    function createClickEffect(device) {
        const rect = device.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Ripple effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.style.position = 'fixed';
                ripple.style.left = `${centerX}px`;
                ripple.style.top = `${centerY}px`;
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.border = `2px solid rgba(64, 224, 255, ${0.7 - i * 0.2})`;
                ripple.style.borderRadius = '50%';
                ripple.style.zIndex = '99';
                ripple.style.pointerEvents = 'none';

                document.body.appendChild(ripple);

                // Animate ripple
                ripple.animate([
                    { transform: 'scale(0)', opacity: 1 },
                    { transform: 'scale(2)', opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'ease-out',
                    delay: i * 100
                });

                // Remove after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 700);
            }, i * 100);
        }
    }

    // Create info particles
    function createInfoParticles(device) {
        const rect = device.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = '#40e0ff';
                particle.style.borderRadius = '50%';
                particle.style.zIndex = '98';
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.filter = 'blur(1px)';

                document.body.appendChild(particle);

                // Animate to center
                const targetX = window.innerWidth / 2;
                const targetY = window.innerHeight / 2;

                particle.animate([
                    {
                        transform: 'translate(-50%, -50%) scale(1)',
                        opacity: 1
                    },
                    {
                        transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 600,
                    easing: 'ease-out'
                });

                // Remove after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 600);
            }, i * 30);
        }
    }

    // Launch sequence starting from T-3
    function launchSequence() {
        // Disable button
        launchButton.disabled = true;
        launchButton.textContent = "INITIALIZING...";

        // Activate background components
        document.body.classList.add('launch-active');

        // Update status indicators
        updateStatusIndicators("SYSTEM: LAUNCH", "MECHANISMS: 100%", "COUNTDOWN ACTIVE", "POWER: 150%");

        // Start countdown from 3
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                launchButton.textContent = `T-${countdown}`;
                createCountdownEffect(countdown);

                // Speed up mechanisms progressively
                const speedMultiplier = 1 + (3 - countdown) * 0.5;
                speedUpMechanisms(speedMultiplier);

                // Speed up background components
                speedUpBackgroundComponents(speedMultiplier);

                countdown--;
            } else {
                clearInterval(countdownInterval);
                executeLaunch();
            }
        }, 1000);
    }

    // Update status indicators
    function updateStatusIndicators(status1, status2, status3, status4) {
        const indicators = document.querySelectorAll('.status-indicator');
        if (indicators[0]) indicators[0].textContent = status1;
        if (indicators[1]) indicators[1].textContent = status2;
        if (indicators[2]) indicators[2].textContent = status3;
        if (indicators[3]) indicators[3].textContent = status4;
    }

    // Speed up mechanisms
    function speedUpMechanisms(multiplier) {
        document.querySelectorAll('[class*="animate"], [class*="rotate"]').forEach(element => {
            const style = window.getComputedStyle(element);
            const animationDuration = style.animationDuration;

            if (animationDuration !== '0s' && !isNaN(parseFloat(animationDuration))) {
                const currentDuration = parseFloat(animationDuration);
                element.style.animationDuration = `${currentDuration / multiplier}s`;

                // Add glow at higher speeds
                if (multiplier > 1.5) {
                    element.style.filter = `drop-shadow(0 0 ${multiplier * 3}px rgba(64, 224, 255, 0.5))`;
                }
            }
        });
    }

    // Speed up background components
    function speedUpBackgroundComponents(multiplier) {
        document.querySelectorAll('.floating-component').forEach(component => {
            const style = window.getComputedStyle(component);
            const animationDuration = style.animationDuration;

            if (animationDuration !== '0s' && !isNaN(parseFloat(animationDuration))) {
                const currentDuration = parseFloat(animationDuration);
                component.style.animationDuration = `${currentDuration / multiplier}s`;

                // Add glow to background components
                if (multiplier > 1.5) {
                    component.style.opacity = '0.6';
                    component.style.filter = 'drop-shadow(0 0 8px rgba(255, 100, 0, 0.6))';
                }
            }
        });
    }

    // Create countdown effect
    function createCountdownEffect(count) {
        // Create particles around rocket
        const rocketRect = rocket.getBoundingClientRect();
        const centerX = rocketRect.left + rocketRect.width / 2;
        const centerY = rocketRect.top + rocketRect.height / 2;

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '5px';
                particle.style.height = '5px';
                particle.style.background = count <= 1 ? '#ff4444' : '#00ff88';
                particle.style.borderRadius = '50%';
                particle.style.zIndex = '99';
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.filter = 'blur(1px)';

                document.body.appendChild(particle);

                // Animate outward
                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + Math.random() * 40;

                particle.animate([
                    {
                        transform: 'translate(-50%, -50%) scale(1)',
                        opacity: 1
                    },
                    {
                        transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 700,
                    easing: 'ease-out'
                });

                // Remove after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 700);
            }, i * 50);
        }
    }

    // Execute launch
    function executeLaunch() {
        // Show flames immediately
        document.querySelectorAll('.flame').forEach(flame => {
            flame.style.opacity = '1';
        });

        // Maximum speed for mechanisms
        speedUpMechanisms(4);
        speedUpBackgroundComponents(3);

        // Add glow to all mechanisms
        document.querySelectorAll('.device-container').forEach(device => {
            device.style.filter = 'drop-shadow(0 0 20px rgba(255, 100, 100, 0.6))';
        });

        // Make background components brighter
        document.querySelectorAll('.floating-component').forEach(component => {
            component.style.opacity = '0.8';
            component.style.filter = 'drop-shadow(0 0 15px rgba(255, 50, 50, 0.7))';
        });

        // Launch rocket with flame
        rocket.style.transition = 'transform 2s cubic-bezier(0.1, 0.8, 0.2, 1)';
        rocket.style.transform = 'translateY(-100vh) scale(1.1)';

        // Add scene effects
        scene.classList.add('launch');

        // Create launch particles
        createLaunchParticles();

        // Screen shake
        createScreenShake();

        // After rocket animation completes (2 seconds), redirect to home.html
        setTimeout(() => {
            document.body.classList.add('fade-out');
            // Additional 0.5 second delay for fade effect before redirect
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        }, 2000);
    }

    // Create screen shake
    function createScreenShake() {
        let intensity = 8;
        const shakeInterval = setInterval(() => {
            document.body.style.transform = `translate(${Math.random() * intensity - intensity/2}px, ${Math.random() * intensity - intensity/2}px)`;
            intensity *= 0.85;

            if (intensity < 0.5) {
                clearInterval(shakeInterval);
                document.body.style.transform = 'translate(0, 0)';
            }
        }, 40);
    }

    // Create launch particles
    function createLaunchParticles() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const size = Math.random() * 6 + 2;
                particle.style.position = 'fixed';
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.background = `hsl(${Math.random() * 30 + 10}, 100%, 60%)`;
                particle.style.borderRadius = '50%';
                particle.style.zIndex = '99';
                particle.style.left = '50%';
                particle.style.bottom = '120px';
                particle.style.filter = 'blur(2px)';

                document.body.appendChild(particle);

                // Animate particle
                const angle = (Math.random() - 0.5) * Math.PI;
                const distance = 150 + Math.random() * 200;

                particle.animate([
                    {
                        transform: 'translate(-50%, 0) scale(1)',
                        opacity: 1
                    },
                    {
                        transform: `translate(-50%, 0) translate(${Math.cos(angle) * distance}px, -${Math.sin(angle) * distance + 400}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 1200 + Math.random() * 800,
                    easing: 'ease-out'
                });

                // Remove after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 20);
        }
    }
});