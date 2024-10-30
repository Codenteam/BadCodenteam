# BadCodenteam Application

This project is an intentionally vulnerable Node.js application designed to demonstrate common security flaws that correspond to the [OWASP Top 10](https://owasp.org/Top10/) security risks. **This code is for educational purposes only** and should never be used in a production environment.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [OWASP Top 10 Vulnerabilities Demonstrated](#owasp-top-10-vulnerabilities-demonstrated)
- [Important Notes](#important-notes)
- [Disclaimer](#disclaimer)

## Overview

This application showcases how common mistakes in coding practices can lead to severe security vulnerabilities. It includes an insecure login system, registration system, and a poorly protected admin area, all with intentional security flaws.

## Installation

### Prerequisites

- Node.js (version 14.x or later)
- npm (Node Package Manager)

### Steps

1.  **Clone the Repository:**

        git clone https://github.com/Codenteam/BadCodenteam.git
        cd BadCodenteam

2.  **Install Dependencies:**

    Run the following command to install the required Node.js packages:

        npm install

3.  **Run the Application:**

    Start the application by running:

        node app.js

    The server will start on [http://localhost:3000](http://localhost:3000).

## Usage

### Available Endpoints

- **POST `/login`:**

  Logs in a user with a username and password.

      curl -X POST -d "username=admin&password=password123" http://localhost:3000/login

- **POST `/register`:**

  Registers a new user with a username and password.

      curl -X POST -d "username=newuser&password=newpass" http://localhost:3000/register

- **GET `/admin`:**

  Access the admin area with a JWT token.

      curl -H "Authorization: <your_jwt_token>" http://localhost:3000/admin

## OWASP Top 10 Vulnerabilities Demonstrated

This application contains examples of the following OWASP Top 10 vulnerabilities:

1. **A01:2021 - Broken Access Control:** Improperly implemented access control, allowing unauthorized users to access restricted areas.
2. **A02:2021 - Cryptographic Failures:** Weak encryption and poor management of sensitive data like passwords and JWT secrets.
3. **A03:2021 - Injection:** Vulnerable to SQL Injection due to unsanitized user inputs.
4. **A04:2021 - Insecure Design:** Lack of input validation and other security controls, leading to potential design flaws.
5. **A05:2021 - Security Misconfiguration:** The application lacks proper error handling, input validation, and has insecure settings.
6. **A06:2021 - Vulnerable and Outdated Components:** Uses insecure database configuration and potentially outdated dependencies.
7. **A07:2021 - Identification and Authentication Failures:** Storing passwords in plaintext and weak authentication mechanisms.
8. **A09:2021 - Security Logging and Monitoring Failures:** Logging sensitive information such as plaintext passwords.
9. **A08:2021 - Software and Data Integrity Failures:** No data integrity checks, leading to potential data tampering.
10. **A10:2021 - Server-Side Request Forgery (SSRF):** While not explicitly demonstrated, this could be easily introduced by mishandling input data.

## Important Notes

- **Do not deploy this application in a production environment.**
- This application is designed purely for educational purposes and to understand what types of vulnerabilities can exist in a Node.js application.
- Use this application to learn how to avoid these vulnerabilities in your own projects by following secure coding practices.

## Disclaimer

This code is provided "as-is" for educational purposes only. The authors take no responsibility for any damages caused by the use or misuse of this code. Never use this code in production environments or on live servers.
