document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    // === Define form fields and validation rules ===
    const fields = {
        name: {
            input: document.getElementById("name"),
            error: document.getElementById("name-error"),
            maxLength: 20,
            validate(value) {
                const trimmed = value.trim();
                return trimmed.length >= 2 && trimmed.length <= this.maxLength &&
                    /^[A-Za-zÀ-žА-Яа-яЁё'\-\s]+$/.test(trimmed);
            }
        },
        email: {
            input: document.getElementById("email"),
            error: document.getElementById("email-error"),
            validate(value) {
                const trimmed = value.trim();
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
            }
        },
        message: {
            input: document.getElementById("message"),
            error: document.getElementById("message-error"),
            maxLength: 500,
            validate(value) {
                const trimmed = value.trim();
                return trimmed.length >= 10 && trimmed.length <= this.maxLength;
            }
        }
    };

    // === Show error message ===
    function showError(field) {
        field.input.setAttribute("aria-invalid", "true");
        field.error.style.visibility = "visible";
    }

    // === Hide error message ===
    function hideError(field) {
        field.input.setAttribute("aria-invalid", "false");
        field.error.style.visibility = "hidden";
    }

    // === Validate single field ===
    function validateField(field) {
        const value = field.input.value;
        if (!field.validate(value)) {
            showError(field);
            return false;
        } else {
            hideError(field);
            return true;
        }
    }

    // === Add input and blur listeners for dynamic validation ===
    Object.values(fields).forEach(field => {
        field.input.addEventListener("input", () => {
            if (field.maxLength && field.input.value.length > field.maxLength) {
                field.input.value = field.input.value.slice(0, field.maxLength);
            }
            if (field.validate(field.input.value)) hideError(field);
        });

        field.input.addEventListener("blur", () => validateField(field));
    });

    // === Handle form submission ===
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let formIsValid = true;
        Object.values(fields).forEach(field => {
            const valid = validateField(field);
            if (!valid) formIsValid = false;
        });

        if (!formIsValid) return;

        const formData = new FormData(form);
        fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // === Create overlay and message's window ===
                    const overlay = document.createElement("div");
                    overlay.id = "toast-overlay";
                    overlay.style.cssText = `
                            position: fixed;
                            top: 0; left: 0;
                            width: 100%; height: 100%;
                            background: rgba(0,0,0,0.3);
                            backdrop-filter: blur(5px);
                            z-index: 999;
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        `;
                    document.body.appendChild(overlay);

                    const toast = document.createElement("div");
                    toast.id = "toast-message";
                    toast.textContent = "Message sent successfully!";
                    toast.style.cssText = `
                            position: fixed;
                            top: 50%; left: 50%;
                            transform: translate(-50%, -50%);
                            background: var(--clr-toast-message);
                            color: var(--clr-white);
                            padding: 40px 60px;
                            border-radius: 10px;
                            font-size: 1.2rem;
                            z-index: 1000;
                            text-align: center;
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        `;
                    document.body.appendChild(toast);

                    // === Fade in ===
                    requestAnimationFrame(() => {
                        overlay.style.opacity = "1";
                        toast.style.opacity = "1";
                    });

                    // === Fade out after 3 seconds ===
                    setTimeout(() => {
                        overlay.style.opacity = "0";
                        toast.style.opacity = "0";
                        setTimeout(() => {
                            overlay.remove();
                            toast.remove();
                        }, 300);
                    }, 3000);


                    // === Clear form ===
                    form.reset();
                } else {
                    alert("Oops! There was a problem submitting your form.");
                }
            })
            .catch(() => {
                alert("Oops! There was a problem submitting your form.");
            });
    });
});