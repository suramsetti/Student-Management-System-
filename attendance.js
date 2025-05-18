let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

function renderAttendance() {
  const attendanceList = document.getElementById('attendanceList');
  attendanceList.innerHTML = '';

  const students = JSON.parse(localStorage.getItem('students')) || [];

  attendanceRecords.forEach((record, index) => {
    const student = students.find(s => s.roll === record.roll);
    const studentName = student ? student.name : 'Unknown';

    attendanceList.innerHTML += `
      <tr>
        <td>${record.roll}</td>
        <td>${studentName}</td>
        <td>${record.status}</td>
        <td><button onclick="deleteAttendance(${index})">Delete</button></td>
      </tr>
    `;
  });
}

document.getElementById('attendanceForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const roll = document.getElementById('roll').value.trim();
  const isPresent = document.getElementById('attendanceCheckbox').checked;
  const attendanceStatus = isPresent ? "Present" : "Absent";

  const students = JSON.parse(localStorage.getItem('students')) || [];
  const student = students.find(s => s.roll === roll);

  if (!student) {
    alert('Student not enrolled! Please enroll the student first.');
    return;
  }

  const existingIndex = attendanceRecords.findIndex(rec => rec.roll === roll);
  if (existingIndex !== -1) {
    attendanceRecords[existingIndex].status = attendanceStatus;
  } else {
    attendanceRecords.push({ roll, status: attendanceStatus });
  }

  localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  renderAttendance();
  this.reset();
});

function deleteAttendance(index) {
  attendanceRecords.splice(index, 1);
  localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  renderAttendance();
}

window.onload = renderAttendance;
