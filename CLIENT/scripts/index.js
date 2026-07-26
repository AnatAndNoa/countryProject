
        const usersApi =
            "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Users";

        const personalInfoApi =
            "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/PersonalInfo";

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

        const welcomeMessage =
            document.getElementById("welcomeMessage");

        const adminMenu =
            document.getElementById("adminMenu");

        const updateUserOverlay =
            document.getElementById("updateUserOverlay");

        const personalInfoOverlay =
            document.getElementById("personalInfoOverlay");

        const languageLevelOverlay =
            document.getElementById("languageLevelOverlay");

        const updateUserForm =
            document.getElementById("updateUserForm");

        const editInformationArea =
            document.getElementById("editInformationArea");

        const continentSelect =
            document.getElementById("continentSelect");

        const languageSelect =
            document.getElementById("languageSelect");

        let currentUser = null;
        let userContinents = [];
        let userLanguages = [];
        let selectedLanguage = "";

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
            const userAsString =
                localStorage.getItem("currentUser");

            if (userAsString === null) {
                window.location.href =
                    "loginPage.html";

                return false;
            }

            currentUser =
                JSON.parse(userAsString);

            welcomeMessage.innerText =
                "שלום, " +
                currentUser.userName;

            if (
                currentUser.role &&
                currentUser.role.toLowerCase() === "admin"
            ) {
                adminMenu.style.display =
                    "flex";
            }
            else {
                adminMenu.style.display =
                    "none";
            }

            return true;
        }

        loadCurrentUser();

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

        document
            .getElementById(
                "openUpdateUserButton"
            )
            .addEventListener(
                "click",
                function () {
                    closeMenu();
                    fillUpdateUserForm();

                    updateUserOverlay
                        .classList.add("show");
                }
            );

        function fillUpdateUserForm() {
            document
                .getElementById("updateId")
                .value =
                currentUser.id;

            document
                .getElementById("updateEmail")
                .value =
                currentUser.email;

            document
                .getElementById("updateUserName")
                .value =
                currentUser.userName;

            document
                .getElementById("updatePassword")
                .value =
                currentUser.password;

            document
                .getElementById("updateBirthDate")
                .value =
                formatDateForInput(
                    currentUser.birthDate
                );

            document
                .getElementById("updateAddress")
                .value =
                currentUser.address;

            const message =
                document.getElementById(
                    "updateUserMessage"
                );

            message.innerText = "";

            message.classList.remove(
                "success-message"
            );
        }

        function formatDateForInput(dateValue) {
            if (!dateValue) {
                return "";
            }

            if (
                dateValue.length >= 10 &&
                dateValue[4] === "-" &&
                dateValue[7] === "-"
            ) {
                return dateValue.substring(
                    0,
                    10
                );
            }

            const parts =
                dateValue.split("/");

            if (parts.length === 3) {
                return (
                    parts[2] +
                    "-" +
                    parts[1].padStart(2, "0") +
                    "-" +
                    parts[0].padStart(2, "0")
                );
            }

            return dateValue;
        }

        document
            .getElementById("closeUpdateUser")
            .addEventListener(
                "click",
                function () {
                    updateUserOverlay
                        .classList.remove("show");
                }
            );

        updateUserOverlay.addEventListener(
            "click",
            function (event) {
                if (
                    event.target ===
                    updateUserOverlay
                ) {
                    updateUserOverlay
                        .classList.remove("show");
                }
            }
        );

        updateUserForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                const updatedUser = {
                    id:
                        currentUser.id,

                    userName:
                        document
                            .getElementById(
                                "updateUserName"
                            )
                            .value.trim(),

                    email:
                        currentUser.email,

                    password:
                        document
                            .getElementById(
                                "updatePassword"
                            )
                            .value,

                    birthDate:
                        document
                            .getElementById(
                                "updateBirthDate"
                            )
                            .value,

                    address:
                        document
                            .getElementById(
                                "updateAddress"
                            )
                            .value.trim(),

                    isLocked:
                        Boolean(
                            currentUser.isLocked
                        ),

                    role:
                        currentUser.role,

                    isShareBlocked:
                        Boolean(
                            currentUser.isShareBlocked
                        )
                };

                ajaxCall(
                    "PUT",
                    usersApi +
                    "/" +
                    currentUser.id,
                    JSON.stringify(
                        updatedUser
                    ),
                    function (result) {
                        updateUserSuccess(
                            result,
                            updatedUser
                        );
                    },
                    updateUserError
                );
            }
        );

        function updateUserSuccess(
            result,
            updatedUser) {
            const message =
                document.getElementById(
                    "updateUserMessage"
                );

            if (result !== true) {
                message.classList.remove(
                    "success-message"
                );

                message.innerText =
                    "הפרטים לא עודכנו";

                return;
            }

            currentUser.userName =
                updatedUser.userName;

            currentUser.password =
                updatedUser.password;

            currentUser.birthDate =
                updatedUser.birthDate;

            currentUser.address =
                updatedUser.address;

            currentUser.isLocked =
                updatedUser.isLocked;

            currentUser.role =
                updatedUser.role;

            currentUser.isShareBlocked =
                updatedUser.isShareBlocked;

            localStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );

            welcomeMessage.innerText =
                "שלום, " +
                currentUser.userName;

            message.classList.add(
                "success-message"
            );

            message.innerText =
                "הפרטים עודכנו בהצלחה";
        }

        function updateUserError(xhr) {
            const message =
                document.getElementById(
                    "updateUserMessage"
                );

            message.classList.remove(
                "success-message"
            );

            message.innerText =
                "אירעה שגיאה בעדכון הפרטים";

            console.log(xhr.responseText);
        }

        document
            .getElementById(
                "openPersonalInfoButton"
            )
            .addEventListener(
                "click",
                function () {
                    closeMenu();
                    openPersonalInfo();
                }
            );

        function openPersonalInfo() {
            personalInfoOverlay
                .classList.add("show");

            document
                .getElementById(
                    "personalLoadingMessage"
                )
                .style.display =
                "block";

            document
                .getElementById(
                    "personalContent"
                )
                .style.display =
                "none";

            editInformationArea
                .classList.remove("show");

            loadAllPersonalInformation();
        }

        function loadAllPersonalInformation() {
            loadUserContinents();
            loadUserLanguages();
            loadVisitedCountriesCount();
            loadAvailableContinents();
            loadAvailableLanguages();
        }

        function showPersonalContent() {
            document
                .getElementById(
                    "personalLoadingMessage"
                )
                .style.display =
                "none";

            document
                .getElementById(
                    "personalContent"
                )
                .style.display =
                "block";
        }

        function loadUserContinents() {
            ajaxCall(
                "GET",
                personalInfoApi +
                "/continents/" +
                currentUser.id,
                "",
                function (continents) {
                    userContinents =
                        continents;

                    renderUserContinents();
                    showPersonalContent();
                },
                personalInfoLoadError
            );
        }

        function renderUserContinents() {
            const list =
                document.getElementById(
                    "userContinentsList"
                );

            list.innerHTML = "";

            if (
                userContinents.length === 0
            ) {
                list.innerHTML =
                    '<div class="empty-list-message">' +
                    'עדיין לא הוספת יבשות מועדפות' +
                    '</div>';

                return;
            }

            userContinents.forEach(
                function (item) {
                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "saved-item";

                    const text =
                        document.createElement(
                            "span"
                        );

                    text.className =
                        "saved-item-text";

                    text.innerText =
                        translateContinent(
                            item.continent
                        );

                    const deleteButton =
                        document.createElement(
                            "button"
                        );

                    deleteButton.className =
                        "small-button delete-small-button";

                    deleteButton.innerText =
                        "מחיקה";

                    deleteButton.addEventListener(
                        "click",
                        function () {
                            deleteUserContinent(
                                item.continent
                            );
                        }
                    );

                    row.appendChild(text);
                    row.appendChild(
                        deleteButton
                    );

                    list.appendChild(row);
                }
            );
        }

        function loadUserLanguages() {
            ajaxCall(
                "GET",
                personalInfoApi +
                "/languages/" +
                currentUser.id,
                "",
                function (languages) {
                    userLanguages =
                        languages;

                    renderUserLanguages();
                    showPersonalContent();
                },
                personalInfoLoadError
            );
        }

        function renderUserLanguages() {
            const list =
                document.getElementById(
                    "userLanguagesList"
                );

            list.innerHTML = "";

            if (
                userLanguages.length === 0
            ) {
                list.innerHTML =
                    '<div class="empty-list-message">' +
                    'עדיין לא הוספת שפות' +
                    '</div>';

                return;
            }

            userLanguages.forEach(
                function (item) {
                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "saved-item";

                    const text =
                        document.createElement(
                            "span"
                        );

                    text.className =
                        "saved-item-text";

                    text.innerText =
                        item.language +
                        " — " +
                        translateLanguageLevel(
                            item.languageLevel
                        );

                    const buttons =
                        document.createElement(
                            "div"
                        );

                    buttons.className =
                        "item-buttons";

                    const updateButton =
                        document.createElement(
                            "button"
                        );

                    updateButton.className =
                        "small-button";

                    updateButton.innerText =
                        "שינוי רמה";

                    updateButton.addEventListener(
                        "click",
                        function () {
                            selectedLanguage =
                                item.language;

                            languageLevelOverlay
                                .classList.add(
                                    "show"
                                );
                        }
                    );

                    const deleteButton =
                        document.createElement(
                            "button"
                        );

                    deleteButton.className =
                        "small-button delete-small-button";

                    deleteButton.innerText =
                        "מחיקה";

                    deleteButton.addEventListener(
                        "click",
                        function () {
                            deleteUserLanguage(
                                item.language
                            );
                        }
                    );

                    buttons.appendChild(
                        updateButton
                    );

                    buttons.appendChild(
                        deleteButton
                    );

                    row.appendChild(text);
                    row.appendChild(buttons);

                    list.appendChild(row);
                }
            );
        }

        function loadVisitedCountriesCount() {
            ajaxCall(
                "GET",
                personalInfoApi +
                "/visited-count/" +
                currentUser.id,
                "",
                function (count) {
                    document
                        .getElementById(
                            "visitedCountriesCount"
                        )
                        .innerText =
                        count;

                    showPersonalContent();
                },
                personalInfoLoadError
            );
        }

        function personalInfoLoadError(xhr) {
            document
                .getElementById(
                    "personalLoadingMessage"
                )
                .innerText =
                "לא ניתן לטעון את המידע";

            console.log(xhr.responseText);
        }

        function loadAvailableContinents() {
            ajaxCall(
                "GET",
                personalInfoApi +
                "/available/continents",
                "",
                renderAvailableContinents,
                personalInfoLoadError
            );
        }

        function renderAvailableContinents(
            continents) {
            continentSelect.innerHTML =
                '<option value="">' +
                'בחרי יבשת' +
                '</option>';

            continents.forEach(
                function (continent) {
                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        continent;

                    option.innerText =
                        translateContinent(
                            continent
                        );

                    continentSelect
                        .appendChild(option);
                }
            );
        }

        function loadAvailableLanguages() {
            ajaxCall(
                "GET",
                personalInfoApi +
                "/available/languages",
                "",
                renderAvailableLanguages,
                personalInfoLoadError
            );
        }

        function renderAvailableLanguages(
            languages) {
            languageSelect.innerHTML =
                '<option value="">' +
                'בחרי שפה' +
                '</option>';

            languages.forEach(
                function (language) {
                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        language;

                    option.innerText =
                        language;

                    languageSelect
                        .appendChild(option);
                }
            );
        }

        document
            .getElementById(
                "toggleEditInformationButton"
            )
            .addEventListener(
                "click",
                function () {
                    editInformationArea
                        .classList.toggle(
                            "show"
                        );
                }
            );

        document
            .getElementById(
                "addContinentButton"
            )
            .addEventListener(
                "click",
                function () {
                    const selectedContinent =
                        continentSelect.value;

                    if (
                        selectedContinent === ""
                    ) {
                        showPersonalMessage(
                            "יש לבחור יבשת",
                            false
                        );

                        return;
                    }

                    const continent = {
                        userId:
                            currentUser.id,

                        continent:
                            selectedContinent
                    };

                    ajaxCall(
                        "POST",
                        personalInfoApi +
                        "/continent",
                        JSON.stringify(
                            continent
                        ),
                        addContinentSuccess,
                        personalInfoActionError
                    );
                }
            );

        function addContinentSuccess(result) {
            if (result <= 0) {
                showPersonalMessage(
                    "היבשת כבר נמצאת ברשימה",
                    false
                );

                return;
            }

            showPersonalMessage(
                "היבשת נוספה בהצלחה",
                true
            );

            continentSelect.value = "";

            loadUserContinents();
        }

        function deleteUserContinent(
            continent) {
            const answer =
                confirm(
                    "האם להסיר את היבשת מהרשימה?"
                );

            if (!answer) {
                return;
            }

            ajaxCall(
                "DELETE",
                personalInfoApi +
                "/continent/" +
                currentUser.id +
                "/" +
                encodeURIComponent(
                    continent
                ),
                "",
                function (result) {
                    if (result === true) {
                        showPersonalMessage(
                            "היבשת הוסרה",
                            true
                        );

                        loadUserContinents();
                    }
                    else {
                        showPersonalMessage(
                            "היבשת לא הוסרה",
                            false
                        );
                    }
                },
                personalInfoActionError
            );
        }

        document
            .getElementById(
                "chooseLanguageLevelButton"
            )
            .addEventListener(
                "click",
                function () {
                    selectedLanguage =
                        languageSelect.value;

                    if (
                        selectedLanguage === ""
                    ) {
                        showPersonalMessage(
                            "יש לבחור שפה",
                            false
                        );

                        return;
                    }

                    languageLevelOverlay
                        .classList.add(
                            "show"
                        );
                }
            );

        document
            .querySelectorAll(
                ".level-button"
            )
            .forEach(
                function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            const level =
                                button.dataset
                                    .level;

                            saveUserLanguage(
                                level
                            );
                        }
                    );
                }
            );

        function saveUserLanguage(level) {
            if (
                selectedLanguage === ""
            ) {
                return;
            }

            const userLanguage = {
                userId:
                    currentUser.id,

                language:
                    selectedLanguage,

                languageLevel:
                    level
            };

            ajaxCall(
                "POST",
                personalInfoApi +
                "/language",
                JSON.stringify(
                    userLanguage
                ),
                saveLanguageSuccess,
                personalInfoActionError
            );
        }

        function saveLanguageSuccess(result) {
            languageLevelOverlay
                .classList.remove(
                    "show"
                );

            if (result <= 0) {
                showPersonalMessage(
                    "השפה לא נשמרה",
                    false
                );

                return;
            }

            showPersonalMessage(
                "השפה והרמה נשמרו בהצלחה",
                true
            );

            languageSelect.value = "";
            selectedLanguage = "";

            loadUserLanguages();
        }

        function deleteUserLanguage(
            language) {
            const answer =
                confirm(
                    "האם להסיר את השפה מהרשימה?"
                );

            if (!answer) {
                return;
            }

            ajaxCall(
                "DELETE",
                personalInfoApi +
                "/language/" +
                currentUser.id +
                "/" +
                encodeURIComponent(
                    language
                ),
                "",
                function (result) {
                    if (result === true) {
                        showPersonalMessage(
                            "השפה הוסרה",
                            true
                        );

                        loadUserLanguages();
                    }
                    else {
                        showPersonalMessage(
                            "השפה לא הוסרה",
                            false
                        );
                    }
                },
                personalInfoActionError
            );
        }

        function personalInfoActionError(
            xhr) {
            showPersonalMessage(
                "אירעה שגיאה בשמירת המידע",
                false
            );

            console.log(xhr.responseText);
        }

        function showPersonalMessage(
            text,
            isSuccess) {
            const message =
                document.getElementById(
                    "personalInfoMessage"
                );

            message.innerText =
                text;

            if (isSuccess) {
                message.classList.add(
                    "success-message"
                );
            }
            else {
                message.classList.remove(
                    "success-message"
                );
            }
        }

        function translateLanguageLevel(
            level) {
            if (level === "Basic") {
                return "רמה בסיסית";
            }

            if (
                level === "Intermediate"
            ) {
                return "רמה בינונית";
            }

            if (
                level === "Fluent"
            ) {
                return "שליטה שוטפת";
            }

            return level;
        }

        function translateContinent(
            continent) {
            if (
                continent === "Europe"
            ) {
                return "אירופה";
            }

            if (
                continent === "Asia"
            ) {
                return "אסיה";
            }

            if (
                continent === "Africa"
            ) {
                return "אפריקה";
            }

            if (
                continent === "Americas"
            ) {
                return "אמריקה";
            }

            if (
                continent === "Oceania"
            ) {
                return "אוקיאניה";
            }

            if (
                continent === "Antarctic"
            ) {
                return "אנטארקטיקה";
            }

            return continent;
        }

        document
            .getElementById(
                "closePersonalInfo"
            )
            .addEventListener(
                "click",
                function () {
                    personalInfoOverlay
                        .classList.remove(
                            "show"
                        );
                }
            );

        personalInfoOverlay.addEventListener(
            "click",
            function (event) {
                if (
                    event.target ===
                    personalInfoOverlay
                ) {
                    personalInfoOverlay
                        .classList.remove(
                            "show"
                        );
                }
            }
        );

        document
            .getElementById(
                "closeLanguageLevel"
            )
            .addEventListener(
                "click",
                function () {
                    languageLevelOverlay
                        .classList.remove(
                            "show"
                        );

                    selectedLanguage = "";
                }
            );

        languageLevelOverlay.addEventListener(
            "click",
            function (event) {
                if (
                    event.target ===
                    languageLevelOverlay
                ) {
                    languageLevelOverlay
                        .classList.remove(
                            "show"
                        );

                    selectedLanguage = "";
                }
            }
        );
