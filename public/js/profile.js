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
firebase.analytics();
const db = firebase.firestore();
$(document).ready(function() {
    $("#inputDate").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});