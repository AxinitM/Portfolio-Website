const { expect } = chai;

// === Contact Form Validation Tests ===
describe('Contact Form Validation', function() {

    let nameInput, emailInput, messageInput, form;

    // Setup DOM elements before each test
    beforeEach(function() {
        document.body.innerHTML = `
            <form id="contact-form">
                <input type="text" id="name" name="name">
                <input type="email" id="email" name="email">
                <textarea id="message" name="message"></textarea>
                <button type="submit">Send</button>
            </form>
            <span id="name-error" class="error-message"></span>
            <span id="email-error" class="error-message"></span>
            <span id="message-error" class="error-message"></span>
        `;
        form = document.getElementById('contact-form');
        nameInput = document.getElementById('name');
        emailInput = document.getElementById('email');
        messageInput = document.getElementById('message');

        // Mock validation function
        window.validateForm = function() {
            let valid = true;
            if (!nameInput.value || nameInput.value.length < 2) {
                document.getElementById('name-error').style.visibility = 'visible';
                valid = false;
            }
            if (!emailInput.value || !emailInput.value.includes('@')) {
                document.getElementById('email-error').style.visibility = 'visible';
                valid = false;
            }
            if (!messageInput.value || messageInput.value.length < 10) {
                document.getElementById('message-error').style.visibility = 'visible';
                valid = false;
            }
            return valid;
        };
    });

    it('should fail when name is empty', function() {
        nameInput.value = '';
        emailInput.value = 'test@test.com';
        messageInput.value = 'Hello world!';
        const valid = validateForm();
        expect(valid).to.be.false;
        expect(document.getElementById('name-error').style.visibility).to.equal('visible');
    });

    it('should fail when email is invalid', function() {
        nameInput.value = 'Andrew';
        emailInput.value = 'invalidemail';
        messageInput.value = 'Hello world!';
        const valid = validateForm();
        expect(valid).to.be.false;
        expect(document.getElementById('email-error').style.visibility).to.equal('visible');
    });

    it('should fail when message is too short', function() {
        nameInput.value = 'Andrew';
        emailInput.value = 'test@test.com';
        messageInput.value = 'Short';
        const valid = validateForm();
        expect(valid).to.be.false;
        expect(document.getElementById('message-error').style.visibility).to.equal('visible');
    });

    it('should pass with valid inputs', function() {
        nameInput.value = 'Andrew';
        emailInput.value = 'test@test.com';
        messageInput.value = 'This is a valid message!';
        const valid = validateForm();
        expect(valid).to.be.true;
    });
});

// === Header and Footer Links Tests ===
describe('Header and Footer Links', function() {
    before(function() {
        document.body.innerHTML = `
            <header>
                <a href="https://github.com/AxinitM" class="header-link">GitHub</a>
            </header>
            <footer>
                <a href="https://github.com/AxinitM" class="footer-link">GitHub</a>
            </footer>
        `;
    });

    it('should have header link pointing to GitHub', function() {
        const headerLink = document.querySelector('.header-link');
        expect(headerLink.href).to.include('github.com');
    });

    it('should have footer link pointing to GitHub', function() {
        const footerLink = document.querySelector('.footer-link');
        expect(footerLink.href).to.include('github.com');
    });
});

// === Projects Section Tests ===
describe('Projects Section', function() {
    before(function() {
        document.body.innerHTML = `
            <section class="projects-block">
                <article><h3>Project 1</h3></article>
                <article><h3>Project 2</h3></article>
            </section>
        `;
    });

    it('should render correct number of projects', function() {
        const projects = document.querySelectorAll('.projects-block article');
        expect(projects.length).to.equal(2);
    });

    it('should have non-empty project titles', function() {
        const titles = document.querySelectorAll('.projects-block h3');
        titles.forEach(title => expect(title.textContent).to.not.be.empty);
    });
});