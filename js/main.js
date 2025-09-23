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
    const form = document.getElementById('idea-form'); // Get form reference here

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
        // IMPROVEMENT: Reset button state whenever modal is closed
        const submitBtn = form.querySelector('.form-submit-btn');
        if (submitBtn && submitBtn.classList.contains('submitting')) {
            submitBtn.classList.remove('submitting');
            submitBtn.disabled = false;
        }
    }

    if (modal) {
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // --- Live Inline Validation ---
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const ideaInput = document.getElementById('idea');

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validateField = (field) => {
        const errorSpan = field.nextElementSibling.nextElementSibling; // Adjusted to find span after label
        let isValid = false;

        if (field.type === 'email') {
            isValid = validateEmail(field.value);
        } else {
            isValid = field.value.trim() !== '';
        }

        if (isValid) {
            field.classList.add('valid');
            field.classList.remove('invalid');
            errorSpan.style.display = 'none';
        } else {
            field.classList.add('invalid');
            field.classList.remove('valid');
            errorSpan.style.display = 'block';
        }
        return isValid;
    };

    if (nameInput && emailInput && ideaInput) {
        nameInput.addEventListener('input', () => validateField(nameInput));
        emailInput.addEventListener('input', () => validateField(emailInput));
        ideaInput.addEventListener('input', () => validateField(ideaInput));
    }


    // --- AJAX Form Submission ---
    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();

            // Check all fields are valid before submitting
            const isNameValid = validateField(nameInput);
            const isEmailValid = validateField(emailInput);
            const isIdeaValid = validateField(ideaInput);

            if (!isNameValid || !isEmailValid || !isIdeaValid) {
                return; // Stop submission if any field is invalid
            }

            const submitBtn = form.querySelector('.form-submit-btn');
            const data = new FormData(event.target);

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
                    // Remove validation classes on success
                    [nameInput, emailInput, ideaInput].forEach(input => {
                        input.classList.remove('valid', 'invalid');
                    });
                    showModal(true, "Success!", "Your idea has been sent. We'll be in touch soon!");
                } else {
                    showModal(false, "Submission Failed", "Something went wrong. Please check your details and try again.");
                }
            } catch (error) {
                showModal(false, "Error", "A network error occurred. Please try again later.");
            }
        });
    }
});