document.addEventListener('DOMContentLoaded', function() {
    const studentLoginForm = document.getElementById('studentLogin');
    const studentContent = document.getElementById('studentResult');
    const studentLoginMessage = document.getElementById('studentLoginMessage');
    const studentReportCard = document.getElementById('studentReportCard');
    const printStudentReportButton = document.getElementById('printStudentReport');
    const studentNameSelect = document.getElementById('studentName');

    // Populate student names dropdown (similar to script.js)
    populateStudentNamesDropdown(studentNameSelect);

    document.getElementById('studentLoginBtn').addEventListener('click', function() {
        const selectedStudentName = studentNameSelect.value;
        const enteredPassword = document.getElementById('studentPassword').value;

        if (validateStudentLogin(selectedStudentName, enteredPassword)) {
            const studentData = getStudentDataForLogin(selectedStudentName);
            studentLoginForm.style.display = 'none';
            studentContent.style.display = 'block';
            studentReportCard.innerHTML = generateReportCard(studentData);
        } else {
            studentLoginMessage.textContent = "Invalid student name or password.";
        }
    });

    printStudentReportButton.addEventListener('click', function() {
        window.print();
    });
});

function populateStudentNamesDropdown(selectElement) {
    const studentNamesData = JSON.parse(localStorage.getItem('studentNames'));

    if (studentNamesData) {
        for (const className in studentNamesData) {
            for (const studentName of studentNamesData[className]) {
                const option = document.createElement('option');
                option.value = studentName;
                option.textContent = studentName;
                selectElement.appendChild(option);
            }
        }
    }
}

function validateStudentLogin(studentName, enteredPassword) {
    const savedData = JSON.parse(localStorage.getItem('studentResults')) || [];
    for (let data of savedData) {
        if (data.name === studentName && data.password === enteredPassword) {
            return true;
        }
    }
    return false;
}

function getStudentDataForLogin(studentName) {
    const savedData = JSON.parse(localStorage.getItem('studentResults')) || [];
    return savedData.find(data => data.name === studentName);
}

// This function is the same as in script.js (consider refactoring into a separate shared file)
function generateReportCard(student) {
    let reportCard = `
        <div class="report-header">
            <h3>Student Information</h3>
            <p>Class: ${student.className}</p>
            <p>Name: ${student.name}</p>
            <p>Department: ${student.department}</p>
            <p>Image Path: ${student.imagePath}</p>
            <p>Attendance: ${student.attendance}</p>
            <p>Comment: ${student.performanceComment}</p>
        </div>
        <div class="report-body">
            <h3>Subject Scores</h3>
            <table class="subject-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>C.A Score</th>
                        <th>Exam Score</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (let score of student.subjectScores) {
        reportCard += `
                    <tr>
                        <td>${score.name}</td>
                        <td>${score.ca}</td>
                        <td>${score.exam}</td>
                        <td>${Number(score.ca) + Number(score.exam)}</td>
                    </tr>
        `;
    }

    reportCard += `
                </tbody>
            </table>
        </div>
        <div class="report-footer">
            <p>Total Score: ${student.totalScore}</p>
            <p>Average Score: ${student.averageScore.toFixed(2)}</p>
        </div>
    `;

    return reportCard;
}