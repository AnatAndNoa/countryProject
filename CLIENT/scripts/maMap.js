
    const userCountriesApi =
    "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/UserCountries";

    const countriesApi =
    "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Countrys";

    const menuButton =
    document.getElementById("menuButton");

    const closeMenuButton =
    document.getElementById("closeMenuButton");

    const sideMenu =
    document.getElementById("sideMenu");

    const menuOverlay =
    document.getElementById("menuOverlay");

    const logoutButton =
    document.getElementById("logoutButton");

    const adminMenu =
    document.getElementById("adminMenu");

    const visitedList =
    document.getElementById("visitedList");

    const wantToVisitList =
    document.getElementById("wantToVisitList");

    const visitedCards =
    document.getElementById("visitedCards");

    const wantToVisitCards =
    document.getElementById("wantToVisitCards");

    const trashArea =
    document.getElementById("trashArea");

    const pageMessage =
    document.getElementById("pageMessage");

    const countryPopupOverlay =
    document.getElementById("countryPopupOverlay");

    let currentUser = null;
    let currentUserId = 0;

    let visitedCountries = [];
    let wantToVisitCountries = [];
    let allCountries = [];

    let draggedCountry = null;
    let draggedFrom = null;
    let wasDragged = false;

    function openMenu() {
        sideMenu.classList.add("open");
    menuOverlay.classList.add("show");
        }

    function closeMenu() {
        sideMenu.classList.remove("open");
    menuOverlay.classList.remove("show");
        }

    menuButton.addEventListener("click", openMenu);
    closeMenuButton.addEventListener("click", closeMenu);
    menuOverlay.addEventListener("click", closeMenu);

    function loadCurrentUser() {
            const userAsString =
    localStorage.getItem("currentUser");

    if (userAsString === null) {
        window.location.href = "loginPage.html";
    return false;
            }

    currentUser = JSON.parse(userAsString);
    currentUserId = currentUser.id;

    if (
    currentUser.role &&
    currentUser.role.toLowerCase() === "admin"
    ) {
        adminMenu.style.display = "flex";
            }

    return true;
        }

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
    window.location.href = "loginPage.html";
        });

    function loadAllData() {
        loadAllCountryDetails();
    loadVisitedCountries();
    loadWantToVisitCountries();
        }

    function loadAllCountryDetails() {
        ajaxCall(
            "GET",
            countriesApi,
            "",
            loadCountryDetailsSuccess,
            loadCountryDetailsError
        );
        }

    function loadCountryDetailsSuccess(countries) {
        allCountries = countries;
        }

    function loadCountryDetailsError(xhr) {
        console.log(xhr.responseText);
        }

    function loadVisitedCountries() {
        ajaxCall(
            "GET",
            userCountriesApi +
            "/visited/" +
            currentUserId,
            "",
            loadVisitedSuccess,
            loadVisitedError
        );
        }

    function loadVisitedSuccess(countries) {
        visitedCountries = countries;
    renderVisitedCountries();
        }

    function loadVisitedError(xhr) {
        visitedCards.innerHTML =
        '<div class="empty-message">' +
        'לא ניתן לטעון את הרשימה' +
        '</div>';

    console.log(xhr.responseText);
        }

    function loadWantToVisitCountries() {
        ajaxCall(
            "GET",
            userCountriesApi +
            "/wantToVisit/" +
            currentUserId,
            "",
            loadWantToVisitSuccess,
            loadWantToVisitError
        );
        }

    function loadWantToVisitSuccess(countries) {
        wantToVisitCountries = countries;
    renderWantToVisitCountries();
        }

    function loadWantToVisitError(xhr) {
        wantToVisitCards.innerHTML =
        '<div class="empty-message">' +
        'לא ניתן לטעון את הרשימה' +
        '</div>';

    console.log(xhr.responseText);
        }

    function renderVisitedCountries() {
        visitedCards.innerHTML = "";

    if (visitedCountries.length === 0) {
        visitedCards.innerHTML =
        '<div class="empty-message">' +
        'עדיין לא הוספת מדינות שבהן ביקרת' +
        '</div>';

    return;
            }

    visitedCountries.forEach(function (country) {
        visitedCards.appendChild(
            createCountryCard(country, "visited")
        );
            });
        }

    function renderWantToVisitCountries() {
        wantToVisitCards.innerHTML = "";

    if (wantToVisitCountries.length === 0) {
        wantToVisitCards.innerHTML =
        '<div class="empty-message">' +
        'עדיין לא הוספת מדינות שברצונך לבקר בהן' +
        '</div>';

    return;
            }

    wantToVisitCountries.forEach(function (country) {
        wantToVisitCards.appendChild(
            createCountryCard(country, "wantToVisit")
        );
            });
        }

    function createCountryCard(country, listName) {
            const card = document.createElement("div");

    card.className = "country-card";
    card.draggable = true;

    const flag = document.createElement("img");

    flag.src = country.flag;
    flag.alt = "הדגל של " + country.countryName;

    flag.onerror = function () {
        flag.onerror = null;
    flag.src = "../images/no-flag.png";
            };

    const name = document.createElement("h3");
    name.innerText = country.countryName;

    card.appendChild(flag);
    card.appendChild(name);

    card.addEventListener("mousedown", function () {
        wasDragged = false;
            });

    card.addEventListener("dragstart", function () {
        wasDragged = true;
    draggedCountry = country;
    draggedFrom = listName;

    card.classList.add("dragging");
    pageMessage.innerText = "";
            });

    card.addEventListener("dragend", function () {
        card.classList.remove("dragging");

    setTimeout(function () {
        wasDragged = false;
                }, 100);
            });

    card.addEventListener("click", function () {
                if (wasDragged) {
                    return;
                }

    openCountryDetails(country.countryCode);
            });

    return card;
        }

    function openCountryDetails(countryCode) {
            const fullCountry =
    allCountries.find(function (country) {
                    return country.code === countryCode;
                });

    if (!fullCountry) {
        pageMessage.innerText =
        "לא ניתן לטעון את פרטי המדינה";

    return;
            }

    document.getElementById("popupCountryName").innerText =
    fullCountry.name;

    const popupFlag =
    document.getElementById("popupCountryFlag");

    popupFlag.src = fullCountry.flag;

    popupFlag.onerror = function () {
        popupFlag.onerror = null;
    popupFlag.src = "../images/no-flag.png";
            };

    document.getElementById("popupCode").innerText =
    fullCountry.code;

    document.getElementById("popupCapital").innerText =
    fullCountry.capital || "לא ידוע";

    document.getElementById("popupRegion").innerText =
    fullCountry.region || "לא ידוע";

    document.getElementById("popupArea").innerText =
    fullCountry.area
    ? fullCountry.area.toLocaleString() + " קמ״ר"
    : "לא ידוע";

    document.getElementById("popupPopulation").innerText =
    fullCountry.population
    ? fullCountry.population.toLocaleString()
    : "לא ידוע";

    document.getElementById("popupLanguages").innerText =
    fullCountry.languages &&
                    fullCountry.languages.length > 0
    ? fullCountry.languages.join(", ")
    : "לא ידוע";

    document.getElementById("popupCurrencies").innerText =
    fullCountry.currency &&
                    fullCountry.currency.length > 0
    ? fullCountry.currency.join(", ")
    : "לא ידוע";

    countryPopupOverlay.classList.add("show");
        }

    function closeCountryPopup() {
        countryPopupOverlay.classList.remove("show");
        }

    document
    .getElementById("closeCountryPopup")
    .addEventListener("click", closeCountryPopup);

    countryPopupOverlay.addEventListener(
    "click",
    function (event) {
                if (event.target === countryPopupOverlay) {
        closeCountryPopup();
                }
            }
    );

    function allowDrop(event, element) {
        event.preventDefault();
    element.classList.add("drag-over");
        }

    function removeDropStyle(element) {
        element.classList.remove("drag-over");
        }

    visitedList.addEventListener(
    "dragover",
    function (event) {
        allowDrop(event, visitedList);
            }
    );

    visitedList.addEventListener(
    "dragleave",
    function () {
        removeDropStyle(visitedList);
            }
    );

    visitedList.addEventListener(
    "drop",
    function (event) {
        event.preventDefault();
    removeDropStyle(visitedList);

    if (
    draggedCountry === null ||
    draggedFrom !== "wantToVisit"
    ) {
                    return;
                }

    moveCountryToVisited();
            }
    );

    function moveCountryToVisited() {
            const userCountry = {
        userId: currentUserId,
    countryCode: draggedCountry.countryCode,
    countryName: "",
    flag: "",
    listType: "Visited"
            };

    pageMessage.innerText =
    "מעביר את המדינה לרשימת כבר ביקרתי...";

    ajaxCall(
    "POST",
    userCountriesApi,
    JSON.stringify(userCountry),
    moveCountrySuccess,
    moveCountryError
    );
        }

    function moveCountrySuccess() {
        pageMessage.innerText =
        "המדינה הועברה בהצלחה";

    draggedCountry = null;
    draggedFrom = null;

    loadVisitedCountries();
    loadWantToVisitCountries();
        }

    function moveCountryError(xhr) {
        pageMessage.innerText =
        "לא ניתן להעביר את המדינה";

    console.log(xhr.responseText);
        }

    trashArea.addEventListener(
    "dragover",
    function (event) {
        allowDrop(event, trashArea);
            }
    );

    trashArea.addEventListener(
    "dragleave",
    function () {
        removeDropStyle(trashArea);
            }
    );

    trashArea.addEventListener(
    "drop",
    function (event) {
        event.preventDefault();
    removeDropStyle(trashArea);

    if (draggedCountry === null) {
                    return;
                }

    deleteCountryFromList();
            }
    );

    function deleteCountryFromList() {
            const answer = confirm(
    "האם להסיר את " +
    draggedCountry.countryName +
    " מהרשימה?"
    );

    if (!answer) {
        draggedCountry = null;
    draggedFrom = null;
    return;
            }

    ajaxCall(
    "DELETE",
    userCountriesApi +
    "/" +
    currentUserId +
    "/" +
    draggedCountry.countryCode,
    "",
    deleteCountrySuccess,
    deleteCountryError
    );
        }

    function deleteCountrySuccess(result) {
            if (result !== true) {
        pageMessage.innerText =
        "המדינה לא הוסרה";

    return;
            }

    pageMessage.innerText =
    "המדינה הוסרה מהרשימה";

    draggedCountry = null;
    draggedFrom = null;

    loadVisitedCountries();
    loadWantToVisitCountries();
        }

    function deleteCountryError(xhr) {
        pageMessage.innerText =
        "לא ניתן להסיר את המדינה";

    console.log(xhr.responseText);
        }

    if (loadCurrentUser()) {
        loadAllData();
        }
