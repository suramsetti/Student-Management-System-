const form = document.getElementById('messageForm');
const container = document.getElementById('groupedMessages');

let messages = JSON.parse(localStorage.getItem('messages')) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (form.dataset.editingIndex) {
    // Editing a main message
    const idx = parseInt(form.dataset.editingIndex, 10);
    messages[idx].roll = document.getElementById('roll').value;
    messages[idx].role = document.getElementById('role').value;
    messages[idx].message = document.getElementById('message').value;
    messages[idx].time = new Date().toLocaleString();

    delete form.dataset.editingIndex;
  } else if (form.dataset.replyingTo !== undefined) {
    // Adding/editing reply to a message
    const parentIdx = parseInt(form.dataset.replyingTo, 10);
    const replyIdx = form.dataset.replyEditingIndex !== undefined ? parseInt(form.dataset.replyEditingIndex, 10) : -1;

    const reply = {
      roll: document.getElementById('roll').value,
      role: document.getElementById('role').value,
      message: document.getElementById('message').value,
      time: new Date().toLocaleString()
    };

    if (!messages[parentIdx].replies) {
      messages[parentIdx].replies = [];
    }

    if (replyIdx !== -1) {
      messages[parentIdx].replies[replyIdx] = reply;
      delete form.dataset.replyEditingIndex;
    } else {
      messages[parentIdx].replies.push(reply);
    }

    delete form.dataset.replyingTo;
  } else {
    // New main message
    const entry = {
      roll: document.getElementById('roll').value,
      role: document.getElementById('role').value,
      message: document.getElementById('message').value,
      time: new Date().toLocaleString(),
      replies: []
    };
    messages.push(entry);
  }

  localStorage.setItem('messages', JSON.stringify(messages));
  renderMessages();
  form.reset();
  resetFormState();
});

function renderMessages() {
  container.innerHTML = "";

  const grouped = {
    Student: [],
    Teacher: [],
    Parent: []
  };

  messages.forEach((msg, index) => {
    if (grouped[msg.role]) {
      grouped[msg.role].push({ ...msg, index });
    }
  });

  for (const role in grouped) {
    if (grouped[role].length > 0) {
      const section = document.createElement('div');
      section.className = 'message-group';
      section.innerHTML = `<h2>👤 ${role} Messages</h2>`;
      grouped[role].forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Message</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${msg.roll}</td>
                <td>${escapeHTML(msg.message)}</td>
                <td>${msg.time}</td>
                <td>
                  <button onclick="editMessage(${msg.index})">Edit</button>
                  <button onclick="deleteMessage(${msg.index})">Delete</button>
                  <button onclick="toggleReplyForm(${msg.index}, this)">Reply</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="replies" id="replies-${msg.index}">
            ${renderReplies(msg.replies || [], msg.index)}
          </div>
        `;
        section.appendChild(msgDiv);
      });
      container.appendChild(section);
    }
  }
}

function renderReplies(replies, parentIndex) {
  if (!replies || replies.length === 0) return '';

  return replies.map((reply, idx) => `
    <table style="margin-top: 10px; width: 95%;">
      <tbody>
        <tr>
          <td><strong>${escapeHTML(reply.role)}</strong> (${escapeHTML(reply.roll)})</td>
          <td>${escapeHTML(reply.message)}</td>
          <td>${reply.time}</td>
          <td>
            <button onclick="editReply(${parentIndex}, ${idx})">Edit</button>
            <button onclick="deleteReply(${parentIndex}, ${idx})">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  `).join('');
}

function deleteMessage(index) {
  if (confirm('Delete this message and all its replies?')) {
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessages();
    resetFormState();
  }
}

function editMessage(index) {
  const entry = messages[index];
  document.getElementById('roll').value = entry.roll;
  document.getElementById('role').value = entry.role;
  document.getElementById('message').value = entry.message;
  form.dataset.editingIndex = index;
  scrollToForm();
  resetReplyForm();
}

function deleteReply(parentIdx, replyIdx) {
  if (confirm('Delete this reply?')) {
    messages[parentIdx].replies.splice(replyIdx, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessages();
    resetFormState();
  }
}

function editReply(parentIdx, replyIdx) {
  const reply = messages[parentIdx].replies[replyIdx];
  document.getElementById('roll').value = reply.roll;
  document.getElementById('role').value = reply.role;
  document.getElementById('message').value = reply.message;
  form.dataset.replyingTo = parentIdx;
  form.dataset.replyEditingIndex = replyIdx;
  scrollToForm();
  resetReplyForm();
}

function toggleReplyForm(parentIdx, btn) {
  if (form.dataset.replyingTo == parentIdx) {
    // Close reply form
    resetFormState();
    btn.textContent = 'Reply';
  } else {
    form.dataset.replyingTo = parentIdx;
    form.removeAttribute('data-editing-index');
    delete form.dataset.replyEditingIndex;
    btn.textContent = 'Cancel Reply';

    // Prefill form for reply with empty fields
    form.reset();

    scrollToForm();
  }
}

function resetFormState() {
  delete form.dataset.replyingTo;
  delete form.dataset.editingIndex;
  delete form.dataset.replyEditingIndex;
  form.reset();
  updateReplyButtons();
}

function resetReplyForm() {
  // Change all Reply buttons text back to "Reply"
  updateReplyButtons();
}

function updateReplyButtons() {
  // Reset all Reply buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent === 'Cancel Reply') {
      btn.textContent = 'Reply';
    }
  });
}

function scrollToForm() {
  form.scrollIntoView({ behavior: 'smooth' });
}

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

renderMessages();
