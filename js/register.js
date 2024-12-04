// Player Class: Defines the Player structure
class Player {
    constructor(username, dateOfBirth, email, password) {
        this.username = username;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.coins = 0;
        this.totalGames = 0;
        this.winGames = 0;
    }
}

// Model: Handles data storage and retrieval
var model = {
    players: [],
    currentPlayer: null,

    // Save players to localStorage
    savePlayer: function () {
        localStorage.setItem('players', JSON.stringify(this.players));
    },

    // Load players from localStorage
    loadPlayers: function () {
        this.players = JSON.parse(localStorage.getItem('players')) || [];
    }
};

// Controller: Manages user interactions and business logic
var controller = {
    // Handles registration process
    register: function () {
        const username = $('#username').val().trim();
        const dateOfBirth = $('#dateofbirth').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#cpassword').val().trim();

        if (username && dateOfBirth && email && password && confirmPassword) {
            const answer = this.validateAndRegister(username, dateOfBirth, email, password, confirmPassword);
            const message = answer.message;
            alert(message);
        } else {
            alert(`Please fill all the required spaces`)
        }

    },

    // Validates user input and registers a new player
    validateAndRegister: function (username, dateOfBirth, email, password, confirmPassword) {
        const isUsernameTaken = model.players.some(player => player.username === username);
        const isEmailTaken = model.players.some(player => player.email === email);
        const isPasswordValid = this.isPasswordValid(password, confirmPassword);
        const isAgeValid = this.isAgeValid();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let boolean = false;
        let message = " ";
        if (isUsernameTaken && isEmailTaken) {
            message = `Username and email are already in use.`;
        } else if (isUsernameTaken) {
            message = `This username is already in use.`;
        } else if (isEmailTaken) {
            message = `This email is already in use.`;
        } else if (!emailRegex.test(email)) {
            message = `Please enter a valid email address.`;
        } else if (!isPasswordValid) {
            message = `Passwords do not match.`;
        } else if (!isAgeValid) {
            message = `You must be at least 18 years old to register.`;
        } else {
            message = `Player was successfully registered.`;
            boolean = true;
        }
        return { message, boolean };
    },

    spinnerHandle: function () {
        const username = $('#username').val().trim();
        const dateOfBirth = $('#dateofbirth').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#cpassword').val().trim();
        const answer = this.validateAndRegister(username, dateOfBirth, email, password, confirmPassword);
        var boolean = answer.boolean;
        return boolean;
    },

    // Creates a new player and saves it to the model
    createPlayer: function (username, dateOfBirth, email, password) {
        if (!username || !dateOfBirth || !email || !password) {
            throw new Error('Invalid player data. Cannot create player.');
        }

        const newPlayer = new Player(username, dateOfBirth, email, password);
        model.players.push(newPlayer);
        model.savePlayer();
    },

    // Verifies if passwords match
    isPasswordValid: function (password, confirmPassword) {
        return password === confirmPassword;
    },

    // Verifies if the user's age is 18 or older
    isAgeValid: function () {
        const dateBirthString = $('#dateofbirth').val();
        const dateBirth = new Date(dateBirthString);
        const currentDate = new Date();
        const age = (currentDate.getFullYear()) - (dateBirth.getFullYear());
        const month = (currentDate.getMonth()) - (dateBirth.getMonth());
        if (month < 0 || (month === 0 && currentDate.getDate() < dateBirth.getDate())) {
            age = age - 1;
        }
        if (age < 18) {
            return false;
        }
        return true;
    },
}


// View: Handles UI interactions
var view = {
    initialize: function () {
        document.addEventListener('DOMContentLoaded', () => {
            const loadingOverlay = document.getElementById('loadingoverlay');
            model.loadPlayers();
            document.getElementById('registrationButton').addEventListener('click', function () {//You mix the jquary with DOM
                const username = $('#username').val().trim();
                const dateOfBirth = $('#dateofbirth').val().trim();
                const email = $('#email').val().trim();
                const password = $('#password').val().trim();
                if (controller.spinnerHandle.bind(controller)()) {
                    loadingOverlay.style.display = 'flex'; // Mostrar overlay de carga
                    setTimeout(() => {
                        controller.register.bind(controller)();
                        controller.createPlayer.bind(controller)(username, dateOfBirth, email, password);
                        loadingOverlay.style.display = 'none';
                        // Ocultar overlay después de 10 segundos
                    }, 2000);

                } else {
                    controller.register.bind(controller)();
                };
            });
        })
    }
};

// Initialization
view.initialize();