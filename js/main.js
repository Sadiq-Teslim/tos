document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    });

    // --- Modal Handling ---
    const modal = document.getElementById('result-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    const successIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#28a745" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#28a745" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    const errorIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#dc3545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 8V13" stroke="#dc3545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 16.0195V16" stroke="#dc3545" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

    function showModal(isSuccess, title, message) {
        modalIcon.innerHTML = isSuccess ? successIcon : errorIcon;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    if (modal) {
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // --- AJAX Form Submission ---
    const form = document.getElementById('idea-form');
    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            const submitBtn = form.querySelector('.form-submit-btn');
            const data = new FormData(event.target);

            // Set submitting state
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.reset();
                    showModal(true, "Success!", "Your idea has been sent. We'll be in touch soon!");
                } else {
                    showModal(false, "Submission Failed", "Something went wrong. Please check your details and try again.");
                }
            } catch (error) {
                showModal(false, "Error", "A network error occurred. Please try again later.");
            } finally {
                // Reset button state after modal is closed
                modalCloseBtn.addEventListener('click', () => {
                    submitBtn.classList.remove('submitting');
                    submitBtn.disabled = false;
                }, { once: true }); // Ensure this listener only runs once per submission
                modal.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        submitBtn.classList.remove('submitting');
                        submitBtn.disabled = false;
                    }
                }, { once: true });
            }
        });
    }
});