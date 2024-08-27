<template>
  <div class="content">
    <div class="loginBox">
      <div class="inner">
        <div class="signIn" v-if="signIn">
          <div class="top">
            <div class="title">Sign in</div>
            <div class="subtitle">
              Don't have an account?
              <span class="subtitle-action" @click="signIn = !signIn">
                Create Account
              </span>
            </div>
          </div>
          <form>
            <div class="form">
              <input required aria-required="true" aria-invalid="false" aria-label="E-mail" type="email" pattern="^[\w.-]+@[\w.-]+\.\w+$" class="w100" 
                :class="{ invalid: email.error }" ref="email" placeholder="Email" autofocus @blur="validateEmail" @keydown="validateEmail" v-model="email.value"
              />
              <input required aria-required="true" type="password" class="w100" :class="{ invalid: password.error }" placeholder="Password"
                v-model="password.value" @blur="validatePassword" @keydown="validatePassword"
              />
            </div>
            <input type="submit" value="Submit" class="action" :class="{ 'action-disabled': !loginValid }"/>
          </form>
        </div>

        <div class="register" v-else>
          <div class="top">
            <div class="title">Create an Account</div>
            <div class="subtitle">
              Already have an account?
              <span class="subtitle-action" @click="signIn = !signIn">
                Sign In
              </span>
            </div>
          </div>

          <div class="form">
            <input type="text" placeholder="UserName" autofocus v-model="firstName" class="w100"/>

            <input type="text" class="w100" placeholder="Email" v-model="email.value"/>

            <input type="password" class="w100" placeholder="Password" v-model="password.value"/>

            <p>upload your profile pix</p>
              <input id="file-input" type="file" accept="image/png, image/jpeg" @change="handleFileChange($event.target)" required/>
          </div>

          <button class="action" :class="{ 'action-disabled': !registerValid }">
            Create Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailRegex: /^[\w.-]+@[\w.-]+\.\w+$/,
      passwordRegex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,

      firstName: "",
      lastName: "",

      password: {
        value: "",
        error: false
      },

      email: {
        value: "",
        error: false
      },

      signIn: true
    };
  },

  methods: {
    validateEmail() {
      this.email.error = this.email.value === "";
    },

    validatePassword() {
      this.password.error = this.password.value === "";
    }
  },

  computed: {
    validFirstName() {
      return this.firstName.length > 0;
    },

    validLastName() {
      return this.lastName.length > 0;
    },

    emailValid() {
      return this.emailRegex.test(this.email.value);
    },

    passwordValid() {
      return this.password.value.length > 0;
    },

    loginValid() {
      return this.emailValid && this.passwordValid;
    },

    registerValid() {
      return (
        this.emailValid &&
        this.passwordValid &&
        this.validFirstName &&
        this.validLastName
      );
    }
  }
};
</script>

<style scoped>

.box-shadow {
  box-shadow: 0px 0px 30px var(--primary-color);
}

.border {
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0px 0px 30px var(--primary-color);
  
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

.invalid {
  border: 2px solid red !important;
}

.invalid::placeholder {
  color: red;
}

.errorMessage {
  color: red;
  margin: 10px;
  top: 5px;
}

.w100 {
  width: 100%;
}

.content {
  margin-top: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
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
  cursor: auto;
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

.subtitle .subtitle-action {
  color: var(--primary-color);
  font-weight: bold;
  cursor: pointer;
}

html {
  background-repeat: no-repeat;
  background: linear-gradient(
    to bottom,
    rgba(96, 108, 136, 1) 0%,
    rgba(63, 76, 107, 1) 100%
  );
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
}

.loginBox {
  background: var(--background-color);
  border-radius: 15px;
  max-width: 400px;
  padding: 25px 55px;
  animation: slideInTop 1s;
  box-shadow: 0px 0px 30px var(--primary-color);
}

@keyframes slideInTop {
  from {
    opacity: 0;
    transform: translateY(-30%);
  }

  to {
    opacity: 100;
    transform: translateY(0%);
  }
}

@media screen and (min-width: 440px) {
  .loginBox {
    box-shadow: 0px 0px 30px var(--primary-color);
  }
}

@media screen and (max-width: 440px) {
  html {
    background: var(--background-color);
    align-items: start;
    justify-content: start;
  }

  .loginBox {
    padding: 25px 25px;
    max-width: 100vw;
    box-shadow: 0px 0px 30px var(--primary-color);
  }
}
</style>
