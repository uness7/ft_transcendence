<template>
	<div class="container">
		<div class="register-card">
			<header class="register-header">
				<h1 class="register-title">
					{{$t("register")}}
				</h1>
			</header>
			<form class="register-form" @submit.prevent="handleSubmit" novalidate>
				
				<!-- Space that displays errors	-->
				<div v-if="hasErrors" role="alert" class="error-summary">
					<p class="error-summary__title">Please correct the following errors:</p>
					<ul class="error-summary__list">
						<li v-if="emailError">Invalid email format</li>
						<li v-if="passwordError">Password is required</li>
					</ul>
				</div>
				
				<!-- form-group -->
				<div class="form-group">
					<label for="email" class="form-label">Email</label>/
				</div>
				<div>
					//
				</div>
				<div>
					//
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	import {ref, computed} from 'vue';
	import {useRouter} from 'vue-router';
	import {useAuthStore} from '@/store/auth';

    const router = useRouter();
    const authStore = useAuthStore();

    const username = ref('');
    const first_name = ref('');
    const last_name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const isLoading = ref(false);
	
	const   emailError = false;
	const   passwordError = false;
	const   usernameError = false;
	const   firstNameError = false;
	const   lastNameError = false;

    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    const validateEmail = () => {
      if (!emailRegex.test(email.value)) {
        errorMessage.value = "Please enter a valid email address.";
      } else {
        errorMessage.value = "";
      }
    };

    const validatePassword = () => {
      if (!passwordRegex.test(password.value)) {
        errorMessage.value = "Password must be at least 8 characters long and contain at least one number and one special character.";
      } else {
        errorMessage.value = "";
      }
    };

    const validateConfirmPassword = () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match.";
      } else {
        errorMessage.value = "";
      }
    };

    const handleSubmit = async () => {
      if (isFormValid.value) {
        isLoading.value = true;
        const data = {
          username: username.value,
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          password: password.value,
        };
        try {
          const success = await authStore.register(data);
          if (success) {
            await router.push('/login');
          } else {
            errorMessage.value = "Registration failed. Please try again.";
            alert(errorMessage.value);
          }
        } catch (error) {
          console.error("Registration error:", error);
          errorMessage.value = "An error occurred during registration.";
          alert(errorMessage.value);
        } finally {
          isLoading.value = false;
        }
      }
    };

    const isFormValid = computed(() =>
        username.value.trim() !== "" &&
        first_name.value.trim() !== "" &&
        last_name.value.trim() !== "" &&
        emailRegex.test(email.value) &&
        passwordRegex.test(password.value) &&
        password.value === confirmPassword.value
    );
</script>

<style scoped>

</style>
