window.addEventListener("DOMContentLoaded", () => {
    var firebaseConfig = {
        apiKey: "AIzaSyDIKQ278rabheOzbV8gvNRG39a_vcTcDNw",
        authDomain: "tester-e9a14.firebaseapp.com",
        projectId: "tester-e9a14",
        storageBucket: "tester-e9a14.appspot.com",
        messagingSenderId: "978520269780",
        appId: "1:978520269780:web:8439cf0282cb52ac7b2c41"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)


    document
        .getElementById("login")
        .addEventListener("submit", (event) => {
            event.preventDefault();
            const login = event.target.login.value;
            const password = event.target.password.value;

            firebase
                .auth()
                .signInWithEmailAndPassword(login, password)
                .then(({
                    user
                }) => {
                    return user.getIdToken().then((idToken) => {
                        return fetch("/sessionLogin", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                            },
                            body: JSON.stringify({
                                idToken
                            }),
                        });
                    });
                })
                .then(() => {
                    swal({
                        title: "Login Success",
                        icon: "success",
                        button: false,
                        text: "         ",

                    })
                    return firebase.auth().signOut();
                })
                .then(() => {
                    window.location.assign("/profile");
                });
            return false;
        });
});