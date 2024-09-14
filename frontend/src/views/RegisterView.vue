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
								v-model="firstName"
								class="w100"
								required
							/>
							<input
								type="text"
								placeholder="Last Name"
								v-model="lastName"
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
export default {
	data() {
		return {
			username: "",
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			errorMessage: "",
			emailRegex: /^[\w.-]+@[\w.-]+\.\w+$/,
			passwordRegex:
				/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
			isLoading : false,
		};
	},

	methods: {
		handleRegistrationSuccess(responseData) {
			console.log('Registration was successful:', responseData);
		},
		validateEmail() {
			if (!this.emailRegex.test(this.email)) {
				this.errorMessage = "Please enter a valid email address.";
			} else {
				this.errorMessage = "";
			}
		},
		validatePassword() {
			if (!this.passwordRegex.test(this.password)) {
				this.errorMessage =
					"Password must be at least 8 characters long and contain at least one number and one special character.";
			} else {
				this.errorMessage = "";
			}
		},
		validateConfirmPassword() {
			if (this.password !== this.confirmPassword) {
				this.errorMessage = "Passwords do not match.";
			} else {
				this.errorMessage = "";
			}
		},
		handleSubmit()
		{
			if (this.isFormValid)
			{
				const	data = {
					username: this.username,
					firstName: this.firstName,
					lastName: this.lastName,
					email: this.email,
					password: this.password,
				};
				const	apiUrl = 'http://localhost:8000/api/authentication/register/';
				const	requestOptions = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				};

				this.isLoading = true;
				this.errorMessage = '';

				// Making API call : POST Request
				fetch (apiUrl, requestOptions)
					.then(res => {
						if (!res.ok)
						{
							throw new Error('Network response was not ok');
						}
						return res.json();
					})
					.then(data => {
						console.log("Registration was successfull");
						this.$emit('registration-success', data);
						this.$router.push('/login');
					})
					.catch(err => {
						console.error('Error:', err);
					})
					.finally (() => {
						this.isLoading = false;
					});
			}
		},
	},

	computed: {
		isFormValid() {
			return (
				this.username.trim() !== "" &&
				this.firstName.trim() !== "" &&
				this.lastName.trim() !== "" &&
				this.emailRegex.test(this.email) &&
				this.passwordRegex.test(this.password) &&
				this.password === this.confirmPassword
			);
		},
	},
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
