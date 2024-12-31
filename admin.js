document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminAuth');
    const adminContent = document.getElementById('adminContent');
    const loginMessage = document.getElementById('loginMessage');
    const passwordTable = document.getElementById('passwordTable');
    const accessInputPageButton = document.getElementById('accessInputPage');
    const classFormsContainer = document.getElementById('class-forms-container');
    const saveStudentNamesButton = document.getElementById('saveStudentNames');

    // Placeholder for actual admin password verification
    const correctAdminPassword = "admin";

    document.getElementById('adminLogin').addEventListener('click', function() {
        const enteredPassword = document.getElementById('adminPassword').value;

        if (enteredPassword === correctAdminPassword) {
            adminLoginForm.style.display = 'none';
            adminContent.style.display = 'block';
            loadStudentData();
            createClassForms();
        } else {
            loginMessage.textContent = "Incorrect admin password.";
        }
    });

    accessInputPageButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    function createClassForms() {
        const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
        for (const className of classes) {
            const form = document.createElement('div');
            form.innerHTML = `<h3>${className}</h3>`;
            for (let i = 1; i <= 25; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `${className}-student-${i}`;
                input.placeholder = `Student ${i} Name`;
                form.appendChild(input);
                form.appendChild(document.createElement('br'));
            }
            classFormsContainer.appendChild(form);
        }
    }

    saveStudentNamesButton.addEventListener('click', function() {
        const studentNamesData = {};
        const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
        for (const className of classes) {
            studentNamesData[className] = [];
            for (let i = 1; i <= 25; i++) {
                const inputId = `${className}-student-${i}`;
                const studentName = document.getElementById(inputId).value;
                studentNamesData[className].push(studentName);
            }
        }
        localStorage.setItem('studentNames', JSON.stringify(studentNamesData));
        document.getElementById('saveMessage').textContent = "Student names saved successfully.";
    });

    function loadStudentData() {
        const savedData = JSON.parse(localStorage.getItem('studentResults')) || [];
        const tableBody = document.querySelector('#passwordTable tbody');
        tableBody.innerHTML = '';

        for (let data of savedData) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.password}</td>
            `;
            tableBody.appendChild(row);
        }
    }
});