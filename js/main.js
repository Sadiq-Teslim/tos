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

    function showSuccessModal() {
        modalIcon.innerHTML = successIcon;
        modalTitle.textContent = "Success!";
        modalMessage.textContent = "Your idea has been sent. We'll be in touch soon!";
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

    // --- Netlify Form AJAX Handling ---
    const form = document.getElementById('idea-form');
    if (form) {
        form.addEventListener("submit", event => {
            // Validate fields before allowing submission
            const isNameValid = validateField(nameInput),
                isEmailValid = validateField(emailInput),
                isIdeaValid = validateField(ideaInput);
            if (!isNameValid || !isEmailValid || !isIdeaValid) {
                event.preventDefault();
                return;
            }

            // Temporarily disable button to prevent multiple submissions
            const submitBtn = form.querySelector('.form-submit-btn');
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;

            // Netlify's AJAX requires a different approach. We let the form submit,
            // but we can listen for when that's done. A simple way for a good UX
            // is to show the success message on the next page load if the URL has a success parameter.
            // For a true SPA feel, we'd use Netlify's events, but this is robust.

            // To give immediate feedback, we'll assume success if validation passes.
            // Netlify will handle the actual form submission in the background.
            // A more advanced implementation would use Netlify's success events.
        });
    }
});