
        const countriesApi =
            "https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Countrys";

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

        const adminMenu =
            document.getElementById("adminMenu");

        const correctFeedback =
            document.getElementById("correctFeedback");

        const wrongFeedback =
            document.getElementById("wrongFeedback");

        let currentUser = null;
        let currentUserId = 0;
        let allCountries = [];

        let flagCurrentCountry = null;
        let flagScore = 0;
        let flagTimeLeft = 30;
        let flagTimerInterval = null;
        let flagQuizRunning = false;
        let flagWaiting = false;

        let triviaCorrectAnswer = "";
        let triviaScore = 0;
        let triviaTimeLeft = 30;
        let triviaTimerInterval = null;
        let triviaQuizRunning = false;
        let triviaWaiting = false;

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
                return;
            }

            currentUser = JSON.parse(userAsString);
            currentUserId = currentUser.id;

            if (
                currentUser.role &&
                currentUser.role.toLowerCase() === "admin"
            ) {
                adminMenu.style.display = "flex";
            }
        }

        loadCurrentUser();

        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "loginPage.html";
        });

        function loadCountries(successFunction, errorElementId) {
            if (allCountries.length > 0) {
                successFunction(allCountries);
                return;
            }

            ajaxCall(
                "GET",
                countriesApi,
                "",
                function (countries) {
                    allCountries = countries;
                    successFunction(countries);
                },
                function (xhr) {
                    document
                        .getElementById(errorElementId)
                        .innerText =
                        "לא ניתן לטעון את המדינות";

                    console.log(xhr.responseText);
                }
            );
        }

        function shuffleArray(array) {
            for (
                let i = array.length - 1;
                i > 0;
                i--
            ) {
                const randomIndex =
                    Math.floor(Math.random() * (i + 1));

                const temporaryValue = array[i];
                array[i] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
        }

        function getRandomItem(array) {
            const randomIndex =
                Math.floor(Math.random() * array.length);

            return array[randomIndex];
        }

        function getUniqueRandomValues(
            sourceValues,
            correctValue,
            amount) {
            const values =
                sourceValues.filter(function (value) {
                    return (
                        value &&
                        value !== correctValue
                    );
                });

            const uniqueValues =
                Array.from(new Set(values));

            shuffleArray(uniqueValues);

            const answers = [correctValue];

            for (
                let i = 0;
                i < uniqueValues.length &&
                answers.length < amount;
                i++
            ) {
                answers.push(uniqueValues[i]);
            }

            shuffleArray(answers);

            return answers;
        }

        function showFeedback(element) {
            element.classList.add("show");

            setTimeout(function () {
                element.classList.remove("show");
            }, 900);
        }

        function disableButtons(container) {
            const buttons =
                container.querySelectorAll("button");

            buttons.forEach(function (button) {
                button.disabled = true;
            });
        }

        function loadBestScore(
            quizType,
            elementId) {
            ajaxCall(
                "GET",
                quizScoresApi +
                "/" +
                currentUserId +
                "/" +
                quizType,
                "",
                function (quizScore) {
                    document
                        .getElementById(elementId)
                        .innerText =
                        quizScore.highScore;
                },
                function (xhr) {
                    document
                        .getElementById(elementId)
                        .innerText = "0";

                    console.log(xhr.responseText);
                }
            );
        }

        document
            .getElementById("flagQuizButton")
            .addEventListener("click", function () {
                resetFlagQuiz();
                document
                    .getElementById("flagQuizOverlay")
                    .classList.add("show");

                loadBestScore(
                    "Flags",
                    "flagCurrentBestScore"
                );
            });

        function resetFlagQuiz() {
            stopFlagQuiz();

            document
                .getElementById("flagInstructionsArea")
                .style.display = "block";

            document
                .getElementById("flagQuizArea")
                .style.display = "none";

            document
                .getElementById("flagFinishArea")
                .style.display = "none";

            document
                .getElementById("flagQuizError")
                .innerText = "";

            flagScore = 0;
            flagTimeLeft = 30;

            document
                .getElementById("flagScoreText")
                .innerText = "0";

            document
                .getElementById("flagTimerText")
                .innerText = "30";
        }

        document
            .getElementById("startFlagQuiz")
            .addEventListener("click", function () {
                document
                    .getElementById("flagQuizError")
                    .innerText =
                    "טוען מדינות...";

                loadCountries(
                    prepareFlagQuiz,
                    "flagQuizError"
                );
            });

        function prepareFlagQuiz(countries) {
            const validCountries =
                countries.filter(function (country) {
                    return country.name && country.flag;
                });

            if (validCountries.length < 3) {
                document
                    .getElementById("flagQuizError")
                    .innerText =
                    "אין מספיק מדינות לחידון";

                return;
            }

            allCountries = validCountries;

            document
                .getElementById("flagQuizError")
                .innerText = "";

            beginFlagQuiz();
        }

        function beginFlagQuiz() {
            flagScore = 0;
            flagTimeLeft = 30;
            flagQuizRunning = true;
            flagWaiting = false;

            document
                .getElementById("flagScoreText")
                .innerText = flagScore;

            document
                .getElementById("flagTimerText")
                .innerText = flagTimeLeft;

            document
                .getElementById("flagInstructionsArea")
                .style.display = "none";

            document
                .getElementById("flagFinishArea")
                .style.display = "none";

            document
                .getElementById("flagQuizArea")
                .style.display = "block";

            createFlagQuestion();

            flagTimerInterval =
                setInterval(function () {
                    flagTimeLeft--;

                    document
                        .getElementById("flagTimerText")
                        .innerText = flagTimeLeft;

                    if (flagTimeLeft <= 0) {
                        finishFlagQuiz();
                    }
                }, 1000);
        }

        function createFlagQuestion() {
            if (!flagQuizRunning || flagWaiting) {
                return;
            }

            flagCurrentCountry =
                getRandomItem(allCountries);

            document
                .getElementById("quizFlag")
                .src = flagCurrentCountry.flag;

            const answers =
                getUniqueRandomValues(
                    allCountries.map(function (country) {
                        return country.name;
                    }),
                    flagCurrentCountry.name,
                    3
                );

            const container =
                document.getElementById(
                    "flagAnswersContainer"
                );

            container.innerHTML = "";

            answers.forEach(function (answer) {
                const button =
                    document.createElement("button");

                button.className = "answer-button";
                button.innerText = answer;

                button.addEventListener(
                    "click",
                    function () {
                        checkFlagAnswer(answer);
                    }
                );

                container.appendChild(button);
            });
        }

        function checkFlagAnswer(answer) {
            if (!flagQuizRunning || flagWaiting) {
                return;
            }

            flagWaiting = true;

            disableButtons(
                document.getElementById(
                    "flagAnswersContainer"
                )
            );

            if (answer === flagCurrentCountry.name) {
                flagScore += 10;

                document
                    .getElementById("flagScoreText")
                    .innerText = flagScore;

                showFeedback(correctFeedback);
            }
            else {
                showFeedback(wrongFeedback);
            }

            setTimeout(function () {
                flagWaiting = false;

                if (flagQuizRunning) {
                    createFlagQuestion();
                }
            }, 1000);
        }

        function finishFlagQuiz() {
            stopFlagQuiz();

            document
                .getElementById("flagQuizArea")
                .style.display = "none";

            saveScore(
                "Flags",
                flagScore,
                showFlagResults
            );
        }

        function stopFlagQuiz() {
            flagQuizRunning = false;
            flagWaiting = false;

            if (flagTimerInterval !== null) {
                clearInterval(flagTimerInterval);
                flagTimerInterval = null;
            }
        }

        function showFlagResults(result) {
            document
                .getElementById("flagInstructionsArea")
                .style.display = "none";

            document
                .getElementById("flagFinishArea")
                .style.display = "block";

            document
                .getElementById("flagFinalScore")
                .innerText = result.score;

            document
                .getElementById("flagBestScore")
                .innerText = result.highScore;

            document
                .getElementById("flagNewRecordMessage")
                .innerText =
                result.isNewRecord
                    ? "כל הכבוד! יש לך שיא חדש!"
                    : "";
        }

        document
            .getElementById("flagPlayAgainButton")
            .addEventListener("click", beginFlagQuiz);

        document
            .getElementById("closeFlagQuiz")
            .addEventListener("click", function () {
                stopFlagQuiz();

                document
                    .getElementById("flagQuizOverlay")
                    .classList.remove("show");
            });

        document
            .getElementById("triviaQuizButton")
            .addEventListener("click", function () {
                resetTriviaQuiz();

                document
                    .getElementById("triviaQuizOverlay")
                    .classList.add("show");

                loadBestScore(
                    "Trivia",
                    "triviaCurrentBestScore"
                );
            });

        function resetTriviaQuiz() {
            stopTriviaQuiz();

            document
                .getElementById("triviaInstructionsArea")
                .style.display = "block";

            document
                .getElementById("triviaQuizArea")
                .style.display = "none";

            document
                .getElementById("triviaFinishArea")
                .style.display = "none";

            document
                .getElementById("triviaQuizError")
                .innerText = "";

            triviaScore = 0;
            triviaTimeLeft = 30;

            document
                .getElementById("triviaScoreText")
                .innerText = "0";

            document
                .getElementById("triviaTimerText")
                .innerText = "30";
        }

        document
            .getElementById("startTriviaQuiz")
            .addEventListener("click", function () {
                document
                    .getElementById("triviaQuizError")
                    .innerText =
                    "טוען שאלות...";

                loadCountries(
                    prepareTriviaQuiz,
                    "triviaQuizError"
                );
            });

        function prepareTriviaQuiz(countries) {
            allCountries =
                countries.filter(function (country) {
                    return country.name;
                });

            if (allCountries.length < 4) {
                document
                    .getElementById("triviaQuizError")
                    .innerText =
                    "אין מספיק מדינות לחידון";

                return;
            }

            document
                .getElementById("triviaQuizError")
                .innerText = "";

            beginTriviaQuiz();
        }

        function beginTriviaQuiz() {
            triviaScore = 0;
            triviaTimeLeft = 30;
            triviaQuizRunning = true;
            triviaWaiting = false;

            document
                .getElementById("triviaScoreText")
                .innerText = triviaScore;

            document
                .getElementById("triviaTimerText")
                .innerText = triviaTimeLeft;

            document
                .getElementById("triviaInstructionsArea")
                .style.display = "none";

            document
                .getElementById("triviaFinishArea")
                .style.display = "none";

            document
                .getElementById("triviaQuizArea")
                .style.display = "block";

            createTriviaQuestion();

            triviaTimerInterval =
                setInterval(function () {
                    triviaTimeLeft--;

                    document
                        .getElementById("triviaTimerText")
                        .innerText = triviaTimeLeft;

                    if (triviaTimeLeft <= 0) {
                        finishTriviaQuiz();
                    }
                }, 1000);
        }

        function createTriviaQuestion() {
            if (!triviaQuizRunning || triviaWaiting) {
                return;
            }

            const questionTypes = [
                "capital",
                "region",
                "language"
            ];

            let questionCreated = false;

            while (!questionCreated) {
                const type =
                    getRandomItem(questionTypes);

                if (type === "capital") {
                    questionCreated =
                        createCapitalQuestion();
                }

                if (type === "region") {
                    questionCreated =
                        createRegionQuestion();
                }

                if (type === "language") {
                    questionCreated =
                        createLanguageQuestion();
                }
            }
        }

        function createCapitalQuestion() {
            const validCountries =
                allCountries.filter(function (country) {
                    return (
                        country.name &&
                        country.capital
                    );
                });

            if (validCountries.length < 4) {
                return false;
            }

            const country =
                getRandomItem(validCountries);

            triviaCorrectAnswer = country.name;

            const answers =
                getUniqueRandomValues(
                    validCountries.map(function (item) {
                        return item.name;
                    }),
                    triviaCorrectAnswer,
                    4
                );

            showTriviaQuestion(
                "העיר " +
                country.capital +
                " היא עיר הבירה של:",
                answers
            );

            return true;
        }

        function createRegionQuestion() {
            const validCountries =
                allCountries.filter(function (country) {
                    return (
                        country.name &&
                        country.region
                    );
                });

            const regions =
                Array.from(
                    new Set(
                        validCountries.map(function (country) {
                            return country.region;
                        })
                    )
                );

            if (regions.length < 4) {
                return false;
            }

            const country =
                getRandomItem(validCountries);

            triviaCorrectAnswer = country.region;

            const answers =
                getUniqueRandomValues(
                    regions,
                    triviaCorrectAnswer,
                    4
                );

            showTriviaQuestion(
                "המדינה " +
                country.name +
                " נמצאת ביבשת:",
                answers
            );

            return true;
        }

        function createLanguageQuestion() {
            const validCountries =
                allCountries.filter(function (country) {
                    return (
                        country.name &&
                        country.languages &&
                        country.languages.length > 0
                    );
                });

            if (validCountries.length === 0) {
                return false;
            }

            const country =
                getRandomItem(validCountries);

            const correctLanguage =
                getRandomItem(country.languages);

            const allLanguages = [];

            validCountries.forEach(function (item) {
                item.languages.forEach(function (language) {
                    allLanguages.push(language);
                });
            });

            const uniqueLanguages =
                Array.from(new Set(allLanguages));

            if (uniqueLanguages.length < 4) {
                return false;
            }

            triviaCorrectAnswer = correctLanguage;

            const answers =
                getUniqueRandomValues(
                    uniqueLanguages,
                    triviaCorrectAnswer,
                    4
                );

            showTriviaQuestion(
                "איזו מהשפות הבאות מדוברת במדינה " +
                country.name +
                "?",
                answers
            );

            return true;
        }

        function showTriviaQuestion(
            questionText,
            answers) {
            document
                .getElementById("triviaQuestion")
                .innerText = questionText;

            const container =
                document.getElementById(
                    "triviaAnswersContainer"
                );

            container.innerHTML = "";

            answers.forEach(function (answer) {
                const button =
                    document.createElement("button");

                button.className = "answer-button";
                button.innerText =
                    translateRegion(answer);

                button.addEventListener(
                    "click",
                    function () {
                        checkTriviaAnswer(answer);
                    }
                );

                container.appendChild(button);
            });
        }

        function checkTriviaAnswer(answer) {
            if (!triviaQuizRunning || triviaWaiting) {
                return;
            }

            triviaWaiting = true;

            disableButtons(
                document.getElementById(
                    "triviaAnswersContainer"
                )
            );

            if (answer === triviaCorrectAnswer) {
                triviaScore += 10;

                document
                    .getElementById("triviaScoreText")
                    .innerText = triviaScore;

                showFeedback(correctFeedback);
            }
            else {
                showFeedback(wrongFeedback);
            }

            setTimeout(function () {
                triviaWaiting = false;

                if (triviaQuizRunning) {
                    createTriviaQuestion();
                }
            }, 1000);
        }

        function finishTriviaQuiz() {
            stopTriviaQuiz();

            document
                .getElementById("triviaQuizArea")
                .style.display = "none";

            saveScore(
                "Trivia",
                triviaScore,
                showTriviaResults
            );
        }

        function stopTriviaQuiz() {
            triviaQuizRunning = false;
            triviaWaiting = false;

            if (triviaTimerInterval !== null) {
                clearInterval(triviaTimerInterval);
                triviaTimerInterval = null;
            }
        }

        function showTriviaResults(result) {
            document
                .getElementById("triviaInstructionsArea")
                .style.display = "none";

            document
                .getElementById("triviaFinishArea")
                .style.display = "block";

            document
                .getElementById("triviaFinalScore")
                .innerText = result.score;

            document
                .getElementById("triviaBestScore")
                .innerText = result.highScore;

            document
                .getElementById("triviaNewRecordMessage")
                .innerText =
                result.isNewRecord
                    ? "כל הכבוד! שברת את השיא שלך!"
                    : "";
        }

        document
            .getElementById("triviaPlayAgainButton")
            .addEventListener("click", beginTriviaQuiz);

        document
            .getElementById("closeTriviaQuiz")
            .addEventListener("click", function () {
                stopTriviaQuiz();

                document
                    .getElementById("triviaQuizOverlay")
                    .classList.remove("show");
            });

        function saveScore(
            quizType,
            currentScore,
            successFunction) {
            const quizScore = {
                userId: currentUserId,
                quizType: quizType,
                score: currentScore,
                highScore: 0,
                isNewRecord: false
            };

            ajaxCall(
                "POST",
                quizScoresApi,
                JSON.stringify(quizScore),
                successFunction,
                function (xhr) {
                    console.log(xhr.responseText);

                    successFunction({
                        score: currentScore,
                        highScore: "לא ניתן לטעון",
                        isNewRecord: false
                    });
                }
            );
        }

        function translateRegion(region) {
            if (region === "Europe") {
                return "אירופה";
            }

            if (region === "Asia") {
                return "אסיה";
            }

            if (region === "Africa") {
                return "אפריקה";
            }

            if (region === "Americas") {
                return "אמריקה";
            }

            if (region === "Oceania") {
                return "אוקיאניה";
            }

            if (region === "Antarctic") {
                return "אנטארקטיקה";
            }

            return region;
        }
