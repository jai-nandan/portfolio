/* ==========================================================================
   contact.js — client-side validation + submission for the contact form
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var statusEl = form.querySelector(".form-status");
    var submitBtn = form.querySelector("[type=submit]");

    function setFieldError(field, message) {
      var group = field.closest(".form-group");
      if (!group) return;
      group.classList.add("invalid");
      var msg = group.querySelector(".invalid-msg");
      if (msg) msg.textContent = message;
    }
    function clearFieldError(field) {
      var group = field.closest(".form-group");
      if (group) group.classList.remove("invalid");
    }

    function validate() {
      var valid = true;
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var subject = form.querySelector("#subject");
      var message = form.querySelector("#message");

      [name, email, subject, message].forEach(clearFieldError);

      if (!name.value.trim()) { setFieldError(name, "Please enter your name."); valid = false; }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) { setFieldError(email, "Enter a valid email address."); valid = false; }
      if (!subject.value.trim()) { setFieldError(subject, "Please select or enter a subject."); valid = false; }
      if (message.value.trim().length < 10) { setFieldError(message, "Message should be at least 10 characters."); valid = false; }

      return valid;
    }

    function setStatus(text, cls) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.className = "form-status " + (cls || "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        setStatus("Please fix the highlighted fields.", "error");
        return;
      }

      var payload = {
        name: form.querySelector("#name").value.trim(),
        email: form.querySelector("#email").value.trim(),
        subject: form.querySelector("#subject").value.trim(),
        message: form.querySelector("#message").value.trim()
      };

      submitBtn.disabled = true;
      setStatus("Sending...", "sending");

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          return res.json();
        })
        .then(function () {
          setStatus("Message sent — thanks for reaching out! I'll reply soon.", "success");
          form.reset();
        })
        .catch(function () {
          setStatus(
            "Couldn't reach the server right now. Please email me directly at the address below.",
            "error"
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });

    form.querySelectorAll(".form-control").forEach(function (field) {
      field.addEventListener("input", function () { clearFieldError(field); });
    });
  });
})();
