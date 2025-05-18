let students = JSON.parse(localStorage.getItem('students')) || [];

function renderStudents() {
  const studentList = document.getElementById('studentList');
  studentList.innerHTML = '';

  students.forEach((student, index) => {
    studentList.innerHTML += `
      <tr>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.dept}</td>
        <td>${student.email}</td>
        <td>
          <button onclick="editStudent(${index})">Edit</button>
          <button onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const student = {
    name: document.getElementById('name').value.trim(),
    roll: document.getElementById('roll').value.trim(),
    dept: document.getElementById('dept').value.trim(),
    email: document.getElementById('email').value.trim(),
  };

  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();

  this.reset();
});

function deleteStudent(index) {
  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

function editStudent(index) {
  const student = students[index];
  document.getElementById('name').value = student.name;
  document.getElementById('roll').value = student.roll;
  document.getElementById('dept').value = student.dept;
  document.getElementById('email').value = student.email;

  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

window.onload = renderStudents;
