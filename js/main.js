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
    const form = document.getElementById('idea-form');

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
        const submitBtn = form.querySelector('.form-submit-btn');
        if (submitBtn && submitBtn.classList.contains('submitting')) {
            submitBtn.classList.remove('submitting');
            submitBtn.disabled = false;
        }
    }

    if (modal) {
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    // --- File Upload Display ---
    const fileInput = document.getElementById('attachment');
    const fileNameDisplay = document.getElementById('file-name-display');
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            fileNameDisplay.textContent = fileInput.files.length > 0 ? `Selected: ${fileInput.files[0].name}` : '';
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
        const errorSpan = field.nextElementSibling.nextElementSibling;
        let isValid = false;
        if (field.type === 'email') isValid = validateEmail(field.value);
        else isValid = field.value.trim() !== '';
        field.classList.toggle('valid', isValid);
        field.classList.toggle('invalid', !isValid);
        errorSpan.style.display = isValid ? 'none' : 'block';
        return isValid;
    };

    if (nameInput && emailInput && ideaInput) {
        nameInput.addEventListener('input', () => validateField(nameInput));
        emailInput.addEventListener('input', () => validateField(emailInput));
        ideaInput.addEventListener('input', () => validateField(ideaInput));
    }

    // --- AJAX Form Submission for Netlify ---
    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault(); // Stop the default redirect.

            const isNameValid = validateField(nameInput),
                isEmailValid = validateField(emailInput),
                isIdeaValid = validateField(ideaInput);
            if (!isNameValid || !isEmailValid || !isIdeaValid) return;

            const submitBtn = form.querySelector('.form-submit-btn');
            const data = new FormData(form);

            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;

            try {
                // This is the CORRECT fetch request for Netlify with file uploads
                const response = await fetch("/", {
                    method: "POST",
                    body: data
                });

                if (response.ok) {
                    form.reset();
                    if (fileNameDisplay) fileNameDisplay.textContent = '';
                    [nameInput, emailInput, ideaInput].forEach(input => input.classList.remove('valid', 'invalid'));
                    showModal(true, "Success!", "Your idea has been sent. We'll be in touch soon!");
                } else {
                    // This will be triggered if Netlify returns an error (e.g., form not found)
                    const errorText = await response.text();
                    showModal(false, "Submission Failed", `Something went wrong on the server. Please try again. Error: ${response.statusText}`);
                }
            } catch (error) {
                // This will be triggered by network errors (e.g., no internet)
                showModal(false, "Error", "A network error occurred. Please check your connection and try again.");
            }
        });
    }
});