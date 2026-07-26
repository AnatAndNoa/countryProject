
        const countriesApi =
            "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Countrys";

        const countrySharesApi =
            "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/CountryShares";

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

        const countrySearchInput =
            document.getElementById("countrySearchInput");

        const countriesList =
            document.getElementById("countriesList");

        const sharesContainer =
            document.getElementById("sharesContainer");

        const selectedCountryTitle =
            document.getElementById("selectedCountryTitle");

        const searchMessage =
            document.getElementById("searchMessage");

        const addShareOverlay =
            document.getElementById("addShareOverlay");

        const editShareOverlay =
            document.getElementById("editShareOverlay");

        let currentUser = null;
        let allCountries = [];

        let selectedCountry = null;
        let selectedShare = null;

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

            if (
                currentUser.role &&
                currentUser.role.toLowerCase() === "admin"
            ) {
                adminMenu.style.display = "flex";
            }

            return true;
        }

        loadCurrentUser();

        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "loginPage.html";
        });

        function loadCountries() {
            ajaxCall(
                "GET",
                countriesApi,
                "",
                loadCountriesSuccess,
                loadCountriesError
            );
        }

        function loadCountriesSuccess(countries) {
            allCountries = countries;
            fillCountryList();
        }

        function loadCountriesError(xhr) {
            searchMessage.innerText =
                "לא ניתן לטעון את רשימת המדינות";

            console.log(xhr.responseText);
        }

        function fillCountryList() {
            countriesList.innerHTML = "";

            allCountries
                .slice()
                .sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                })
                .forEach(function (country) {
                    const option =
                        document.createElement("option");

                    option.value = country.name;

                    countriesList.appendChild(option);
                });
        }

        function findCountryByName(countryName) {
            const cleanedName =
                countryName.trim().toLowerCase();

            return allCountries.find(function (country) {
                return (
                    country.name &&
                    country.name.toLowerCase() === cleanedName
                );
            });
        }

        function getChosenCountry() {
            const country =
                findCountryByName(
                    countrySearchInput.value
                );

            if (!country) {
                selectedCountry = null;

                searchMessage.innerText =
                    "יש לבחור מדינה מתוך הרשימה";

                return null;
            }

            selectedCountry = country;
            searchMessage.innerText = "";

            return selectedCountry;
        }

        countrySearchInput.addEventListener(
            "input",
            function () {
                selectedCountry = null;
                searchMessage.innerText = "";
            }
        );

        document
            .getElementById("searchSharesButton")
            .addEventListener("click", function () {
                const country = getChosenCountry();

                if (country === null) {
                    return;
                }

                loadSharesByCountry(country.code);
            });

        countrySearchInput.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();

                    document
                        .getElementById("searchSharesButton")
                        .click();
                }
            }
        );

        document
            .getElementById("openAddShareButton")
            .addEventListener("click", function () {
                const country = getChosenCountry();

                if (country === null) {
                    return;
                }

                document
                    .getElementById("addShareContent")
                    .value = "";

                document
                    .getElementById("addShareMessage")
                    .innerText = "";

                document
                    .getElementById("addShareCountryName")
                    .innerText =
                    "השיתוף יתווסף עבור: " +
                    country.name;

                addShareOverlay.classList.add("show");
            });

        function loadSharesByCountry(countryCode) {
            sharesContainer.innerHTML =
                '<div class="loading-message">' +
                'טוען שיתופים...' +
                '</div>';

            selectedCountryTitle.style.display = "block";

            selectedCountryTitle.innerText =
                "שיתופים על " +
                selectedCountry.name;

            ajaxCall(
                "GET",
                countrySharesApi +
                "/country/" +
                countryCode,
                "",
                renderShares,
                loadSharesError
            );
        }

        function renderShares(shares) {
            sharesContainer.innerHTML = "";

            if (shares.length === 0) {
                sharesContainer.innerHTML =
                    '<div class="empty-message">' +
                    'עדיין אין שיתופים על המדינה הזאת' +
                    '</div>';

                return;
            }

            shares.forEach(function (share) {
                const card =
                    document.createElement("article");

                card.className = "share-card";

                const isMyShare =
                    Number(share.userId) ===
                    Number(currentUser.id);

                if (isMyShare) {
                    card.classList.add("my-share");

                    card.addEventListener(
                        "click",
                        function () {
                            openEditSharePopup(share);
                        }
                    );
                }

                const content =
                    document.createElement("div");

                content.className = "share-content";
                content.innerText = share.content;

                const footer =
                    document.createElement("div");

                footer.className = "share-footer";

                footer.innerText =
                    "נכתב על ידי: " +
                    share.userName;

                if (isMyShare) {
                    const myShareLabel =
                        document.createElement("span");

                    myShareLabel.className =
                        "my-share-label";

                    myShareLabel.innerText =
                        "• השיתוף שלי";

                    footer.appendChild(myShareLabel);
                }

                card.appendChild(content);
                card.appendChild(footer);

                sharesContainer.appendChild(card);
            });
        }

        function loadSharesError(xhr) {
            sharesContainer.innerHTML =
                '<div class="empty-message">' +
                'לא ניתן לטעון את השיתופים' +
                '</div>';

            console.log(xhr.responseText);
        }

        document
            .getElementById("saveNewShareButton")
            .addEventListener("click", function () {
                if (selectedCountry === null) {
                    document
                        .getElementById("addShareMessage")
                        .innerText =
                        "לא נבחרה מדינה";

                    return;
                }

                const content =
                    document
                        .getElementById("addShareContent")
                        .value.trim();

                const message =
                    document.getElementById(
                        "addShareMessage"
                    );

                if (content === "") {
                    message.innerText =
                        "יש לכתוב תוכן לשיתוף";

                    return;
                }

                const newShare = {
                    shareId: 0,
                    userId: currentUser.id,
                    userName: "",
                    countryCode: selectedCountry.code,
                    countryName: "",
                    content: content
                };

                ajaxCall(
                    "POST",
                    countrySharesApi,
                    JSON.stringify(newShare),
                    addShareSuccess,
                    addShareError
                );
            });

        function addShareSuccess(result) {
            const message =
                document.getElementById(
                    "addShareMessage"
                );

            if (result <= 0) {
                message.innerText =
                    "השיתוף לא נוסף";

                return;
            }

            addShareOverlay.classList.remove("show");

            loadSharesByCountry(
                selectedCountry.code
            );
        }

        function addShareError(xhr) {
            document
                .getElementById("addShareMessage")
                .innerText =
                "אירעה שגיאה בהוספת השיתוף";

            console.log(xhr.responseText);
        }

        function openEditSharePopup(share) {
            selectedShare = share;

            document
                .getElementById("editShareCountryName")
                .value = share.countryName;

            document
                .getElementById("editShareContent")
                .value = share.content;

            document
                .getElementById("editShareMessage")
                .innerText = "";

            editShareOverlay.classList.add("show");
        }

        document
            .getElementById("saveEditedShareButton")
            .addEventListener("click", function () {
                if (selectedShare === null) {
                    return;
                }

                const content =
                    document
                        .getElementById("editShareContent")
                        .value.trim();

                if (content === "") {
                    document
                        .getElementById("editShareMessage")
                        .innerText =
                        "תוכן השיתוף לא יכול להיות ריק";

                    return;
                }

                const updatedShare = {
                    shareId: selectedShare.shareId,
                    userId: currentUser.id,
                    userName: selectedShare.userName,
                    countryCode: selectedShare.countryCode,
                    countryName: selectedShare.countryName,
                    content: content
                };

                ajaxCall(
                    "PUT",
                    countrySharesApi +
                    "/" +
                    selectedShare.shareId +
                    "/" +
                    currentUser.id,
                    JSON.stringify(updatedShare),
                    updateShareSuccess,
                    editShareError
                );
            });

        function updateShareSuccess(result) {
            if (result !== true) {
                document
                    .getElementById("editShareMessage")
                    .innerText =
                    "השיתוף לא עודכן";

                return;
            }

            editShareOverlay.classList.remove("show");

            loadSharesByCountry(
                selectedCountry.code
            );

            selectedShare = null;
        }

        document
            .getElementById("deleteShareButton")
            .addEventListener("click", function () {
                if (selectedShare === null) {
                    return;
                }

                const answer = confirm(
                    "האם למחוק את השיתוף?"
                );

                if (!answer) {
                    return;
                }

                ajaxCall(
                    "DELETE",
                    countrySharesApi +
                    "/" +
                    selectedShare.shareId +
                    "/" +
                    currentUser.id,
                    "",
                    deleteShareSuccess,
                    editShareError
                );
            });

        function deleteShareSuccess(result) {
            if (result !== true) {
                document
                    .getElementById("editShareMessage")
                    .innerText =
                    "השיתוף לא נמחק";

                return;
            }

            editShareOverlay.classList.remove("show");

            loadSharesByCountry(
                selectedCountry.code
            );

            selectedShare = null;
        }

        function editShareError(xhr) {
            document
                .getElementById("editShareMessage")
                .innerText =
                "אירעה שגיאה בשמירת השיתוף";

            console.log(xhr.responseText);
        }

        function closePopup(overlay) {
            overlay.classList.remove("show");
        }

        document
            .getElementById("closeAddShare")
            .addEventListener("click", function () {
                closePopup(addShareOverlay);
            });

        document
            .getElementById("closeEditShare")
            .addEventListener("click", function () {
                closePopup(editShareOverlay);
                selectedShare = null;
            });

        addShareOverlay.addEventListener(
            "click",
            function (event) {
                if (event.target === addShareOverlay) {
                    closePopup(addShareOverlay);
                }
            }
        );

        editShareOverlay.addEventListener(
            "click",
            function (event) {
                if (event.target === editShareOverlay) {
                    closePopup(editShareOverlay);
                    selectedShare = null;
                }
            }
        );

        loadCountries();
