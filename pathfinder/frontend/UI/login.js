// PathFinder login: UI only. The backend team will connect authentication later.
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');
const message = document.getElementById('form-message');

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
  const address = email.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
  setError(email, !address ? 'Please enter your college email.' : !validEmail ? 'Enter a valid email address.' : '');
  setError(password, password.value ? '' : 'Please enter your password.');
  if (!validEmail || !password.value) return;

  // TODO: replace this message with a POST to your team's authentication API.
  // Redirect to index.html only after the server confirms successful login.
  // Never store passwords in localStorage or hardcode accepted credentials.
  showMessage('The login UI is ready. Your team still needs to connect the authentication backend.');
});

document.getElementById('google-login').addEventListener('click', () => {
  showMessage('Google sign-in will be available after your team configures Google authentication.');
});
document.getElementById('forgot-password').addEventListener('click', () => {
  showMessage('Password reset will be available after your team connects the account recovery service.');
});
