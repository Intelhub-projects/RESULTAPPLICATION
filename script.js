document.addEventListener('DOMContentLoaded', function() {
    populateDropdown('class', 12, 'Class ');
    populateStudentNamesDropdown(); // Load student names from database
    loadStudentData(); // Load any existing student results
});

function populateDropdown(elementId, count, prefix) {
    const dropdown = document.getElementById(elementId);
    for (let i = 1; i <= count; i++) {
        const option = document.createElement('option');
        option.value = prefix + i;
        option.textContent = prefix + i;
        dropdown.appendChild(option);
    }
}

function populateStudentNamesDropdown() {
    const studentNamesData = JSON.parse(localStorage.getItem('studentNames'));
    const nameDropdown = document.getElementById('name');

    if (studentNamesData) {
        for (const className in studentNamesData) {
            for (const studentName of studentNamesData[className]) {
                const option = document.createElement('option');
                option.value = studentName;
                option.textContent = studentName;
                nameDropdown.appendChild(option);
            }
        }
    }
}

document.getElementById('department').addEventListener('change', function() {
    const department = this.value;
    const subjectScoresDiv = document.getElementById('subjectScores');
    subjectScoresDiv.innerHTML = '';

    let subjectNames = [];
    if (department === 'Science') {
        subjectNames = ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Further Mathematics", "Technical Drawing", "Geography"];
    } else if (department === 'Arts') {
        subjectNames = ["Mathematics", "English Language", "Literature in English", "Government", "History", "Fine Arts", "Music", "French"];
    } else if (department === 'Commercial') {
        subjectNames = ["Mathematics", "English Language", "Financial Accounting", "Commerce", "Economics", "Office Practice", "Insurance", "Book Keeping"];
    } else if (department === 'Gold' || department === 'Diamond') {
        subjectNames = ["Mathematics", "English Language", "Basic Science", "Basic Technology", "Social Studies", "Civic Education", "Computer Studies", "Physical and Health Education", "Agric Science", "Home Economics"];
    }

    for (let subjectName of subjectNames) {
        const subjectGroup = document.createElement('div');
        subjectGroup.className = 'subject-group';
        subjectGroup.innerHTML = `
            <label>${subjectName}:</label>
            <input type="number" class="ca-score" placeholder="C.A Score" min="0" max="40">
            <input type="number" class="exam-score" placeholder="Exam Score" min="0" max="60">
        `;
        subjectScoresDiv.appendChild(subjectGroup);
    }
});

document.getElementById('calculate').addEventListener('click', function() {
    const studentData = getStudentData();

    if (!validateInputs(studentData)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const password = generatePassword();
    saveStudentData(studentData, password);

    const reportCard = generateReportCard(studentData, password);
    document.getElementById('reportCard').innerHTML = reportCard;
    document.getElementById('results').style.display = 'block';

    document.getElementById('passwordDisplay').innerText = `Unique Password: ${password}`;
});

function validateInputs(studentData) {
    if (!studentData.className || !studentData.name || !studentData.department || !studentData.attendance || !studentData.performanceComment) {
        return false;
    }

    for (let score of studentData.subjectScores) {
        if (isNaN(score.ca) || isNaN(score.exam) || score.ca < 0 || score.ca > 40 || score.exam < 0 || score.exam > 60) {
            return false;
        }
    }

    return true;
}

function getStudentData() {
    const caScores = Array.from(document.querySelectorAll('.ca-score')).map(input => Number(input.value));
    const examScores = Array.from(document.querySelectorAll('.exam-score')).map(input => Number(input.value));
    const subjectNames = Array.from(document.querySelectorAll('.subject-group label')).map(label => label.textContent);

    const subjectScores = [];
    for (let i = 0; i < subjectNames.length; i++) {
        subjectScores.push({
            name: subjectNames[i],
            ca: caScores[i],
            exam: examScores[i]
        });
    }

    return {
        className: document.getElementById('class').value,
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        imagePath: document.getElementById('image').value,
        attendance: document.getElementById('attendance').value,
        performanceComment: document.getElementById('comment').value,
        subjectScores: subjectScores,
        totalScore: calculateTotalScore(caScores, examScores),
        averageScore: calculateAverageScore(caScores, examScores)
    };
}

function calculateTotalScore(caScores, examScores) {
    let totalScore = 0;
    for (let i = 0; i < caScores.length; i++) {
        totalScore += caScores[i] + examScores[i];
    }
    return totalScore;
}

function calculateAverageScore(caScores, examScores) {
    if (caScores.length === 0) return 0;
    return calculateTotalScore(caScores, examScores) / caScores.length;
}

function generateReportCard(student, password) {
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

function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

function saveStudentData(studentData, password) {
    let savedData = JSON.parse(localStorage.getItem('studentResults')) || [];
    studentData.password = password;
    savedData.push(studentData);
    localStorage.setItem('studentResults', JSON.stringify(savedData));
}

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

document.getElementById('printReport').addEventListener('click', function() {
    window.print();
});