<template>
    <div class="content">
        <div class="container" :class="{ 'right-panel-active': isRightPanelActive }">
        <!-- Sign-Up Container -->
        <div class="form-container sign-up-container">
            <form @submit.prevent="signUp">
            <h1>Create Account</h1>
            <div class="social-container">
                <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" v-model="signUpData.name" />
            <input type="email" placeholder="Email" v-model="signUpData.email" />
            <input type="password" placeholder="Password" v-model="signUpData.password" />
            <button type="submit">Sign Up</button>
            </form>
        </div>
    
        <!-- Sign-In Container -->
        <div class="form-container sign-in-container">
            <form @submit.prevent="signIn">
            <h1>Sign in</h1>
            <div class="social-container">
                <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" v-model="signInData.email" />
            <input type="password" placeholder="Password" v-model="signInData.password" />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
            </form>
        </div>
    
        <!-- Overlay Container -->
        <div class="overlay-container">
            <div class="overlay">
            <div class="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button class="ghost" @click="togglePanel">Sign In</button>
            </div>
            <div class="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start your journey with us</p>
                <button class="ghost" @click="togglePanel">Sign Up</button>
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
        isRightPanelActive: false,
        signUpData: {
          name: '',
          email: '',
          password: ''
        },
        signInData: {
          email: '',
          password: ''
        }
      };
    },
    methods: {
      togglePanel() {
        this.isRightPanelActive = !this.isRightPanelActive;
      },
      signUp() {
        // Handle sign-up logic
        console.log("Sign-up data:", this.signUpData);
      },
      signIn() {
        // Handle sign-in logic
        console.log("Sign-in data:", this.signInData);
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');
  
  * {
    box-sizing: border-box;
  }
  .content {
    color: var(--primary-color);
    background-color: var(--background-color);
    margin-top: 200px; /* <--- ne pas trop changer */
  }

  body {
    background: #e0e0e0; /* Light grey background */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Montserrat', sans-serif;
    height: 100vh;
    margin: -20px 0 50px;
  }
  
  h1 {
    font-weight: bold;
    margin: 0;
    color: #333333; /* Dark grey */
  }
  
  p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
    color: #555555; /* Medium grey */
  }
  
  span {
    font-size: 12px;
    color: #777777; /* Light grey */
  }
  
  a {
    color: #333333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
  }
  
  button {
    border-radius: 20px;
    border: 1px solid #444444; /* Dark grey border */
    background-color: #555555; /* Medium grey background */
    color: #FFFFFF;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
  }
  
  button:active {
    transform: scale(0.95);
  }
  
  button:focus {
    outline: none;
  }
  
  button.ghost {
    background-color: transparent;
    border-color: #ffffff;
  }
  
  form {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
  }
  
  input {
    background-color: #f0f0f0; /* Light grey */
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
  }
  
  .container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
  }
  
  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
  }
  
  .sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
  }
  
  .container.right-panel-active .sign-in-container {
    transform: translateX(100%);
  }
  
  .sign-up-container {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
  }
  
  .container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.6s;
  }
  
  @keyframes show {
    0%, 49.99% {
      opacity: 0;
      z-index: 1;
    }
    50%, 100% {
      opacity: 1;
      z-index: 5;
    }
  }
  
  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
  }
  
  .container.right-panel-active .overlay-container {
    transform: translateX(-100%);
  }
  
  .overlay {
    background: linear-gradient(to right, #666666, #999999); /* Grey gradient */
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #FFFFFF;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }
  
  .container.right-panel-active .overlay {
    transform: translateX(50%);
  }
  
  .overlay-panel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }
  
  .overlay-left {
    transform: translateX(-20%);
  }
  
  .container.right-panel-active .overlay-left {
    transform: translateX(0);
  }
  
  .overlay-right {
    right: 0;
    transform: translateX(0);
  }
  
  .container.right-panel-active .overlay-right {
    transform: translateX(20%);
  }
  
  .social-container {
    margin: 20px 0;
  }
  
  .social-container a {
    border: 1px solid #DDDDDD;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
  }
  
  footer {
    background-color: #333333; /* Dark grey */
    color: #fff;
    font-size: 14px;
    bottom: 0;
    position: fixed;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 999;
  }
  
  footer p {
    margin: 10px 0;
  }
  
  footer i {
    color: red;
  }
  
  footer a {
    color: #3c97bf;
    text-decoration: none;
  }
  </style>