
// პრინტერები

console.log("სკრიპტი იწყებს მუშაობას.");

// `defer` ატრიბუტის გამო, DOMContentLoaded აღარ არის კრიტიკულად აუცილებელი, 
// მაგრამ მისი დატოვება კოდს არ აფუჭებს.
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM სრულად ჩაიტვირთა. ვამაგრებთ ივენთებს.");

    const printerLinks = document.querySelectorAll('.printer-box a');
    const printerSections = document.querySelectorAll('.printer-list > div[class$="-box"]');

    // თუ ლინკები ან სექციები ვერ მოიძებნა, ვაჩვენოთ შეცდომა კონსოლში
    if (printerLinks.length === 0) {
        console.error("პრინტერის ლინკები (.printer-box a) ვერ მოიძებნა!");
        return; // შევწყვიტოთ მუშაობა
    }
    if (printerSections.length === 0) {
        console.error("პრინტერის სექციები (div[class$='-box']) ვერ მოიძებნა!");
        return; // შევწყვიტოთ მუშაობა
    }

    function showPrinterSection(targetClass) {
        let found = false;
        printerSections.forEach(function (box) {
            if (box.classList.contains(targetClass)) {
                box.classList.add('active');
                found = true;
            } else {
                box.classList.remove('active');
            }
        });
        if (!found) {
            console.warn(`სექცია კლასით '${targetClass}' ვერ მოიძებნა.`);
        }
    }

    // თავდაპირველად გამოვაჩინოთ HP (ან პირველი ხელმისაწვდომი)
    const firstTarget = printerLinks[0].getAttribute('data-target');
    if (firstTarget) {
        console.log(`თავდაპირველად ვააქტიურებთ: ${firstTarget}`);
        showPrinterSection(firstTarget);
    }
    
    printerLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetClass = this.getAttribute('data-target');
            if (targetClass) {
                console.log(`დაკლიკება: ${targetClass}`);
                showPrinterSection(targetClass);
            }
        });
    });
});