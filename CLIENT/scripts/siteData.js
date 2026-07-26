


    const api =
    "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/SiteData";

    const todaySharesApi =
    api + "/shares/today";

    const todayLoginsApi =
    api + "/logins/today";

    const todaySavedCountriesApi =
    api + "/savedCountries/today";

    const todayImportedCountriesApi =
    api + "/importedCountries/today";


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


    function openMenu() {

        sideMenu.classList.add("open");
    menuOverlay.classList.add("show");
        }


    function closeMenu() {

        sideMenu.classList.remove("open");
    menuOverlay.classList.remove("show");
        }


    menuButton.addEventListener(
    "click",
    openMenu
    );


    closeMenuButton.addEventListener(
    "click",
    closeMenu
    );


    menuOverlay.addEventListener(
    "click",
    closeMenu
    );


    function loadCurrentUser() {

            const userString =
    localStorage.getItem("currentUser");

    if (userString === null) {

        window.location.href =
        "loginPage.html";

    return false;
            }

    const currentUser =
    JSON.parse(userString);

    if (
    currentUser.role &&
    currentUser.role.toLowerCase() === "admin"
    ) {

        adminMenu.style.display = "flex";
    return true;
            }

    window.location.href =
    "index.html";

    return false;
        }


    logoutButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "currentUser"
        );

    window.location.href =
    "loginPage.html";
            }
    );


    function showTodayDate() {

            const today =
    new Date();

    document
    .getElementById("todayDate")
    .innerText =
    "הנתונים עבור " +
    today.toLocaleDateString("he-IL");
        }


    function openPopup(popupId) {

        document
            .getElementById(popupId)
            .classList.add("show");
        }


    function closePopup(popupId) {

        document
            .getElementById(popupId)
            .classList.remove("show");
        }


    document
    .querySelectorAll("[data-close]")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                closePopup(
                    button.dataset.close
                );
            }
        );
            });


    document
    .querySelectorAll(".popup-overlay")
    .forEach(function (overlay) {

        overlay.addEventListener(
            "click",
            function (event) {

                if (event.target === overlay) {

                    overlay.classList.remove(
                        "show"
                    );
                }
            }
        );
            });


    function showLoading(container) {

        container.innerHTML =
        '<div class="loading-message">' +
        'טוען נתונים...' +
        '</div>';
        }


    function showEmpty(container, message) {

        container.innerHTML =
        '<div class="empty-message">' +
        message +
        '</div>';
        }


    function showError(container) {

        container.innerHTML =
        '<div class="error-message">' +
        'לא ניתן לטעון כרגע את הנתונים' +
        '</div>';
        }


    function getCountryName(item) {

            if (item.countryName) {
                return item.countryName;
            }

    if (item.name) {
                return item.name;
            }

    if (item.country && item.country.name) {
                return item.country.name;
            }

    return "מדינה ללא שם";
        }


    function getCountryFlag(item) {

            if (item.flag) {
                return item.flag;
            }

    if (item.flagUrl) {
                return item.flagUrl;
            }

    if (item.country && item.country.flag) {
                return item.country.flag;
            }

    return "";
        }


    function createFlag(item) {

            const image =
    document.createElement("img");

    image.className =
    "card-flag";

    image.src =
    getCountryFlag(item);

    image.alt =
    "הדגל של " +
    getCountryName(item);

    return image;
        }


    /* שיתופים */

    document
    .getElementById("openSharesButton")
    .addEventListener(
    "click",
    function () {

        openPopup("sharesOverlay");
    loadTodayShares();
                }
    );


    function loadTodayShares() {

            const container =
    document.getElementById(
    "sharesCards"
    );

    showLoading(container);

    ajaxCall(
    "GET",
    todaySharesApi,
    "",
    renderTodayShares,
    function () {

        showError(container);
                }
    );
        }


    function renderTodayShares(shares) {

            const container =
    document.getElementById(
    "sharesCards"
    );

    container.innerHTML = "";

    if (
    shares === null ||
    shares.length === 0
    ) {

        showEmpty(
            container,
            "לא נוספו שיתופים היום"
        );

    return;
            }

    shares.forEach(function (share) {

                const card =
    document.createElement("div");

    card.className =
    "data-card";

    const flag =
    createFlag(share);

    const user =
    document.createElement("div");

    user.className =
    "card-main-text";

    user.innerText =
    share.userName ||
    share.userEmail ||
    share.email ||
    "משתמש לא ידוע";

    const country =
    document.createElement("div");

    country.className =
    "card-secondary-text";

    country.innerText =
    getCountryName(share);

    card.appendChild(flag);
    card.appendChild(user);
    card.appendChild(country);

    card.addEventListener(
    "click",
    function () {

        openShareDetails(share);
                    }
    );

    container.appendChild(card);
            });
        }


    function openShareDetails(share) {

        document
            .getElementById("shareDetailsFlag")
            .src =
        getCountryFlag(share);

    document
    .getElementById("shareDetailsCountry")
    .innerText =
    getCountryName(share);

    const userName =
    share.userName || "";

    const userEmail =
    share.userEmail ||
    share.email ||
    "";

    let userText =
    "שותף על ידי: ";

    if (
    userName !== "" &&
    userEmail !== ""
    ) {

        userText +=
        userName +
        " (" +
        userEmail +
        ")";
            }
    else {

        userText +=
        userName ||
        userEmail ||
        "משתמש לא ידוע";
            }

    document
    .getElementById("shareDetailsUser")
    .innerText =
    userText;

    document
    .getElementById("shareDetailsText")
    .innerText =
    share.content ||
    share.shareContent ||
    share.text ||
    "לא נמצא תוכן לשיתוף";

    openPopup(
    "shareDetailsOverlay"
    );
        }


    /* כניסות */

    document
    .getElementById("openLoginsButton")
    .addEventListener(
    "click",
    function () {

        openPopup("loginsOverlay");
    loadTodayLogins();
                }
    );


    function loadTodayLogins() {

            const container =
    document.getElementById(
    "loginsList"
    );

    container.innerHTML =
    '<div class="loading-message">' +
        'טוען כניסות...' +
        '</div>';

    ajaxCall(
    "GET",
    todayLoginsApi,
    "",
    renderTodayLogins,
    function () {

        container.innerHTML =
        '<div class="error-message">' +
        'לא ניתן לטעון את הכניסות' +
        '</div>';
                }
    );
        }


    function renderTodayLogins(logins) {

            const container =
    document.getElementById(
    "loginsList"
    );

    container.innerHTML = "";

    if (
    logins === null ||
    logins.length === 0
    ) {

        container.innerHTML =
        '<div class="empty-message">' +
        'לא היו כניסות היום' +
        '</div>';
            }
    else {

        logins.forEach(function (login) {

            const row =
                document.createElement("div");

            row.className =
                "login-row";

            const email =
                document.createElement("div");

            email.className =
                "login-email";

            email.innerText =
                login.userEmail ||
                login.email ||
                "אימייל לא ידוע";

            const time =
                document.createElement("div");

            time.className =
                "login-time";

            time.innerText =
                formatTime(
                    login.loginDate ||
                    login.loginTime ||
                    login.createdAt
                );

            row.appendChild(email);
            row.appendChild(time);

            container.appendChild(row);
        });
            }

    document
    .getElementById("totalLogins")
    .innerText =
    "סך הכול כניסות היום: " +
    logins.length;
        }


    function formatTime(dateValue) {

            if (!dateValue) {
                return "";
            }

    const date =
    new Date(dateValue);

    if (isNaN(date.getTime())) {
                return dateValue;
            }

    return date.toLocaleTimeString(
    "he-IL",
    {
        hour: "2-digit",
    minute: "2-digit"
                }
    );
        }


    /* מדינות שנשמרו */

    document
    .getElementById(
    "openSavedCountriesButton"
    )
    .addEventListener(
    "click",
    function () {

        openPopup(
            "savedCountriesOverlay"
        );

    loadTodaySavedCountries();
                }
    );


    function loadTodaySavedCountries() {

            const container =
    document.getElementById(
    "savedCountriesCards"
    );

    showLoading(container);

    ajaxCall(
    "GET",
    todaySavedCountriesApi,
    "",
    renderTodaySavedCountries,
    function () {

        showError(container);
                }
    );
        }


    function renderTodaySavedCountries(items) {

            const container =
    document.getElementById(
    "savedCountriesCards"
    );

    container.innerHTML = "";

    if (
    items === null ||
    items.length === 0
    ) {

        showEmpty(
            container,
            "לא נשמרו מדינות היום"
        );

    return;
            }

    items.forEach(function (item) {

                const card =
    document.createElement("div");

    card.className =
    "data-card no-click";

    const flag =
    createFlag(item);

    const listName =
    document.createElement("div");

    listName.className =
    "card-main-text";

    listName.innerText =
    translateListName(
    item.listName ||
    item.listType ||
    item.status
    );

    const email =
    document.createElement("div");

    email.className =
    "card-secondary-text";

    email.innerText =
    item.userEmail ||
    item.email ||
    "משתמש לא ידוע";

    const country =
    document.createElement("div");

    country.className =
    "card-secondary-text";

    country.innerText =
    getCountryName(item);

    card.appendChild(flag);
    card.appendChild(listName);
    card.appendChild(email);
    card.appendChild(country);

    container.appendChild(card);
            });
        }


    function translateListName(value) {

            if (!value) {
                return "רשימה לא ידועה";
            }

    const listValue =
    value.toLowerCase();

    if (
    listValue === "visited" ||
    listValue.includes("visited") ||
    listValue.includes("ביקר")
    ) {

                return "כבר ביקרתי";
            }

    if (
    listValue === "wanttovisit" ||
    listValue === "want_to_visit" ||
    listValue.includes("want")
    ) {

                return "בא לי לבקר";
            }

    return value;
        }


    /* מדינות שיובאו */

    document
    .getElementById(
    "openImportedCountriesButton"
    )
    .addEventListener(
    "click",
    function () {

        openPopup(
            "importedCountriesOverlay"
        );

    loadTodayImportedCountries();
                }
    );


    function loadTodayImportedCountries() {

            const container =
    document.getElementById(
    "importedCountriesCards"
    );

    showLoading(container);

    ajaxCall(
    "GET",
    todayImportedCountriesApi,
    "",
    renderTodayImportedCountries,
    function () {

        showError(container);
                }
    );
        }


    function renderTodayImportedCountries(countries) {

            const container =
    document.getElementById(
    "importedCountriesCards"
    );

    container.innerHTML = "";

    if (
    countries === null ||
    countries.length === 0
    ) {

        showEmpty(
            container,
            "לא יובאו מדינות היום"
        );

    return;
            }

    countries.forEach(function (country) {

                const card =
    document.createElement("div");

    card.className =
    "data-card";

    const flag =
    createFlag(country);

    const name =
    document.createElement("div");

    name.className =
    "card-main-text";

    name.innerText =
    getCountryName(country);

    card.appendChild(flag);
    card.appendChild(name);

    card.addEventListener(
    "click",
    function () {

        openCountryDetails(
            country
        );
                    }
    );

    container.appendChild(card);
            });
        }


    function openCountryDetails(country) {

        document
            .getElementById("countryDetailsName")
            .innerText =
        country.name ||
        country.countryName ||
        "מדינה";

    document
    .getElementById("countryDetailsFlag")
    .src =
    country.flag ||
    country.flagUrl ||
    "";

    document
    .getElementById("countryDetailsCode")
    .innerText =
    country.code ||
    "לא ידוע";

    document
    .getElementById("countryDetailsCapital")
    .innerText =
    country.capital ||
    "לא ידוע";

    document
    .getElementById("countryDetailsRegion")
    .innerText =
    country.region ||
    "לא ידוע";

    document
    .getElementById("countryDetailsArea")
    .innerText =
    formatNumber(
    country.area
    );

    document
    .getElementById("countryDetailsPopulation")
    .innerText =
    formatNumber(
    country.population
    );

    document
    .getElementById("countryDetailsLanguages")
    .innerText =
    formatList(
    country.languages
    );

    document
    .getElementById("countryDetailsCurrencies")
    .innerText =
    formatList(
    country.currencies ||
    country.currency
    );

    openPopup(
    "countryDetailsOverlay"
    );
        }


    function formatNumber(value) {

            if (
    value === null ||
    value === undefined ||
    value === ""
    ) {

                return "לא ידוע";
            }

    return Number(value)
    .toLocaleString("he-IL");
        }


    function formatList(value) {

            if (!value) {
                return "לא ידוע";
            }

    if (Array.isArray(value)) {

                if (value.length === 0) {
                    return "לא ידוע";
                }

    return value.join(", ");
            }

    return value;
        }


    if (loadCurrentUser()) {

        showTodayDate();
        }

