const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = express();
var lo = require('lodash');

app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.setHeader("X-Powered-By", "Express 4.17.1");
    res.setHeader('X-Internal-IP', '10.0.0.42');
    res.setHeader("Server", "Apache/2.4.49 (Ubuntu)");

    next();
});

// Insecure database setup (A01:2021 - Broken Access Control, A06:2021 - Vulnerable and Outdated Components)
const db = new sqlite3.Database(':memory:'); // Using in-memory database for demonstration

// Insecure JWT secret (A02:2021 - Cryptographic Failures)
const secret = 'shh-it-is-a-secret';

// Create a table and insert a dummy user (insecurely) (A07:2021 - Identification and Authentication Failures)
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

    // Inserting a user with plaintext password
    db.run("INSERT INTO users (username, password) VALUES ('admin', 'password123')");
});

// Insecure user login function
app.post('/login', (req, res) => {
    try {
        const { username, password } = lo.defaults(req.body, { username: '', password: '' });

        // SQL Injection vulnerability (A03:2021 - Injection)
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        db.get(query, (err, row) => {
            if (err) {
                res.status(500).send('Internal server error: ' + query);
                return;
            }

            if (row) {
                // Sensitive data exposure (A02:2021 - Cryptographic Failures)
                const token = jwt.sign({ id: row.id, username: row.username }, secret, { expiresIn: '1h' });

                // Lack of input validation (A04:2021 - Insecure Design, A05:2021 - Security Misconfiguration)
                res.send(`Welcome ${username}, your token is ${token}`);

                // Logging sensitive information (A09:2021 - Security Logging and Monitoring Failures)
                console.log(`User ${username} logged in with password ${password}`);
            } else {
                // Redirecting to login form with error message
                res.redirect(`/login-form?error=User ${username} not found&username=${username}&password=${password}`);
            }
        });

    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

// Insecure password storage (A07:2021 - Identification and Authentication Failures)
app.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;

        // Storing passwords in plaintext
        const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
        db.run(query, (err) => {
            if (err) {
                res.status(500).send('Internal server error: ' + query);
                return;
            }
            res.send('User registered successfully');
        });
    } catch (err) {
        res.status(500).send('Internal server error');
    }

});

// Example of a vulnerable API endpoint (A01:2021 - Broken Access Control)
app.get('/admin', (req, res) => {
    try {
        const token = req.headers['authorization'];

        // Insecure JWT verification
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(500).send('Internal server error');
                return;
            } else {
                // Allowing access based on decoded token without proper checks
                res.send('Welcome to the admin area');
            }
        });
    }
    catch (err) {
        res.status(500).send('Internal server error');
    }
});

// Insecure API endpoint (A08:2021 - Injection)
// Serve /query?query=SearchedQuery
app.get('/query', (req, res) => {

    // Find users based on the query

    const query = ` Select username from users where username = '${req.query.query}';`;
    db.run(query, (err, rows) => {
        if (err) {
            res.status(500).send('Internal server error');
            return;
        }
        res.send(rows);
    });

});

// Redirect to video tutorial
app.get('/redirect', (req, res) => {
    const url = req.query.url;
    return res.redirect(url);
});
app.get('/stack', (req, res) => {
    const fakeError = new Error("Simulated stack trace exposure");
    fakeError.stack = `
Error: Simulated stack trace exposure
    at /app/routes/user.js:27:15
    at Object.handle (/app/controllers/auth.js:88:13)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/app/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at /app/node_modules/express/lib/router/index.js:281:22
    at Function.process_params (/app/node_modules/express/lib/router/index.js:335:12)
    at next (/app/node_modules/express/lib/router/index.js:275:10)
    at expressInit (/app/node_modules/express/lib/middleware/init.js:40:5)
`;
    res.status(500).send(fakeError.stack);
});
app.get('/login-form', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Form</title>
        <!-- Using a very old version of jQuery -->
        <script src="https://code.jquery.com/jquery-1.4.2.min.js"></script>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                opacity: 0;
                animation: fadeIn 1s ease-in-out forwards;
            }
            h1 {
                margin-bottom: 20px;
                font-size: 24px;
                color: #333;
                text-align: center;
            }
            label {
                font-size: 14px;
                color: #555;
            }
            input[type="text"], input[type="password"] {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            button {
                width: 100%;
                padding: 10px;
                background-color: #6e8efb;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            button:hover {
                background-color: #5a75e5;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Login</h1>
            <h2 style="color: red; font-size: 14px;">This is a highly vulnerable login form, used to demonstrate common security issues</h2>
            <h2>${req.query.error ? req.query.error : ''}</h2>
            <form id="loginForm" action="/login" method="POST">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required value="${req.query.username ? req.query.username : ''}"><br><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required value="${req.query.password ? req.query.password : ''}"><br><br>
                <button type="submit">Login</button>
            </form>
        <a href="/admin">Admin</a><br>
        <a href="/query?query=">Find username</a><br>
        <a href="/stack">Forgot password</a><br>
        <a href="/redirect?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ">Watch video tutorial</a>
        </div>


        <script>
            $(document).ready(function(){
                $('#loginForm').on('submit', function(event){
                    alert('Submitting login form with jQuery 1.4.2!');
                });
            });
        </script>
    </body>
    </html>
    `;
    res.send(html);
});
// Redirect '/' to '/login-form'
app.get('/', (req, res) => {
    res.redirect('/login-form');
});
// Insecure app listening on port 3000
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});