document.addEventListener('DOMContentLoaded', function() {

    // --- SLIDE-IN MOBILE SIDEBAR LOGIC ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.close-btn');

    if (navToggle && mobileSidebar && overlay && closeBtn) {
        
        const openMenu = () => {
            document.body.classList.add('nav-open');
            navToggle.setAttribute('aria-expanded', 'true');
            mobileSidebar.setAttribute('aria-hidden', 'false');
        };

        const closeMenu = () => {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            mobileSidebar.setAttribute('aria-hidden', 'true');
        };

        // Event Listeners
        navToggle.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // Close menu if a link inside is clicked
        mobileSidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu with the 'Escape' key for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                closeMenu();
            }
        });
    }

    // --- ALL YOUR OTHER JAVASCRIPT FOR MODALS AND FORMS ---
    const modal = document.getElementById('result-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const form = document.getElementById('idea-form');

    const successIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#28a745" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#28a745" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    const errorIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#dc3545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 8V13" stroke="#dc3545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 16.0195V16" stroke="#dc3545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

    function showModal(isSuccess, title, message) {
        if (!modal) return;
        modalIcon.innerHTML = isSuccess ? successIcon : errorIcon;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    if (modal) {
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    const fileInput = document.getElementById('attachment');
    const fileNameDisplay = document.getElementById('file-name-display');
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            fileNameDisplay.textContent = fileInput.files.length > 0 ? `Selected: ${fileInput.files[0].name}` : '';
        });
    }

    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const submitBtn = form.querySelector('.form-submit-btn');
            const data = new FormData(form);
            
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(data).toString(),
              })
                .then(() => {
                    form.reset();
                    if (fileNameDisplay) fileNameDisplay.textContent = '';
                    showModal(true, "Success!", "Your idea has been sent. We'll be in touch soon!");
                })
                .catch(() => {
                    showModal(false, "Error", "A network error occurred. Please try again later.");
                })
                .finally(() => {
                    submitBtn.classList.remove('submitting');
                    submitBtn.disabled = false;
                });
        });
    }
});