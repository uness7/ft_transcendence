<template>
  <div class="content">
    <div class="loginBox">
      <div class="inner">
        <div class="signIn">
          <div class="top">
            <div class="title">{{ $t("sign-in") }}
              <router-link to="/register" class="rr">{{ $t('register') }}</router-link>
            </div>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="form">
              <input required aria-required="true" aria-invalid="false" aria-label="E-mail" type="email"
                pattern="^[\w.-]+@[\w.-]+\.\w+$" class="w100" :class="{ invalid: emailError }" placeholder="Email"
                autofocus @blur="validateEmail" @keydown="validateEmail" v-model="email" />
              <input required aria-required="true" type="password" class="w100" :class="{ invalid: passwordError }"
                placeholder="Password" v-model="password" @blur="validatePassword" @keydown="validatePassword" />
            </div>
            <input type="submit" :value="$t('sign-in')" class="action" :class="{ 'action-disabled': !loginValid }" />
          </form>
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

    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    const email = ref('');
    const password = ref('');
    const emailError = ref(false);
    const passwordError = ref(false);

    const validateEmail = () => {
      emailError.value = !emailRegex.test(email.value);
    };

    const validatePassword = () => {
      passwordError.value = password.value === '';
    };

    async function handleSubmit() {
      const formData = {
        email: email.value, password: password.value,
      };

      try {
        const response = await authStore.login(formData);
        if (response === true) {
          await router.push("/two-factor-auth");
          console.log("Login was successful!");
        } else {
          router.push("/login");
          console.log("Login failed!");
        }
      } catch (error) {
        throw new Error("Error: " + error);
      }
    }


    const emailValid = computed(() => emailRegex.test(email.value));
    const passwordValid = computed(() => password.value.length > 0);
    const loginValid = computed(() => emailValid.value && passwordValid.value);

    return {
      email,
      password,
      emailError,
      passwordError,
      validateEmail,
      validatePassword,
      handleSubmit,
      emailValid,
      passwordValid,
      loginValid
    };
  }
};
</script>

<style scoped>
/* CSS styles remain the same as in the original component */
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

html {
  background-repeat: no-repeat;
  background: linear-gradient(to bottom,
      rgba(96, 108, 136, 1) 0%,
      rgba(63, 76, 107, 1) 100%);
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

.rr {
  color: var(--primary-color);
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
