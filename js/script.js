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