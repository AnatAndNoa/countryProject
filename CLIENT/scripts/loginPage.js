
        const usersApi ="https://proj.ruppin.ac.il/cgroup30/test2/tar1/api/Users";

        const openLoginButton =
            document.getElementById(
                "openLoginButton"
            );

        const openRegisterButton =
            document.getElementById(
                "openRegisterButton"
            );

        const openPreviewButton =
            document.getElementById(
                "openPreviewButton"
            );

        const previewRegisterButton =
            document.getElementById(
                "previewRegisterButton"
            );

        const loginOverlay =
            document.getElementById(
                "loginOverlay"
            );

        const registerOverlay =
            document.getElementById(
                "registerOverlay"
            );

        const previewOverlay =
            document.getElementById(
                "previewOverlay"
            );

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        const registerForm =
            document.getElementById(
                "registerForm"
            );

        const loginSubmitButton =
            document.getElementById(
                "loginSubmitButton"
            );

        const registerSubmitButton =
            document.getElementById(
                "registerSubmitButton"
            );


        function ajaxCall(
            method,
            api,
            data,
            successCB,
            errorCB) {

            $.ajax({
                type: method,
                url: api,
                data: data,
                cache: false,
                contentType: "application/json",
                dataType: "json",
                success: successCB,
                error: errorCB
            });
        }


        function openPopup(overlay) {
            overlay.classList.add("show");

            document.body.style.overflow =
                "hidden";
        }


        function closePopup(overlay) {
            overlay.classList.remove("show");

            document.body.style.overflow =
                "";
        }


        openLoginButton.addEventListener(
            "click",
            function () {

                document
                    .getElementById("loginError")
                    .innerText = "";

                openPopup(loginOverlay);
            }
        );


        openRegisterButton.addEventListener(
            "click",
            function () {

                clearRegisterErrors();

                openPopup(registerOverlay);
            }
        );


        openPreviewButton.addEventListener(
            "click",
            function () {

                openPopup(previewOverlay);
            }
        );


    
        previewRegisterButton.addEventListener(
            "click",
            function () {

                closePopup(previewOverlay);

                clearRegisterErrors();

                openPopup(registerOverlay);
            }
        );


        document
            .querySelectorAll(".close-button")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const overlayId =
                            button.getAttribute(
                                "data-close"
                            );

                        const overlay =
                            document.getElementById(
                                overlayId
                            );

                        closePopup(overlay);
                    }
                );
            });


        loginOverlay.addEventListener(
            "click",
            function (event) {

                if (event.target === loginOverlay) {
                    closePopup(loginOverlay);
                }
            }
        );


        registerOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    registerOverlay
                ) {
                    closePopup(registerOverlay);
                }
            }
        );


        previewOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    previewOverlay
                ) {
                    closePopup(previewOverlay);
                }
            }
        );


        /*
            התחברות
        */
        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const email =
                    document
                        .getElementById(
                            "loginEmail"
                        )
                        .value.trim();

                const password =
                    document
                        .getElementById(
                            "loginPassword"
                        )
                        .value;

                const loginError =
                    document.getElementById(
                        "loginError"
                    );

                loginError.innerText = "";

                loginSubmitButton.disabled = true;

                loginSubmitButton.innerText =
                    "מתחבר...";

                const loginUser = {
                    email: email,
                    password: password
                };

                ajaxCall(
                    "POST",
                    usersApi + "/login",
                    JSON.stringify(loginUser),
                    loginSuccess,
                    loginErrorCB
                );
            }
        );


        function loginSuccess(user) {

            loginSubmitButton.disabled = false;

            loginSubmitButton.innerText =
                "כניסה";

            localStorage.removeItem(
                "currentUser"
            );

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            window.location.href =
                "index.html";
        }


        function loginErrorCB(
            xhr,
            status,
            error) {

            loginSubmitButton.disabled = false;

            loginSubmitButton.innerText =
                "כניסה";

            console.log("Status:", status);
            console.log("Error:", error);

            console.log(
                "Response:",
                xhr.responseText
            );

            const loginError =
                document.getElementById(
                    "loginError"
                );

            if (xhr.status === 401) {

                loginError.innerText =
                    "האימייל או הסיסמה אינם נכונים, או שהחשבון נעול";
            }
            else {

                loginError.innerText =
                    "אירעה שגיאה בהתחברות";
            }

            document
                .getElementById(
                    "loginPassword"
                )
                .value = "";
        }


        /*
            הרשמה
        */
        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                clearRegisterErrors();

                const userName =
                    document
                        .getElementById(
                            "registerUserName"
                        )
                        .value.trim();

                const email =
                    document
                        .getElementById(
                            "registerEmail"
                        )
                        .value.trim();

                const password =
                    document
                        .getElementById(
                            "registerPassword"
                        )
                        .value;

                const birthDate =
                    document
                        .getElementById(
                            "registerBirthDate"
                        )
                        .value;

                const address =
                    document
                        .getElementById(
                            "registerAddress"
                        )
                        .value.trim();

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                const passwordRegex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

                let isValid = true;


                if (userName === "") {

                    document
                        .getElementById(
                            "userNameError"
                        )
                        .innerText =
                        "יש להכניס שם משתמש";

                    isValid = false;
                }


                if (!emailRegex.test(email)) {

                    document
                        .getElementById(
                            "emailError"
                        )
                        .innerText =
                        "כתובת האימייל אינה תקינה";

                    isValid = false;
                }


                if (
                    !passwordRegex.test(password)
                ) {

                    document
                        .getElementById(
                            "passwordError"
                        )
                        .innerText =
                        "הסיסמה צריכה להכיל אות גדולה, אות קטנה ומספר";

                    isValid = false;
                }


                if (birthDate === "") {

                    document
                        .getElementById(
                            "birthDateError"
                        )
                        .innerText =
                        "יש לבחור תאריך לידה";

                    isValid = false;
                }


                if (address === "") {

                    document
                        .getElementById(
                            "addressError"
                        )
                        .innerText =
                        "יש להכניס כתובת";

                    isValid = false;
                }


                if (!isValid) {
                    return;
                }


                registerSubmitButton.disabled = true;

                registerSubmitButton.innerText =
                    "מבצע הרשמה...";


                ajaxCall(
                    "GET",
                    usersApi,
                    "",
                    function (users) {

                        checkEmailAndRegister(
                            users,
                            userName,
                            email,
                            password,
                            birthDate,
                            address
                        );
                    },
                    registerErrorCB
                );
            }
        );


        function checkEmailAndRegister(
            users,
            userName,
            email,
            password,
            birthDate,
            address) {

            const emailExists =
                users.some(function (user) {

                    return (
                        user.email &&
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                    );
                });


            if (emailExists) {

                registerSubmitButton.disabled = false;

                registerSubmitButton.innerText =
                    "הרשמה";

                document
                    .getElementById(
                        "emailError"
                    )
                    .innerText =
                    "האימייל כבר נמצא בשימוש";

                return;
            }


            const newUser = {
                id: 0,
                userName: userName,
                email: email,
                password: password,
                birthDate: birthDate,
                address: address,
                isLocked: false,
                role: "User",
                isShareBlocked: false
            };


            ajaxCall(
                "POST",
                usersApi,
                JSON.stringify(newUser),
                function (result) {

                    registerSuccess(
                        result,
                        email,
                        password
                    );
                },
                registerErrorCB
            );
        }


        function registerSuccess(
            result,
            email,
            password) {

            if (result <= 0) {

                registerSubmitButton.disabled = false;

                registerSubmitButton.innerText =
                    "הרשמה";

                document
                    .getElementById(
                        "registerGeneralError"
                    )
                    .innerText =
                    "ההרשמה לא הצליחה";

                return;
            }


            const loginUser = {
                email: email,
                password: password
            };


            ajaxCall(
                "POST",
                usersApi + "/login",
                JSON.stringify(loginUser),
                registerLoginSuccess,
                registerErrorCB
            );
        }


        function registerLoginSuccess(user) {

            registerSubmitButton.disabled = false;

            registerSubmitButton.innerText =
                "הרשמה";

            localStorage.removeItem(
                "currentUser"
            );

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            window.location.href =
                "index.html";
        }


        function registerErrorCB(
            xhr,
            status,
            error) {

            registerSubmitButton.disabled = false;

            registerSubmitButton.innerText =
                "הרשמה";

            console.log("Status:", status);
            console.log("Error:", error);

            if (xhr) {

                console.log(
                    "Response:",
                    xhr.responseText
                );
            }

            document
                .getElementById(
                    "registerGeneralError"
                )
                .innerText =
                "אירעה שגיאה. נסו שוב";
        }


        function clearRegisterErrors() {

            document
                .getElementById(
                    "userNameError"
                )
                .innerText = "";

            document
                .getElementById(
                    "emailError"
                )
                .innerText = "";

            document
                .getElementById(
                    "passwordError"
                )
                .innerText = "";

            document
                .getElementById(
                    "birthDateError"
                )
                .innerText = "";

            document
                .getElementById(
                    "addressError"
                )
                .innerText = "";

            document
                .getElementById(
                    "registerGeneralError"
                )
                .innerText = "";
        }
