
    const friendsApi =
    "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Friends";

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

    const friendsArea =
    document.getElementById("friendsArea");

    const friendsGrid =
    document.getElementById("friendsGrid");

    const addFriendForm =
    document.getElementById("addFriendForm");

    let currentUser = null;
    let selectedFriend = null;

    function loadCurrentUser() {
            const userString =
    localStorage.getItem("currentUser");

    if (userString === null) {
        window.location.href =
        "loginPage.html";

    return false;
            }

    currentUser =
    JSON.parse(userString);

    return true;
        }

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

    function showLoading(container, text) {
        container.innerHTML =
        '<div class="loading-message">' +
        text +
        '</div>';
        }

    function showEmpty(container, text) {
        container.innerHTML =
        '<div class="empty-message">' +
        text +
        '</div>';
        }

    function showError(container, text) {
        container.innerHTML =
        '<div class="error-message">' +
        text +
        '</div>';
        }

    document
    .getElementById("openAddFriendButton")
    .addEventListener(
    "click",
    function () {
                    const message =
    document.getElementById(
    "addFriendMessage"
    );

    message.innerText = "";
    message.classList.remove(
    "success"
    );

    document
    .getElementById(
    "friendEmailInput"
    )
    .value = "";

    openPopup(
    "addFriendOverlay"
    );
                }
    );

    addFriendForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

    const friendEmail =
    document
    .getElementById(
    "friendEmailInput"
    )
    .value.trim();

    const message =
    document.getElementById(
    "addFriendMessage"
    );

    message.innerText = "";
    message.classList.remove(
    "success"
    );

    if (friendEmail === "") {
        message.innerText =
        "יש להכניס כתובת אימייל";

    return;
                }

    const friendship = {
        userId: currentUser.id,
    friendEmail: friendEmail
                };

    ajaxCall(
    "POST",
    friendsApi,
    JSON.stringify(friendship),
    addFriendSuccess,
    addFriendError
    );
            }
    );

    function addFriendSuccess(result) {
            const message =
    document.getElementById(
    "addFriendMessage"
    );

    message.classList.remove(
    "success"
    );

    const numericResult =
    Number(result);

    if (numericResult === 1) {
        message.classList.add(
            "success"
        );

    message.innerText =
    "החבר נוסף בהצלחה";

    document
    .getElementById(
    "friendEmailInput"
    )
    .value = "";

    loadFriends();
    return;
            }

    if (numericResult === -1) {
        message.innerText =
        "אי אפשר להוסיף את עצמך כחבר";

    return;
            }

    if (numericResult === -2) {
        message.innerText =
        "המשתמש כבר נמצא ברשימת החברים שלך";

    return;
            }

    message.innerText =
    "לא נמצא משתמש פתוח עם האימייל שהוזן";
        }

    function addFriendError(xhr) {
        console.log(xhr.responseText);

    document
    .getElementById(
    "addFriendMessage"
    )
    .innerText =
    "אירעה שגיאה בהוספת החבר";
        }

    document
    .getElementById("showFriendsButton")
    .addEventListener(
    "click",
    function () {
        friendsArea.classList.add(
            "show"
        );

    loadFriends();
                }
    );

    function loadFriends() {
        friendsArea.classList.add(
            "show"
        );

    showLoading(
    friendsGrid,
    "טוען את רשימת החברים..."
    );

    ajaxCall(
    "GET",
    friendsApi +
    "/" +
    currentUser.id,
    "",
    renderFriends,
    function () {
        showError(
            friendsGrid,
            "לא ניתן לטעון את רשימת החברים"
        );
                }
    );
        }

    function renderFriends(friends) {
        friendsGrid.innerHTML = "";

    if (
    friends === null ||
    friends.length === 0
    ) {
        showEmpty(
            friendsGrid,
            "עדיין לא הוספת חברים"
        );

    return;
            }

    friends.forEach(
    function (friend) {
                    const card =
    document.createElement(
    "div"
    );

    card.className =
    "friend-card";

    const icon =
    document.createElement(
    "div"
    );

    icon.className =
    "friend-icon";

    icon.innerText = "👤";

    const name =
    document.createElement(
    "div"
    );

    name.className =
    "friend-name";

    name.innerText =
    friend.friendUserName ||
    "משתמש ללא שם";

    const email =
    document.createElement(
    "div"
    );

    email.className =
    "friend-email";

    email.innerText =
    friend.friendEmail ||
    "אימייל לא ידוע";

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(email);

    card.addEventListener(
    "click",
    function () {
        selectedFriend =
        friend;

    openFriendCountries(
    friend
    );
                        }
    );

    friendsGrid.appendChild(
    card
    );
                }
    );
        }

    function openFriendCountries(friend) {
        document
            .getElementById(
                "friendCountriesTitle"
            )
            .innerText =
        "המדינות שבהן " +
        (
            friend.friendUserName ||
            friend.friendEmail ||
            "החבר"
        ) +
        " ביקר/ה";

    openPopup(
    "friendCountriesOverlay"
    );

    loadFriendCountries(
    friend.friendUserId
    );
        }

    function loadFriendCountries(
    friendUserId) {
            const container =
    document.getElementById(
    "friendCountriesGrid"
    );

    showLoading(
    container,
    "טוען את המדינות..."
    );

    const url =
    friendsApi +
    "/" +
    currentUser.id +
    "/" +
    friendUserId +
    "/visited";

    ajaxCall(
    "GET",
    url,
    "",
    renderFriendCountries,
    function () {
        showError(
            container,
            "לא ניתן לטעון את המדינות של החבר"
        );
                }
    );
        }

    function renderFriendCountries(
    countries) {
            const container =
    document.getElementById(
    "friendCountriesGrid"
    );

    container.innerHTML = "";

    if (
    countries === null ||
    countries.length === 0
    ) {
        showEmpty(
            container,
            "החבר עדיין לא הוסיף מדינות שבהן ביקר"
        );

    return;
            }

    countries.forEach(
    function (country) {
                    const card =
    document.createElement(
    "div"
    );

    if (country.hasShares === true) {
        card.className =
        "country-card clickable";
                    }
    else {
        card.className =
        "country-card not-clickable";
                    }

    const flag =
    document.createElement(
    "img"
    );

    flag.className =
    "country-flag";

    flag.src =
    country.flag || "";

    flag.alt =
    "דגל המדינה";

    const name =
    document.createElement(
    "div"
    );

    name.className =
    "country-name";

    name.innerText =
    country.countryName ||
    country.countryCode ||
    "מדינה";

    const indicator =
    document.createElement(
    "div"
    );

    indicator.className =
    "share-indicator";

    if (country.hasShares === true) {
        indicator.innerText =
        "יש שיתופים — לחצו לצפייה";
                    }
    else {
        indicator.innerText =
        "אין שיתופים על המדינה";
                    }

    card.appendChild(flag);
    card.appendChild(name);
    card.appendChild(indicator);

    if (
    country.hasShares === true
    ) {
        card.addEventListener(
            "click",
            function () {
                openFriendShares(
                    country
                );
            }
        );
                    }

    container.appendChild(card);
                }
    );
        }

    function openFriendShares(country) {
            if (selectedFriend === null) {
                return;
            }

    document
    .getElementById(
    "friendSharesTitle"
    )
    .innerText =
    "השיתופים של " +
    (
    selectedFriend.friendUserName ||
    selectedFriend.friendEmail ||
    "החבר"
    ) +
    " על " +
    (
    country.countryName ||
    country.countryCode ||
    "המדינה"
    );

    openPopup(
    "friendSharesOverlay"
    );

    loadFriendShares(
    selectedFriend.friendUserId,
    country.countryCode
    );
        }

    function loadFriendShares(
    friendUserId,
    countryCode) {
            const container =
    document.getElementById(
    "friendSharesList"
    );

    showLoading(
    container,
    "טוען את השיתופים..."
    );

    const url =
    friendsApi +
    "/" +
    currentUser.id +
    "/" +
    friendUserId +
    "/shares/" +
    encodeURIComponent(
    countryCode
    );

    ajaxCall(
    "GET",
    url,
    "",
    renderFriendShares,
    function () {
        showError(
            container,
            "לא ניתן לטעון את השיתופים"
        );
                }
    );
        }

    function renderFriendShares(shares) {
            const container =
    document.getElementById(
    "friendSharesList"
    );

    container.innerHTML = "";

    if (
    shares === null ||
    shares.length === 0
    ) {
        showEmpty(
            container,
            "לא נמצאו שיתופים על המדינה"
        );

    return;
            }

    shares.forEach(
    function (share) {
                    const card =
    document.createElement(
    "div"
    );

    card.className =
    "share-card";

    const date =
    document.createElement(
    "div"
    );

    date.className =
    "share-date";

    date.innerText =
    formatShareDate(
    share.createdAt
    );

    const content =
    document.createElement(
    "div"
    );

    content.className =
    "share-content";

    content.innerText =
    share.content ||
    "לא נמצא תוכן לשיתוף";

    card.appendChild(date);
    card.appendChild(content);

    container.appendChild(card);
                }
    );
        }

    function formatShareDate(dateValue) {
            if (!dateValue) {
                return "";
            }

    const date =
    new Date(dateValue);

    if (isNaN(date.getTime())) {
                return dateValue;
            }

    return (
    "פורסם בתאריך " +
    date.toLocaleDateString(
    "he-IL"
    ) +
    " בשעה " +
    date.toLocaleTimeString(
    "he-IL",
    {
        hour: "2-digit",
    minute: "2-digit"
                    }
    )
    );
        }

    loadCurrentUser();
