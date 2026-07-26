
    const usersApi =
    "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Users";

    const quizScoresApi =
    "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/QuizScores";

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

    const gamesOverlay =
    document.getElementById("gamesOverlay");

    const leadersContainer =
    document.getElementById("leadersContainer");

    let currentUser = null;

    let allUsers = [];
    let allQuizResults = [];

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
        alert(
            "אין לך הרשאה להיכנס לדף זה"
        );

    window.location.href =
    "index.html";

    return false;
            }

    document
    .getElementById("adminWelcome")
    .innerText =
    'שלום למנהל "' +
    currentUser.userName +
    '", כאן ניתן לטפל בנתוני המשתמשים ובנתוני המדינות';

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
    .getElementById("openGamesButton")
    .addEventListener(
    "click",
    function () {
        gamesOverlay
            .classList.add("show");

    loadGameLeaders();
                }
    );

    document
    .getElementById("closeGamesPopup")
    .addEventListener(
    "click",
    function () {
        gamesOverlay
            .classList.remove("show");
                }
    );

    gamesOverlay.addEventListener(
    "click",
    function (event) {
                if (event.target === gamesOverlay) {
        gamesOverlay
            .classList.remove("show");
                }
            }
    );

    function loadGameLeaders() {
        leadersContainer.innerHTML =
        '<div class="loading-message">' +
        'טוען את נתוני המשחקים...' +
        '</div>';

    allQuizResults = [];

    ajaxCall(
    "GET",
    usersApi,
    "",
    loadUsersSuccess,
    loadLeadersError
    );
        }

    function loadUsersSuccess(users) {
        allUsers = users;

    if (allUsers.length === 0) {
        showNoGameData();
    return;
            }

    let completedRequests = 0;

    allUsers.forEach(function (user) {
        ajaxCall(
            "GET",
            quizScoresApi +
            "/user/" +
            user.id,
            "",
            function (scores) {
                saveUserScores(
                    user,
                    scores
                );

                completedRequests++;

                if (
                    completedRequests ===
                    allUsers.length
                ) {
                    calculateLeaders();
                }
            },
            function () {
                completedRequests++;

                if (
                    completedRequests ===
                    allUsers.length
                ) {
                    calculateLeaders();
                }
            }
        );
            });
        }

    function saveUserScores(
    user,
    scores)
    {
        scores.forEach(function (score) {
            allQuizResults.push({
                userId: user.id,
                userName: user.userName,
                quizType: score.quizType,
                highScore: score.highScore
            });
        });
        }

    function calculateLeaders() {
            const flagsScores =
    allQuizResults.filter(
    function (result) {
                        return (
    result.quizType &&
    result.quizType
    .toLowerCase() ===
    "flags"
    );
                    }
    );

    const triviaScores =
    allQuizResults.filter(
    function (result) {
                        return (
    result.quizType &&
    result.quizType
    .toLowerCase() ===
    "trivia"
    );
                    }
    );

    const flagsLeader =
    findHighestScore(flagsScores);

    const triviaLeader =
    findHighestScore(triviaScores);

    renderLeaders(
    flagsLeader,
    triviaLeader
    );
        }

    function findHighestScore(scores) {
            if (scores.length === 0) {
                return null;
            }

    let leader = scores[0];

    scores.forEach(function (score) {
                if (
                    Number(score.highScore) >
    Number(leader.highScore)
    ) {
        leader = score;
                }
            });

    return leader;
        }

    function renderLeaders(
    flagsLeader,
    triviaLeader)
    {
        leadersContainer.innerHTML = "";

    const flagsCard =
    createLeaderCard(
    "🏳️",
    "חידון הדגלים",
    flagsLeader
    );

    const triviaCard =
    createLeaderCard(
    "❓",
    "משחק הטריוויה",
    triviaLeader
    );

    leadersContainer.appendChild(
    flagsCard
    );

    leadersContainer.appendChild(
    triviaCard
    );
        }

    function createLeaderCard(
    icon,
    title,
    leader)
    {
            const card =
    document.createElement("section");

    card.className = "leader-card";

    const iconElement =
    document.createElement("div");

    iconElement.className =
    "leader-icon";

    iconElement.innerText = icon;

    const titleElement =
    document.createElement("h3");

    titleElement.innerText = title;

    const nameElement =
    document.createElement("div");

    nameElement.className =
    "leader-name";

    const scoreElement =
    document.createElement("div");

    scoreElement.className =
    "leader-score";

    if (leader === null) {
        nameElement.innerText =
        "עדיין אין תוצאות";

    scoreElement.innerText = "";
            }
    else {
        nameElement.innerText =
        leader.userName;

    scoreElement.innerText =
    "השיא: " +
    leader.highScore +
    " נקודות";
            }

    card.appendChild(iconElement);
    card.appendChild(titleElement);
    card.appendChild(nameElement);
    card.appendChild(scoreElement);

    return card;
        }

    function showNoGameData() {
        leadersContainer.innerHTML =
        '<div class="games-error">' +
        'עדיין אין נתוני משחקים להצגה' +
        '</div>';
        }

    function loadLeadersError(xhr) {
        leadersContainer.innerHTML =
        '<div class="games-error">' +
        'לא ניתן לטעון את נתוני המשחקים' +
        '</div>';

    console.log(xhr.responseText);
        }
