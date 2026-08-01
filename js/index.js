//
// Scripts
//

window.addEventListener('DOMContentLoaded', () => {

    // Auto-fill the copyright year in the footer
    const yearEl = document.getElementById('copyrightYear');
    if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

});

// ---------------------------------------------
// Bakery notice popup — shows automatically on page load
// Enable/disable it directly in index.html (no JS edits needed):
//   <div id="serviceNoticeModal" data-notice-enabled="true">   <- change to "false" to turn off
// Edit the message text in index.html inside <p id="serviceNoticeText">
// ---------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    const noticeEl = document.getElementById('serviceNoticeModal');
    if (!noticeEl) { return; }

    const isEnabled = noticeEl.dataset.noticeEnabled === 'true';
    if (!isEnabled) { return; }

    const noticeModal = new bootstrap.Modal(noticeEl);
    noticeModal.show();
});

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) { return; }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // --- Custom scroll-based active nav link tracker ---
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');

    function updateActiveLink() {
        const navHeight = document.querySelector('#mainNav').offsetHeight;
        let currentSection = '';
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= navHeight + 80) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            const parentLi = link.closest('li');
            if (parentLi) parentLi.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
                if (parentLi) parentLi.classList.add('active');
            }
        });
    }

    document.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// Send email via Web3Forms with client-side validation
//
// IMPORTANT: replace the access_key below with your own before publishing.
// Sign up for a free key at https://web3forms.com — it's what routes
// submissions from this form to your inbox. Using someone else's key
// would send your customers' messages to their account, not yours.
function sendMail() {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitButton");
    const successMsg = document.getElementById("submitSuccessMessage");
    const errorMsg = document.getElementById("submitErrorMessage");

    // --- Client-side validation ---
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const phone   = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    // Mark form as validated so Bootstrap shows invalid states
    form.classList.add("was-validated");

    // Check all fields are filled and email looks valid
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !email || !emailValid || !phone || !message) {
        return; // Stop here — Bootstrap will highlight the empty/invalid fields
    }

    // All good — disable button and send
    submitBtn.classList.add("disabled");
    submitBtn.innerText = "Sending...";
    successMsg.classList.add("d-none");
    errorMsg.classList.add("d-none");

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            access_key: "YOUR_WEB3FORMS_ACCESS_KEY", // <-- replace with your own key from web3forms.com
            name:    name,
            email:   email,
            phone:   phone,
            message: message
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Clear form and reset validation state
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("message").value = "";
            form.classList.remove("was-validated");

            successMsg.classList.remove("d-none");
            errorMsg.classList.add("d-none");
            submitBtn.innerText = "Send Inquiry";
            submitBtn.classList.remove("disabled");

            setTimeout(() => successMsg.classList.add("d-none"), 5000);
        } else {
            throw new Error(data.message);
        }
    })
    .catch(err => {
        errorMsg.classList.remove("d-none");
        successMsg.classList.add("d-none");
        submitBtn.innerText = "Send Inquiry";
        submitBtn.classList.remove("disabled");
        console.log(err);
    });
}
