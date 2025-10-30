import AOS from "aos";

window.addEventListener("chainlit-call-fn", (e) => {
    const { name, args, callback } = e.detail;
    callback("You sent: " + args.msg);
});

try {
    window.mountChainlitWidget({
        // URL of the Chainlit server
        chainlitServer: "https://muskan-fatima-agent.up.railway.app",
        // theme: "light" | "dark",

        // Custom styling to apply to the widget button
        button: {
            // ID of the container element to mount the button to
            containerId: "copilot-chatbot",
            // URL of the image to use as the button icon
            imageUrl: "/assets/copilot-icon.png",
            // The tailwind classname to apply to the button
            className:
                "px-0 py-0 [&_svg]:size-1 bg-transparent hover:bg-transparent",
        },
    });
} catch (error) {
    console.log("Error occured while mounting Chainlit widget", error);
}

// Initialize AOS animation library
document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    // outside click sidebar toggler
    function toggleSidebarOnCLickOutside(evt) {
        if (
            evt.target !== navLinks &&
            evt.target !== hamburger &&
            !navLinks.contains(evt.target) &&
            !hamburger.contains(evt.target)
        ) {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
            document.removeEventListener("click", toggleSidebarOnCLickOutside);
        }
    }

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");

            // add event listener for click outside when sidebar is active
            if (
                hamburger.classList.contains("active") &&
                navLinks.classList.contains("active")
            ) {
                document.addEventListener("click", toggleSidebarOnCLickOutside);
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-links li a").forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    // Typing Animation
    const typingText = document.getElementById("typing-text");
    const phrases = [
        "Hello, my name is Muskan",
        "I am a frontend developer",
        "I am a web developer",
        "I specialize in AI & Cloud",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingText) {
        setTimeout(typeEffect, 1000);
    }

    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll(".skill-progress");

    const animateSkillBars = () => {
        skillBars.forEach((bar) => {
            const rect = bar.getBoundingClientRect();
            const isVisible =
                rect.top <= window.innerHeight && rect.bottom >= 0;

            if (isVisible) {
                const width = bar.getAttribute("data-percent");
                bar.style.width = width;
            }
        });
    };

    window.addEventListener("scroll", animateSkillBars);
    animateSkillBars(); // Initial check

    // Scroll to top button
    const scrollToTopBtn = document.getElementById("scrollToTop");

    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add("visible");
            } else {
                scrollToTopBtn.classList.remove("visible");
            }
        });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }

    // Form validation
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            const formData = new FormData(contactForm);
            e.preventDefault();

            let isValid = true;

            // Name validation
            const nameInput = document.getElementById("name");
            const nameError = document.getElementById("name-error");

            if (nameInput.value.trim() === "") {
                nameError.textContent = "Name is required";
                nameError.style.display = "block";
                isValid = false;
            } else {
                nameError.style.display = "none";
            }

            // Email validation
            const emailInput = document.getElementById("email");
            const emailError = document.getElementById("email-error");
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailInput.value.trim() === "") {
                emailError.textContent = "Email is required";
                emailError.style.display = "block";
                isValid = false;
            } else if (!emailPattern.test(emailInput.value)) {
                emailError.textContent = "Please enter a valid email";
                emailError.style.display = "block";
                isValid = false;
            } else {
                emailError.style.display = "none";
            }

            // Message validation
            const messageInput = document.getElementById("message");
            const messageError = document.getElementById("message-error");

            if (messageInput.value.trim() === "") {
                messageError.textContent = "Message is required";
                messageError.style.display = "block";
                isValid = false;
            } else {
                messageError.style.display = "none";
            }

            if (isValid) {
                //form submission
                const object = Object.fromEntries(formData);
                // here you can change this key
                object.access_key = "5a8a1d95-a437-43f3-82f6-8879762e8920";
                const json = JSON.stringify(object);

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: json,
                }).then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        contactForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 20px;"></i>
                        <h3>Dear, ${json.data.name}! Your Message Sent Successfully!</h3>
                        <p>Thank you for reaching out. I'll get back to you soon.</p>
                    </div>
                `;
                    } else {
                        contactForm.innerHTML = `
                    <div class="message">
                        <i class="fa-solid fa-circle-xmark" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 20px;"></i>
                        <h3 class="text-xl">Sorry, something went wrong</h3>
                    </div>
                `;
                    }
                });
            }
        });
    }

    // Theme toggle
    const themeSwitch = document.getElementById("theme-switch");

    if (themeSwitch) {
        // Check for saved theme preference or prefer-color-scheme
        const prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        const savedTheme = localStorage.getItem("theme");

        if (
            savedTheme === "dark" ||
            (!savedTheme && prefersDarkScheme.matches)
        ) {
            document.body.classList.add("dark-theme");
            themeSwitch.checked = true;
        }

        themeSwitch.addEventListener("change", function () {
            if (this.checked) {
                document.body.classList.add("dark-theme");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark-theme");
                localStorage.setItem("theme", "light");
            }
        });
    }
});
