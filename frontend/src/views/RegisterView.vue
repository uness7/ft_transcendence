<template>
	<div class="content">
		<div class="registerBox">
			<div class="inner">
				<div class="register">
					<div class="top">
						<div class="title">{{ $t("create-account") }}</div>
					</div>
					<form @submit.prevent="handleSubmit">
						<div class="form">
							<input
								type="text"
								placeholder="username"
								v-model="username"
								class="w100"
								required
							/>
							<input
								type="text"
								placeholder="First Name"
								v-model="first_name"
								class="w100"
								required
							/>
							<input
								type="text"
								placeholder="Last Name"
								v-model="last_name"
								class="w100"
								required
							/>
							<input
								type="email"
								class="w100"
								placeholder="Email"
								v-model="email"
								required
								@blur="validateEmail"
							/>
							<input
								type="password"
								class="w100"
								placeholder="Password"
								v-model="password"
								required
								@blur="validatePassword"
							/>
							<input
								type="password"
								class="w100"
								placeholder="Confirm Password"
								v-model="confirmPassword"
								required
								@blur="validateConfirmPassword"
							/>
						</div>
						<button
							type="submit"
							class="action"
							:class="{ 'action-disabled': !isFormValid }"
							:disabled="!isFormValid"
						>
							{{ $t("create-account") }}
						</button>
					</form>
					<div class="error-message" v-if="errorMessage">
						{{ errorMessage }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>	

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const username = ref('');
    const first_name = ref('');
    const last_name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);

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
            router.push('/login');
          } else {
            errorMessage.value = "Registration failed. Please try again.";
          }
        } catch (error) {
          console.error("Registration error:", error);
          errorMessage.value = "An error occurred during registration.";
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

    return {
      username,
      first_name,
      last_name,
      email,
      password,
      confirmPassword,
      errorMessage,
      isLoading,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      handleSubmit,
      isFormValid
    };
  }
};
</script>

<style scoped>
.registerBox {
	background: var(--background-color);
	border-radius: 15px;
	max-width: 400px;
	padding: 25px 55px;
	animation: slideInTop 1s;
	box-shadow: 0px 0px 30px var(--primary-color);
}

.content {
	margin-top: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
}

.w100 {
	width: 100%;
}

input[type="text"],
input[type="email"],
input[type="password"] {
	border: 1px solid var(--primary-color);
	height: 40px;
	padding: 10px;
	margin-top: 20px;
	border-radius: 5px;
	box-sizing: border-box;
}

.action {
	height: 40px;
	text-transform: uppercase;
	border-radius: 25px;
	width: 100%;
	border: none;
	cursor: pointer;
	background: green;
	margin-top: 20px;
	color: #fff;
	font-size: 1.2rem;
	border: 1px solid var(--primary-color);
}

.action-disabled {
	color: #eee;
	background: var(--background-color);
	cursor: not-allowed;
}

.top {
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-bottom: 10px;
}

.title {
	width: 100%;
	font-size: 1.8rem;
	margin-bottom: 10px;
	text-align: center;
}

.error-message {
	color: red;
	margin-top: 10px;
	text-align: center;
}

@media screen and (max-width: 440px) {
	.registerBox {
		padding: 25px 25px;
		max-width: 100vw;
	}
}
</style>
