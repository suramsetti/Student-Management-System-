let grades = JSON.parse(localStorage.getItem('grades')) || [];

function calculateGrade(marks) {
  if (marks >= 90) return 'A+';
  else if (marks >= 80) return 'A';
  else if (marks >= 70) return 'B+';
  else if (marks >= 60) return 'B';
  else if (marks >= 50) return 'C';
  else if (marks >= 40) return 'D';
  else return 'F';
}

function renderGrades() {
  const gradeList = document.getElementById('gradeList');
  gradeList.innerHTML = '';

  grades.forEach((entry, index) => {
    gradeList.innerHTML += `
      <tr>
        <td>${entry.roll}</td>
        <td>${entry.marks}</td>
        <td>${entry.grade}</td>
        <td>
          <button onclick="editGrade(${index})">Edit</button>
          <button onclick="deleteGrade(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

document.getElementById('gradeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const roll = document.getElementById('roll').value.trim();
  const marks = parseInt(document.getElementById('marks').value);

  // Check if student is enrolled
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const isEnrolled = students.some(s => s.roll === roll);

  if (!isEnrolled) {
    alert('Student not enrolled! Please enroll the student first.');
    return; // stop form submission
  }

  if (marks < 0 || marks > 100 || isNaN(marks)) {
    alert('Please enter valid marks between 0 and 100');
    return;
  }

  const grade = calculateGrade(marks);

  // Check if roll already exists, update grade & marks if yes
  const existingIndex = grades.findIndex(g => g.roll === roll);
  if (existingIndex !== -1) {
    grades[existingIndex] = { roll, marks, grade };
  } else {
    grades.push({ roll, marks, grade });
  }

  localStorage.setItem('grades', JSON.stringify(grades));
  renderGrades();
  this.reset();
});

function deleteGrade(index) {
  grades.splice(index, 1);
  localStorage.setItem('grades', JSON.stringify(grades));
  renderGrades();
}

function editGrade(index) {
  const entry = grades[index];
  document.getElementById('roll').value = entry.roll;
  document.getElementById('marks').value = entry.marks;

  grades.splice(index, 1);
  localStorage.setItem('grades', JSON.stringify(grades));
  renderGrades();
}

window.onload = renderGrades;
