const SESSION_KEY = 'pathfinder-demo-authenticated';
const DEMO_EMAIL = 'demo@muhlenberg.edu';
const DEMO_PASSWORD = 'PathfinderDemo1!';
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');
const message = document.getElementById('form-message');

if (sessionStorage.getItem(SESSION_KEY) === 'true') {
  window.location.replace('index.html');
}

function setError(field, error) {
  document.getElementById(`${field.id}-error`).textContent = error;
  field.setAttribute('aria-invalid', String(Boolean(error)));
}
function showMessage(text) {
  message.textContent = text;
  message.hidden = false;
}

togglePassword.addEventListener('click', () => {
  const visible = password.type === 'password';
  password.type = visible ? 'text' : 'password';
  togglePassword.classList.toggle('is-visible', visible);
  togglePassword.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
  togglePassword.setAttribute('aria-pressed', String(visible));
});

email.addEventListener('input', () => setError(email, ''));
password.addEventListener('input', () => setError(password, ''));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.hidden = true;
  const address = email.value.trim().toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
  setError(email, !address ? 'Please enter the demo email.' : !validEmail ? 'Enter a valid email address.' : '');
  setError(password, password.value ? '' : 'Please enter the password.');
  if (!validEmail || !password.value) return;

  if (address !== DEMO_EMAIL) {
    setError(email, 'Use the demo account email shown above.');
    return;
  }
  if (password.value !== DEMO_PASSWORD) {
    setError(password, 'That demo password is incorrect.');
    return;
  }

  sessionStorage.setItem(SESSION_KEY, 'true');
  window.location.replace('index.html');
});

document.getElementById('forgot-password').addEventListener('click', () => {
  showMessage('Password reset is not available for the demo account.');
});
