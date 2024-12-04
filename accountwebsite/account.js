document.addEventListener("DOMContentLoaded", function () {
    const currentPlayer = JSON.parse(localStorage.getItem('currentPlayer'));

    // Account Details
    const accountDetails = document.getElementById("accountDetails");
    const signInForm = document.getElementById("signInForm");

    // If user is already signed in
    if (currentPlayer) {
        accountDetails.style.display = "block";
        signInForm.style.display = "none";

        document.getElementById("usernameDisplay").textContent = currentPlayer.username;
        document.getElementById('patientImage').src = "https://api.dicebear.com/9.x/lorelei/svg?seed=" + currentPlayer.username;
        document.getElementById("emailDisplay").textContent = currentPlayer.email;
        document.getElementById("coinsDisplay").textContent = currentPlayer.coins;

        // Logout button
        document.getElementById("logoutBtn").addEventListener("click", function () {
            localStorage.removeItem('currentPlayer');
            window.location.reload();
        });
    } else {
        // No player is signed in, show the sign-in form
        accountDetails.style.display = "none";
        signInForm.style.display = "block";

        // Register button redirects to the registration page
        document.getElementById("registerBtn").addEventListener("click", function () {
            window.location.href = "../webpages/register.html";
        });

        // Handle sign-in form submission
        document.getElementById("signInSubmit").addEventListener("click", function () {
            const usernameOrEmail = document.getElementById("signInUsername").value.trim();
            const password = document.getElementById("signInPassword").value.trim();

            if (!usernameOrEmail || !password) {
                alert("Please fill in both fields.");
                return;
            }

            // Get all players from localStorage
            const players = JSON.parse(localStorage.getItem('players')) || [];
            const player = players.find(p => (p.username === usernameOrEmail || p.email === usernameOrEmail) && p.password === password);

            if (player) {
                // If player is found, sign them in
                localStorage.setItem('currentPlayer', JSON.stringify(player));
                window.location.reload(); // Reload to display account details
            } else {
                alert("Invalid username/email or password.");
            }
        });
    }
});
