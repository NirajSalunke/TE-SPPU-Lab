let attempts = 5;
const validUser = 'admin';
const validPass = '1234';

function getUsername() {
  return document.getElementById('username').value.trim();
}

function getPassword() {
  return document.getElementById('password').value;
}

function login() {
  const user = getUsername();
  const pass = getPassword();

  if (user === '' || pass === '') {
    alert('Username and password required!');
    return;
  }
  if (user.length < 3) {
    alert('Username must be 3+ characters!');
    return;
  }
  if (pass.length < 4) {
    alert('Password must be 4+ characters!');
    return;
  }

  if (user === validUser && pass === validPass) {
    showStatus('Login Successful! Redirecting...', 'green');
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  } else {
    attempts--;
    document.getElementById('attempts').textContent = `Attempts left: ${attempts}`;
    
    if (attempts === 0) {
      showStatus('ACCOUNT LOCKED!', 'red');
      setTimeout(() => {
        window.location.href = 'lock.html';
      }, 1500);
    } else {
      alert(`Wrong credentials! ${attempts} attempts left.`);
    }
  }
}

function showStatus(message, color) {
  document.getElementById('status').innerHTML = 
    `<div style="color:${color}">${message}</div>`;
}

function promptLogin() {
  const name = prompt('Username?');
  if (!name || name === '' || name.length < 3) {
    alert('Valid username (3+ chars) required!');
    return;
  }

  const pass = prompt('Password?');
  if (!pass || pass.length < 4) {
    alert('Password 4+ chars required!');
    return;
  }

  document.getElementById('username').value = name;
  document.getElementById('password').value = pass;
  alert('Inputs set! Click Login.');
}

function resetForm() {
  if (confirm('Reset form?')) {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('status').textContent = '';
    attempts = 5;
    document.getElementById('attempts').textContent = 'Attempts left: 5';
  }
}
