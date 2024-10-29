<template>
  <div class="auth-container">
    <div class="auth-card">
      <header class="auth-header">
        <h1 class="auth-title">{{ $t("register-raw") }}</h1>
      </header>

      <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
        <div v-if="registerError" role="alert" class="error-summary">
          <p class="error-summary__title">Registration failed</p>
          <ul class="error-summary__list">
            <li v-for="(error, field) in registerErrorMessages" :key="field">
              {{ field }}: {{ error[0] }}
            </li>
          </ul>
        </div>

        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <div class="form-input-wrapper">
            <input
                id="username"
                type="text"
                v-model="username"
                required
                :aria-invalid="usernameError"
                :aria-describedby="usernameError ? 'username-error' : undefined"
                class="form-input"
                :class="{ 'form-input--error': usernameError }"
                @blur="validateUsername"
                @input="validateUsername"
            />
            <span v-if="usernameError" id="username-error" class="form-error" role="alert">
              {{ getUsernameErrorMessage() }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="firstname" class="form-label">First name</label>
          <div class="form-input-wrapper">
            <input
                id="firstname"
                type="text"
                v-model="firstname"
                required
                :aria-invalid="firstnameError"
                :aria-describedby="firstnameError ? 'firstname-error' : undefined"
                class="form-input"
                :class="{ 'form-input--error': firstnameError }"
                @blur="validateFirstname"
                @input="validateFirstname"
            />
            <span v-if="firstnameError" id="firstname-error" class="form-error" role="alert">
              {{ getFirstnameErrorMessage() }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="lastname" class="form-label">Last name</label>
          <div class="form-input-wrapper">
            <input
                id="lastname"
                type="text"
                v-model="lastname"
                required
                :aria-invalid="lastnameError"
                :aria-describedby="lastnameError ? 'lastname-error' : undefined"
                class="form-input"
                :class="{ 'form-input--error': lastnameError }"
                @blur="validateLastname"
                @input="validateLastname"
            />
            <span v-if="lastnameError" id="lastname-error" class="form-error" role="alert">
              {{ getLastnameErrorMessage() }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div class="form-input-wrapper">
            <input
                id="email"
                type="email"
                v-model="email"
                required
                :aria-invalid="emailError"
                :aria-describedby="emailError ? 'email-error' : undefined"
                class="form-input"
                :class="{ 'form-input--error': emailError }"
                @blur="validateEmail"
                @input="validateEmail"
                autocomplete="email"
            />
            <span v-if="emailError" id="email-error" class="form-error" role="alert">
              Please enter a valid email address.
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="form-input-wrapper">
            <input
                id="password"
                type="password"
                v-model="password"
                required
                :aria-invalid="passwordError"
                :aria-describedby="passwordError ? 'password-error' : undefined"
                class="form-input"
                :class="{ 'form-input--error': passwordError }"
                @blur="validatePassword"
                @input="validatePassword"
            />
            <span v-if="passwordError" id="password-error" class="form-error" role="alert">
              {{ getPasswordErrorMessage() }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <div class="form-input-wrapper">
            <input
                id="confirmPassword"
                type="password"
                v-model="confirmPassword"
                required
                :aria-invalid="confirmPasswordError"
                :aria-describedby="confirmPasswordError ? 'confirmPassword-error' : undefined"
                class="form-input"
                :class="{ 'form-input--error': confirmPasswordError }"
                @blur="validateConfirmPassword"
                @input="validateConfirmPassword"
            />
            <span v-if="confirmPasswordError" id="confirmPassword-error" class="form-error" role="alert">
              Passwords do not match.
            </span>
          </div>
        </div>

        <div class="form-group">
          <button
              type="submit"
              class="btn btn--primary"
              :class="{ 'btn--disabled': !registerValid || isLoading }"
              :disabled="!registerValid || isLoading"
          >
            <span v-if="isLoading" class="loader" aria-hidden="true"></span>
            <span>{{ isLoading ? 'Registering...' : $t('register-raw') }}</span>
          </button>
        </div>

        <div class="auth-links">
          <router-link to="/login" class="auth-link auth-link--small">
            Already have an account ?
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import axios from "axios";
import {debounce} from 'lodash';

const router = useRouter();

const username = ref('');
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const usernameError = ref(false);
const firstnameError = ref(false);
const lastnameError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const confirmPasswordError = ref(false);
const registerError = ref(false);
const registerErrorMessages = ref({});
const isLoading = ref(false);

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,15}$/;
const NAME_REGEX = /^[a-zA-Z-\s]{2,30}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/;

const validateUsername = debounce(() => {
  usernameError.value = !USERNAME_REGEX.test(username.value);
}, 300);

const getUsernameErrorMessage = () => {
  if (username.value.length < 3 || username.value.length > 15) {
    return "Username must be between 3 and 15 characters long.";
  } else if (!USERNAME_REGEX.test(username.value)) {
    return "Username must contain only letters, numbers, and underscores.";
  } else {
    return "";
  }
}

const validateFirstname = debounce(() => {
  firstnameError.value = !NAME_REGEX.test(firstname.value.trim());
}, 300);

const getFirstnameErrorMessage = () => {
  if (firstname.value.trim().length < 2 || firstname.value.trim().length > 30) {
    return "First name must be between 2 and 30 characters long.";
  } else if (!NAME_REGEX.test(firstname.value.trim())) {
    return "First name must contain only letters, hyphens, and whitespaces.";
  } else {
    return "";
  }
}

const validateLastname = debounce(() => {
  lastnameError.value = !NAME_REGEX.test(lastname.value.trim());
}, 300);

const getLastnameErrorMessage = () => {
  if (lastname.value.trim().length < 2 || lastname.value.trim().length > 30) {
    return "Last name must be between 2 and 30 characters long.";
  } else if (!NAME_REGEX.test(lastname.value.trim())) {
    return "Last name must contain only letters, hyphens, and whitespaces.";
  } else {
    return "";
  }
}

const validateEmail = debounce(() => {
  emailError.value = !EMAIL_REGEX.test(email.value.trim());
}, 300);

const validatePassword = debounce(() => {
  passwordError.value = !PWD_REGEX.test(password.value.trim());
}, 300);

const getPasswordErrorMessage = () => {
  if (password.value.length < 8 || password.value.length > 16) {
    return "Password be between 8 and 16 characters long.";
  } else if (!PWD_REGEX.test(password.value)) {
    return "Password must contain at least a special character.";
  } else {
    return "";
  }
}
const validateConfirmPassword = debounce(() => {
  confirmPasswordError.value = password.value !== confirmPassword.value;
}, 300);

const registerValid = computed(() =>
    USERNAME_REGEX.test(username.value) &&
    NAME_REGEX.test(firstname.value.trim()) &&
    NAME_REGEX.test(lastname.value.trim()) &&
    emailError.value === false &&
    passwordError.value === false &&
    confirmPasswordError.value === false
);

async function handleSubmit() {
  if (!registerValid.value) return;
  isLoading.value = true;
  try {
    const formData = {
      username: username.value,
      first_name: firstname.value.trim(),
      last_name: firstname.value.trim(),
      email: email.value.trim(),
      password: password.value,
    };

    const response = await axios.post(
        "http://localhost:8000/api/authentication/register/",
        formData,
    );
    await router.push("/login");
  } catch (e) {
    registerError.value = true;
    registerErrorMessages.value = e.response.data;
    password.value = "";
    confirmPassword.value = "";
    Object.values(e.response.data).forEach(value => {
          console.log(`${e.response.data[value]}`);
        }
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: linear-gradient(to bottom, var(--background-color));
}

.auth-card {
  width: 100%;
  max-width: 28rem;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  animation: slideIn 0.3s ease-out;
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-title {
  color: var(--color-text);
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.form-input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text);
  background-color: transparent;
  border: var(--border-width) solid var(--color-text-muted);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-dark);
}

.form-input--error {
  border-color: var(--color-error);
}

.form-error {
  display: block;
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn--disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-base);
}

.auth-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.auth-link--small {
  font-size: var(--font-size-sm);
}

.loader {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: var(--spacing-sm);
  border: 2px solid var(--color-text);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}

.error-summary {
  background-color: rgba(220, 38, 38, 0.1);
  border: var(--border-width) solid var(--color-error);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.error-summary__title {
  color: var(--color-error);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.error-summary__list {
  margin: 0;
  padding-left: var(--spacing-lg);
  color: var(--color-error);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>