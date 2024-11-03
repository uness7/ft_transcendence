<template>
	<div class="auth-container">
		<div class="auth-card">
			<header class="auth-header">
				<h1 class="auth-title">{{ $t("sign_in") }}
					<router-link to="/register" class="auth-link">{{ $t('register') }}</router-link>
				</h1>
			</header>

			<form @submit.prevent="handleSubmit" class="auth-form" novalidate>
				<div v-if="hasErrors" role="alert" class="error-summary">
					<p class="error-summary__title">{{ $t('correct_errors') }}</p>
					<ul class="error-summary__list">
						<li v-if="emailError">{{ $t('invalid_email') }}</li>
						<li v-if="passwordError">{{ $t('password_required') }}</li>
					</ul>
				</div>

				<div class="form-group">
					<label for="email" class="form-label">{{ $t('email_label') }}</label>
					<div class="form-input-wrapper">
						<input id="email" type="email" v-model="email" required :aria-invalid="emailError"
							:aria-describedby="emailError ? 'email-error' : undefined" class="form-input"
							:class="{ 'form-input--error': emailError }" @blur="validateEmail" @input="validateEmail"
							autocomplete="email" />
						<span v-if="emailError" id="email-error" class="form-error" role="alert">
							{{ $t('valid_email_required') }}
						</span>
					</div>
				</div>

				<div class="form-group">
					<label for="password" class="form-label">{{ $t('password_label') }}</label>
					<div class="form-input-wrapper">
						<input id="password" type="password" v-model="password" required :aria-invalid="passwordError"
							:aria-describedby="passwordError ? 'password-error' : undefined" class="form-input"
							:class="{ 'form-input--error': passwordError }" @blur="validatePassword"
							@input="validatePassword" autocomplete="current-password" />
						<span v-if="passwordError" id="password-error" class="form-error" role="alert">
							{{ $t('password_required') }}
						</span>
					</div>
				</div>

				<div class="form-group">
					<button type="submit" class="btn btn--primary" :class="{ 'btn--disabled': !loginValid }"
						:disabled="!loginValid || isLoading">
						<span v-if="isLoading" class="loader" aria-hidden="true"></span>
						<span>{{ isLoading ? $t('signing_in') : $t('sign_in') }}</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { debounce } from 'lodash';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const emailError = ref(false);
const passwordError = ref(false);
const isLoading = ref(false);

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w+$/;

const validateEmail = debounce(() => {
	emailError.value = !EMAIL_REGEX.test(email.value.trim());
}, 300);

const validatePassword = debounce(() => {
	passwordError.value = !password.value.trim();
}, 300);

const emailValid = computed(() => EMAIL_REGEX.test(email.value.trim()));
const passwordValid = computed(() => password.value.trim().length > 0);
const loginValid = computed(() => emailValid.value && passwordValid.value);
const hasErrors = computed(() => emailError.value || passwordError.value);

async function handleSubmit() {
	if (!loginValid.value) return;
	isLoading.value = true;
	try {
		const formData = {
			email: email.value.trim(),
			password: password.value
		};

		const response = await authStore.login(formData);

		if (response === true) {
			await router.push("/two-factor-auth");
		} else {
			emailError.value = true;
			passwordError.value = true;
		}
	} catch (error) {
		console.error("Login error:", error);
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
	//color: var(--color-text);
	color: #1d4ed8;
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
