
        const countriesApi =
            "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Countrys";

        const userCountriesApi =
            "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/UserCountries";

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

        const countriesGrid =
            document.getElementById("countriesGrid");

        const resultsMessage =
            document.getElementById("resultsMessage");

        const searchInput =
            document.getElementById("searchInput");

        const regionFilter =
            document.getElementById("regionFilter");

        const languageFilter =
            document.getElementById("languageFilter");

        const currencyFilter =
            document.getElementById("currencyFilter");

        const populationFilter =
            document.getElementById("populationFilter");

        const showAllButton =
            document.getElementById("showAllButton");

        const addCountryButton =
            document.getElementById("addCountryButton");

        const countryPopupOverlay =
            document.getElementById("countryPopupOverlay");

        const countryFormOverlay =
            document.getElementById("countryFormOverlay");

        const countryForm =
            document.getElementById("countryForm");

        let allCountries = [];
        let countriesLoaded = false;
        let selectedCountry = null;
        let formMode = "add";
        let currentUserId = 0;

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

        function checkAdmin() {
            const userAsString =
                localStorage.getItem("currentUser");

            if (userAsString === null) {
                window.location.href = "loginPage.html";
                return;
            }

            const currentUser =
                JSON.parse(userAsString);

            currentUserId = currentUser.id;

            if (
                currentUser.role &&
                currentUser.role.toLowerCase() === "admin"
            ) {
                adminMenu.style.display = "flex";
            }
        }

        checkAdmin();

        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "loginPage.html";
        });

        function getCountries() {
            resultsMessage.innerText = "טוען מדינות...";

            ajaxCall(
                "GET",
                countriesApi,
                "",
                getCountriesSuccess,
                getCountriesError
            );
        }

        function getCountriesSuccess(countries) {
            allCountries = countries;
            countriesLoaded = true;

            createFilterOptions();
            renderCountries(allCountries);
        }

        function getCountriesError() {
            resultsMessage.innerText =
                "לא ניתן לטעון כרגע את המדינות";
        }

        function renderCountries(countries) {
            countriesGrid.innerHTML = "";

            resultsMessage.innerText =
                "נמצאו " + countries.length + " מדינות";

            countries.forEach(function (country) {
                const card = document.createElement("div");
                card.className = "country-card";

                const flag = document.createElement("img");

                flag.src = country.flag;
                flag.alt = "הדגל של " + country.name;

                flag.onerror = function () {
                    flag.onerror = null;
                    flag.src = "../images/no-flag.png";
                };

                const name = document.createElement("h3");
                name.innerText = country.name;

                card.appendChild(flag);
                card.appendChild(name);

                card.addEventListener("click", function () {
                    openCountryPopup(country);
                });

                countriesGrid.appendChild(card);
            });
        }

        function resetSelect(selectElement, firstText) {
            selectElement.innerHTML = "";

            const firstOption =
                document.createElement("option");

            firstOption.value = "";
            firstOption.innerText = firstText;

            selectElement.appendChild(firstOption);
        }

        function addOptions(values, selectElement) {
            values.sort();

            values.forEach(function (value) {
                const option =
                    document.createElement("option");

                option.value = value;
                option.innerText = value;

                selectElement.appendChild(option);
            });
        }

        function createFilterOptions() {
            resetSelect(regionFilter, "כל האזורים");
            resetSelect(languageFilter, "כל השפות");
            resetSelect(currencyFilter, "כל המטבעות");

            const regions = [];
            const languages = [];
            const currencies = [];

            allCountries.forEach(function (country) {
                if (
                    country.region &&
                    !regions.includes(country.region)
                ) {
                    regions.push(country.region);
                }

                if (country.languages) {
                    country.languages.forEach(
                        function (language) {
                            if (
                                !languages.includes(language)
                            ) {
                                languages.push(language);
                            }
                        }
                    );
                }

                if (country.currency) {
                    country.currency.forEach(
                        function (currency) {
                            if (
                                !currencies.includes(currency)
                            ) {
                                currencies.push(currency);
                            }
                        }
                    );
                }
            });

            addOptions(regions, regionFilter);
            addOptions(languages, languageFilter);
            addOptions(currencies, currencyFilter);
        }

        function filterCountries() {
            if (!countriesLoaded) {
                return;
            }

            const searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const selectedRegion =
                regionFilter.value;

            const selectedLanguage =
                languageFilter.value;

            const selectedCurrency =
                currencyFilter.value;

            const selectedPopulation =
                populationFilter.value;

            const filteredCountries =
                allCountries.filter(function (country) {
                    const name =
                        country.name
                            ? country.name.toLowerCase()
                            : "";

                    const matchesName =
                        name.includes(searchText);

                    const matchesRegion =
                        selectedRegion === "" ||
                        country.region === selectedRegion;

                    const matchesLanguage =
                        selectedLanguage === "" ||
                        (
                            country.languages &&
                            country.languages.includes(
                                selectedLanguage
                            )
                        );

                    const matchesCurrency =
                        selectedCurrency === "" ||
                        (
                            country.currency &&
                            country.currency.includes(
                                selectedCurrency
                            )
                        );

                    let matchesPopulation = true;

                    if (selectedPopulation === "small") {
                        matchesPopulation =
                            country.population <= 5000000;
                    }

                    if (selectedPopulation === "medium") {
                        matchesPopulation =
                            country.population > 5000000 &&
                            country.population <= 50000000;
                    }

                    if (selectedPopulation === "large") {
                        matchesPopulation =
                            country.population > 50000000;
                    }

                    return (
                        matchesName &&
                        matchesRegion &&
                        matchesLanguage &&
                        matchesCurrency &&
                        matchesPopulation
                    );
                });

            renderCountries(filteredCountries);
        }

        searchInput.addEventListener(
            "input",
            filterCountries
        );

        regionFilter.addEventListener(
            "change",
            filterCountries
        );

        languageFilter.addEventListener(
            "change",
            filterCountries
        );

        currencyFilter.addEventListener(
            "change",
            filterCountries
        );

        populationFilter.addEventListener(
            "change",
            filterCountries
        );

        showAllButton.addEventListener("click", function () {
            if (!countriesLoaded) {
                getCountries();
                return;
            }

            searchInput.value = "";
            regionFilter.value = "";
            languageFilter.value = "";
            currencyFilter.value = "";
            populationFilter.value = "";

            renderCountries(allCountries);
        });

        function openCountryPopup(country) {
            selectedCountry = country;

            document
                .getElementById("listAddMessage")
                .innerText = "";

            document
                .getElementById("popupCountryName")
                .innerText = country.name;

            const popupFlag =
                document.getElementById(
                    "popupCountryFlag"
                );

            popupFlag.src = country.flag;

            popupFlag.onerror = function () {
                popupFlag.onerror = null;
                popupFlag.src =
                    "../images/no-flag.png";
            };

            document
                .getElementById("popupCode")
                .innerText = country.code;

            document
                .getElementById("popupCapital")
                .innerText =
                country.capital || "לא ידוע";

            document
                .getElementById("popupRegion")
                .innerText =
                country.region || "לא ידוע";

            document
                .getElementById("popupArea")
                .innerText =
                country.area
                    ? country.area.toLocaleString() +
                    " קמ״ר"
                    : "לא ידוע";

            document
                .getElementById("popupPopulation")
                .innerText =
                country.population
                    ? country.population.toLocaleString()
                    : "לא ידוע";

            document
                .getElementById("popupLanguages")
                .innerText =
                country.languages &&
                    country.languages.length > 0
                    ? country.languages.join(", ")
                    : "לא ידוע";

            document
                .getElementById("popupCurrencies")
                .innerText =
                country.currency &&
                    country.currency.length > 0
                    ? country.currency.join(", ")
                    : "לא ידוע";

            countryPopupOverlay.classList.add("show");
        }

        function closeCountryPopup() {
            countryPopupOverlay.classList.remove("show");
        }

        document
            .getElementById("closeCountryPopup")
            .addEventListener(
                "click",
                closeCountryPopup
            );

        countryPopupOverlay.addEventListener(
            "click",
            function (event) {
                if (event.target === countryPopupOverlay) {
                    closeCountryPopup();
                }
            }
        );

        function addSelectedCountryToList(listType) {
            if (selectedCountry === null) {
                return;
            }

            if (currentUserId === 0) {
                document
                    .getElementById("listAddMessage")
                    .innerText =
                    "לא נמצא משתמש מחובר";

                return;
            }

            const userCountry = {
                userId: currentUserId,
                countryCode: selectedCountry.code,
                countryName: selectedCountry.name,
                flag: selectedCountry.flag,
                listType: listType
            };

            document
                .getElementById("listAddMessage")
                .innerText =
                "מוסיף את המדינה לרשימה...";

            ajaxCall(
                "POST",
                userCountriesApi,
                JSON.stringify(userCountry),
                addToListSuccess,
                addToListError
            );
        }

        function addToListSuccess(result) {
            if (result <= 0) {
                document
                    .getElementById("listAddMessage")
                    .innerText =
                    "המדינה לא נוספה";

                return;
            }

            document
                .getElementById("listAddMessage")
                .innerText =
                "המדינה נוספה לרשימה בהצלחה";
        }

        function addToListError(xhr) {
            document
                .getElementById("listAddMessage")
                .innerText =
                "לא ניתן להוסיף את המדינה לרשימה";

            console.log(xhr.responseText);
        }

        document
            .getElementById("addVisitedButton")
            .addEventListener("click", function () {
                addSelectedCountryToList("Visited");
            });

        document
            .getElementById("addWantToVisitButton")
            .addEventListener("click", function () {
                addSelectedCountryToList(
                    "WantToVisit"
                );
            });

        function clearCountryForm() {
            countryForm.reset();

            document
                .getElementById("formMessage")
                .innerText = "";

            document
                .getElementById("countryCode")
                .disabled = false;
        }

        function openAddForm() {
            formMode = "add";
            selectedCountry = null;

            clearCountryForm();

            document
                .getElementById("formTitle")
                .innerText = "הוספת מדינה";

            countryFormOverlay.classList.add("show");
        }

        function openUpdateForm() {
            if (selectedCountry === null) {
                return;
            }

            formMode = "update";

            document
                .getElementById("formTitle")
                .innerText = "עדכון מדינה";

            document
                .getElementById("countryCode")
                .value = selectedCountry.code;

            document
                .getElementById("countryCode")
                .disabled = true;

            document
                .getElementById("countryName")
                .value = selectedCountry.name;

            document
                .getElementById("countryCapital")
                .value = selectedCountry.capital;

            document
                .getElementById("countryRegion")
                .value = selectedCountry.region;

            document
                .getElementById("countryArea")
                .value = selectedCountry.area;

            document
                .getElementById("countryPopulation")
                .value = selectedCountry.population;

            document
                .getElementById("countryLanguages")
                .value =
                selectedCountry.languages
                    ? selectedCountry.languages.join(", ")
                    : "";

            document
                .getElementById("countryCurrencies")
                .value =
                selectedCountry.currency
                    ? selectedCountry.currency.join(", ")
                    : "";

            document
                .getElementById("countryFlag")
                .value = selectedCountry.flag;

            document
                .getElementById("formMessage")
                .innerText = "";

            closeCountryPopup();
            countryFormOverlay.classList.add("show");
        }

        function closeCountryForm() {
            countryFormOverlay.classList.remove("show");
        }

        addCountryButton.addEventListener(
            "click",
            openAddForm
        );

        document
            .getElementById("openUpdateButton")
            .addEventListener(
                "click",
                openUpdateForm
            );

        document
            .getElementById("closeCountryForm")
            .addEventListener(
                "click",
                closeCountryForm
            );

        countryFormOverlay.addEventListener(
            "click",
            function (event) {
                if (event.target === countryFormOverlay) {
                    closeCountryForm();
                }
            }
        );

        function textToList(text) {
            if (text.trim() === "") {
                return [];
            }

            return text
                .split(",")
                .map(function (value) {
                    return value.trim();
                })
                .filter(function (value) {
                    return value !== "";
                });
        }

        countryForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                const country = {
                    code:
                        document
                            .getElementById("countryCode")
                            .value.trim(),

                    name:
                        document
                            .getElementById("countryName")
                            .value.trim(),

                    capital:
                        document
                            .getElementById("countryCapital")
                            .value.trim(),

                    region:
                        document
                            .getElementById("countryRegion")
                            .value.trim(),

                    area:
                        Number(
                            document
                                .getElementById("countryArea")
                                .value
                        ),

                    population:
                        Number(
                            document
                                .getElementById(
                                    "countryPopulation"
                                )
                                .value
                        ),

                    languages:
                        textToList(
                            document
                                .getElementById(
                                    "countryLanguages"
                                )
                                .value
                        ),

                    currency:
                        textToList(
                            document
                                .getElementById(
                                    "countryCurrencies"
                                )
                                .value
                        ),

                    flag:
                        document
                            .getElementById("countryFlag")
                            .value.trim()
                };

                if (formMode === "add") {
                    addCountry(country);
                }
                else {
                    updateCountry(country);
                }
            }
        );

        function addCountry(country) {
            ajaxCall(
                "POST",
                countriesApi,
                JSON.stringify(country),
                addCountrySuccess,
                countryFormError
            );
        }

        function addCountrySuccess(result) {
            if (result <= 0) {
                document
                    .getElementById("formMessage")
                    .innerText =
                    "המדינה לא נוספה";

                return;
            }

            closeCountryForm();
            getCountries();
        }

        function updateCountry(country) {
            ajaxCall(
                "PUT",
                countriesApi +
                "/" +
                selectedCountry.code,
                JSON.stringify(country),
                updateCountrySuccess,
                countryFormError
            );
        }

        function updateCountrySuccess(result) {
            if (result !== true) {
                document
                    .getElementById("formMessage")
                    .innerText =
                    "המדינה לא עודכנה";

                return;
            }

            closeCountryForm();
            getCountries();
        }

        function countryFormError(xhr) {
            if (
                xhr.responseText &&
                xhr.responseText.includes(
                    "duplicate key"
                )
            ) {
                document
                    .getElementById("formMessage")
                    .innerText =
                    "כבר קיימת מדינה עם הקוד הזה";
            }
            else {
                document
                    .getElementById("formMessage")
                    .innerText =
                    "אירעה שגיאה בשמירת המדינה";
            }

            console.log(xhr.responseText);
        }

        document
            .getElementById("deleteCountryButton")
            .addEventListener("click", function () {
                if (selectedCountry === null) {
                    return;
                }

                const answer = confirm(
                    "האם למחוק את " +
                    selectedCountry.name +
                    "?"
                );

                if (!answer) {
                    return;
                }

                ajaxCall(
                    "DELETE",
                    countriesApi +
                    "/" +
                    selectedCountry.code,
                    "",
                    deleteCountrySuccess,
                    deleteCountryError
                );
            });

        function deleteCountrySuccess(result) {
            if (result !== true) {
                alert("המדינה לא נמחקה");
                return;
            }

            closeCountryPopup();
            getCountries();
        }

        function deleteCountryError(xhr) {
            alert("אירעה שגיאה במחיקת המדינה");
            console.log(xhr.responseText);
        }
