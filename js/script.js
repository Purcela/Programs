
// ------------------------------------------- პრინტერები -------------------------------------------

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

// ------------------------------------------- ძებნის ფუნქცია -------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('search-results');
    
    resultsContainer.classList.add('programs-box', 'printer-list');

    const pagesToSearch = [
        'index.html',
        'programs.html',
        'printers.html',
        'iso.html',
        'sps-files.html',
        'instruction.html'
    ];

    let searchIndex = [];

    async function buildSearchIndex() {
        resultsContainer.innerHTML = '<p style="text-align:center; padding: 20px;">ინფორმაციის ჩატვირთვა...</p>';

        try {
            const fetchPromises = pagesToSearch.map(async (pageUrl) => {
                const response = await fetch(pageUrl);
                if (!response.ok) {
                    console.error(`ვერ მოხერხდა ფაილის ჩატვირთვა: ${pageUrl}`);
                    return;
                }
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                doc.querySelectorAll('.file-box, .driver-box').forEach(item => {
                    const titleElement = item.querySelector('.file-box2 .title, .driver-box2 .title');
                    
                    if (titleElement && titleElement.textContent.trim()) {
                        const titleText = titleElement.textContent.trim();
                        if (titleText !== 'ფაილის დასახელება' && titleText !== 'ლოგო') {
                            
                            // **პრინტერების სტილების ფიქსი: ვიმახსოვრებთ მშობლის კლასს**
                            let wrapperClass = null;
                            if (item.classList.contains('driver-box')) {
                                const parentWrapper = item.parentElement;
                                if (parentWrapper && parentWrapper.className) {
                                     // ვპოულობთ კლასს, რომელიც მთავრდება "-box"-ით (მაგ. "hp-box")
                                     const parentClasses = Array.from(parentWrapper.classList);
                                     wrapperClass = parentClasses.find(cls => cls.endsWith('-box'));
                                }
                            }

                            searchIndex.push({
                                title: titleText,
                                html: item.outerHTML,
                                page: pageUrl,
                                wrapperClass: wrapperClass // ვამატებთ მშობლის კლასს ინდექსში
                            });
                        }
                    }
                });
            });

            await Promise.all(fetchPromises);
            
            resultsContainer.innerHTML = '';
            console.log(`ინდექსირება დასრულდა. სულ ${searchIndex.length} ელემენტი დამუშავდა.`);

        } catch (error) {
            resultsContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: red;">ინდექსირებისას მოხდა შეცდომა.</p>';
            console.error('შეცდომა ინდექსის შექმნისას:', error);
        }
    }

    function performSearch(query) {
        if (!query || query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        
        const filteredResults = searchIndex.filter(item => 
            item.title.toLowerCase().includes(lowerCaseQuery)
        );

        displayResults(filteredResults);
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; // ვასუფთავებთ ძველ შედეგებს
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center; padding: 20px;">სამწუხაროდ, შედეგი ვერ მოიძებნა.</p>';
            return;
        }

        const resultsHtml = results.map(result => {
            let itemHtml = result.html;

            // **პრინტერების სტილების ფიქსი: ვქმნით დაკარგულ მშობელ კონტეინერს**
            if (result.wrapperClass) {
                // ვქმნით .hp-box, .canon-box და ა.შ. კონტეინერს და ვამატებთ active კლასს, რომ გამოჩნდეს
                itemHtml = `<div class="${result.wrapperClass} active" style="width: 100%; border: none; margin: 0; padding: 0;">${itemHtml}</div>`;
            }

            // ეს არის გარე კონტეინერი, რომელიც შედეგს შუაში სვამს
            return `<div style="width:100%; display:flex; justify-content:center; margin-bottom: 5px;">${itemHtml}</div>`;
        }).join('');
        
        resultsContainer.innerHTML = resultsHtml;
    }

    searchInput.addEventListener('input', (event) => {
        performSearch(event.target.value);
    });

    buildSearchIndex();
});

// ------------------------------------------- სორტირება -------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const sortBtn = document.getElementById("sortBtn");
  let ascending = true;

  sortBtn.addEventListener("click", function () {
    const container = document.getElementById("results");
    const items = Array.from(container.querySelectorAll(".file-box"))
      .filter(box => !box.classList.contains("sort-bar")); // გამორიცხე sort-bar ბლოკი

    items.sort((a, b) => {
      const titleA = a.querySelector(".file-box2 .title").textContent.trim();
      const titleB = b.querySelector(".file-box2 .title").textContent.trim();

      return ascending
        ? titleA.localeCompare(titleB, "ka")
        : titleB.localeCompare(titleA, "ka");
    });

    // წაშალე ძველი ელემენტები და ჩასვი ასორტირებული
    items.forEach(item => container.appendChild(item));

    // ღილაკის ტექსტის შეცვლა
    sortBtn.textContent = ascending ? "ჰ-ა" : "ა-ჰ";
    ascending = !ascending;
  });
});
