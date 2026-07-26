
    const usersApi =
    "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Users";

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

    const usersGrid =
    document.getElementById("usersGrid");

    const pageMessage =
    document.getElementById("pageMessage");

    let currentUser = null;
    let allUsers = [];

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

    function checkAdminUser() {
            const userAsString =
    localStorage.getItem("currentUser");

    if (userAsString === null) {
        window.location.href =
        "loginPage.html";

    return false;
            }

    currentUser =
    JSON.parse(userAsString);

    if (
    !currentUser.role ||
    currentUser.role.toLowerCase() !== "admin"
    ) {
        alert("אין לך הרשאה להיכנס לדף זה");

    window.location.href =
    "index.html";

    return false;
            }

    return true;
        }

    checkAdminUser();

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
    .getElementById("showUsersButton")
    .addEventListener("click", loadUsers);

    function loadUsers() {
        usersGrid.innerHTML =
        '<div class="loading-message">' +
        'טוען את רשימת המשתמשים...' +
        '</div>';

    pageMessage.innerText = "";

    ajaxCall(
    "GET",
    usersApi,
    "",
    loadUsersSuccess,
    loadUsersError
    );
        }

    function loadUsersSuccess(users) {
        allUsers = users;
    renderUsers();
        }

    function loadUsersError(xhr) {
        usersGrid.innerHTML =
        '<div class="empty-message">' +
        'לא ניתן לטעון את המשתמשים' +
        '</div>';

    console.log(xhr.responseText);
        }

    function renderUsers() {
        usersGrid.innerHTML = "";

    if (allUsers.length === 0) {
        usersGrid.innerHTML =
        '<div class="empty-message">' +
        'אין משתמשים להצגה' +
        '</div>';

    return;
            }

    allUsers.forEach(function (user) {
        usersGrid.appendChild(
            createUserCard(user)
        );
            });
        }

    function createUserCard(user) {
            const card =
    document.createElement("article");

    card.className = "user-card";

    if (user.isLocked) {
        card.classList.add("locked-card");
            }

    if (user.isShareBlocked) {
        card.classList.add(
            "share-blocked-card"
        );
            }

    const title =
    document.createElement("h2");

    title.className = "user-name";
    title.innerText = user.userName;

    const details =
    document.createElement("div");

    details.className = "user-details";

    details.appendChild(
    createDetailRow(
    "מזהה",
    user.id
    )
    );

    details.appendChild(
    createDetailRow(
    "שם משתמש",
    user.userName
    )
    );

    details.appendChild(
    createDetailRow(
    "אימייל",
    user.email
    )
    );

    details.appendChild(
    createDetailRow(
    "סיסמה",
    user.password
    )
    );

    details.appendChild(
    createDetailRow(
    "תאריך לידה",
    user.birthDate
    )
    );

    details.appendChild(
    createDetailRow(
    "כתובת",
    user.address
    )
    );

    details.appendChild(
    createDetailRow(
    "תפקיד",
    user.role
    )
    );

    details.appendChild(
    createDetailRow(
    "מצב חשבון",
    user.isLocked
    ? "נעול"
    : "פעיל"
    )
    );

    details.appendChild(
    createDetailRow(
    "שיתוף תוכן",
    user.isShareBlocked
    ? "חסום"
    : "מורשה"
    )
    );

    const statusArea =
    document.createElement("div");

    statusArea.className = "status-area";

    const lockToggle =
    createToggleRow(
    user.isLocked
    ? "שחרור החשבון"
    : "נעילת החשבון",
    user.isLocked,
    function (newValue) {
        updateLockStatus(
            user,
            newValue
        );
                    }
    );

    const shareToggle =
    createToggleRow(
    user.isShareBlocked
    ? "הרשאה לשיתוף תוכן"
    : "חסימה משיתוף תוכן",
    user.isShareBlocked,
    function (newValue) {
        updateShareStatus(
            user,
            newValue
        );
                    }
    );

    const statusMessage =
    document.createElement("div");

    statusMessage.className =
    "status-message";

    statusMessage.id =
    "userMessage_" + user.id;

    statusArea.appendChild(lockToggle);
    statusArea.appendChild(shareToggle);
    statusArea.appendChild(statusMessage);

    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(statusArea);

    return card;
        }

    function createDetailRow(
    labelText,
    valueText)
    {
            const row =
    document.createElement("div");

    row.className = "detail-row";

    const label =
    document.createElement("span");

    label.className = "detail-label";
    label.innerText = labelText + ":";

    const value =
    document.createElement("span");

    value.className = "detail-value";

    value.innerText =
    valueText === null ||
    valueText === undefined ||
    valueText === ""
    ? "לא הוזן"
    : valueText;

    row.appendChild(label);
    row.appendChild(value);

    return row;
        }

    function createToggleRow(
    text,
    checked,
    changeFunction)
    {
            const row =
    document.createElement("div");

    row.className = "toggle-row";

    const textElement =
    document.createElement("span");

    textElement.className = "toggle-text";
    textElement.innerText = text;

    const label =
    document.createElement("label");

    label.className = "toggle-switch";

    const input =
    document.createElement("input");

    input.type = "checkbox";
    input.checked = Boolean(checked);

    const slider =
    document.createElement("span");

    slider.className = "toggle-slider";

    input.addEventListener(
    "change",
    function () {
        changeFunction(input.checked);
                }
    );

    label.appendChild(input);
    label.appendChild(slider);

    row.appendChild(textElement);
    row.appendChild(label);

    return row;
        }

    function updateLockStatus(
    user,
    newLockStatus)
    {
            const updatedUser = {
        id: user.id,
    userName: user.userName,
    email: user.email,
    password: user.password,
    birthDate: user.birthDate,
    address: user.address,
    isLocked: newLockStatus,
    role: user.role,
    isShareBlocked:
    Boolean(user.isShareBlocked)
            };

    updateUserOnServer(
    user,
    updatedUser,
    newLockStatus
    ? "החשבון ננעל בהצלחה"
    : "החשבון שוחרר בהצלחה"
    );
        }

    function updateShareStatus(
    user,
    newShareStatus)
    {
            const updatedUser = {
        id: user.id,
    userName: user.userName,
    email: user.email,
    password: user.password,
    birthDate: user.birthDate,
    address: user.address,
    isLocked: Boolean(user.isLocked),
    role: user.role,
    isShareBlocked: newShareStatus
            };

    updateUserOnServer(
    user,
    updatedUser,
    newShareStatus
    ? "המשתמש נחסם משיתוף תוכן"
    : "המשתמש מורשה לשתף תוכן"
    );
        }

    function updateUserOnServer(
    originalUser,
    updatedUser,
    successText)
    {
        showUserMessage(
            originalUser.id,
            "שומר את השינוי..."
        );

    ajaxCall(
    "PUT",
    usersApi + "/" + originalUser.id,
    JSON.stringify(updatedUser),
    function (result) {
        updateUserSuccess(
            result,
            originalUser,
            updatedUser,
            successText
        );
                },
    function (xhr) {
        updateUserError(
            xhr,
            originalUser.id
        );
                }
    );
        }

    function updateUserSuccess(
    result,
    originalUser,
    updatedUser,
    successText)
    {
            if (result !== true) {
        showUserMessage(
            originalUser.id,
            "השינוי לא נשמר"
        );

    loadUsers();
    return;
            }

    originalUser.isLocked =
    updatedUser.isLocked;

    originalUser.isShareBlocked =
    updatedUser.isShareBlocked;

    showUserMessage(
    originalUser.id,
    successText
    );

    setTimeout(function () {
        renderUsers();
            }, 700);
        }

    function updateUserError(
    xhr,
    userId)
    {
        showUserMessage(
            userId,
            "אירעה שגיאה בשמירת השינוי"
        );

    console.log(xhr.responseText);

    setTimeout(function () {
        loadUsers();
            }, 800);
        }

    function showUserMessage(
    userId,
    text)
    {
            const message =
    document.getElementById(
    "userMessage_" + userId
    );

    if (message !== null) {
        message.innerText = text;
            }
        }
