// EmailJS initialization
(function(){
  emailjs.init("YOUR_USER_ID"); // შეცვალე შენი EmailJS user ID-ით
})();

document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();

  emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
    .then(() => {
      alert("წარმატებით გაიგზავნა!");
      this.reset();
    }, (error) => {
      alert("შეცდომა გაგზავნისას", error);
    });
});

// printers function
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.printer-box a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetClass = this.getAttribute('data-target');

      document.querySelectorAll('.printer-list > div').forEach(function (box) {
        box.classList.remove('active');
      });

      const targetBox = document.querySelector(`.${targetClass}`);
      if (targetBox) {
        targetBox.classList.add('active');
      }
    });
  });
});