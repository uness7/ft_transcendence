<template>
    <div class="otp-setup">
      <h2>Set Up Two-Factor Authentication (2FA)</h2>
  
      <p>
        To enhance the security of your account, please choose one of the following methods to receive your verification codes:
      </p>
  
      <div class="option">
        <h3>1. SMS (Text Message)</h3>
        <p>Receive verification codes via SMS to your mobile phone.</p>
        <button>Choose SMS</button>
      </div>
  
      <div class="option">
        <h3>2. Email</h3>
        <p>Receive verification codes via email.</p>
        <button>Choose Email</button>
      </div>
  
      <div class="option">
        <h3>3. Authenticator App</h3>
        <p>Use an authenticator app (e.g., Google Authenticator, Authy) to generate verification codes.</p>
        <button
        @click="otpSetup()"
        >Choose Authenticator App</button>
      </div>
  
      <div class="note">
        <p><strong>Note:</strong> You can change your 2FA method later in your account settings.</p>
      </div>
  
      <RouterLink to="/">Go back home</RouterLink>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // No dynamic properties needed for now
      };
    },
    methods: {
      otpSetup() {
        // api call to backend api/v2/qr_code_setup/
        // we should send the user object to the backend
        // the backend will send back an svg image and the key
        console.log("helo");
      }
    },
  };
  </script>
  
  <style scoped>
  .otp-setup {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    background-color: #f9f9f9; /* Light background for contrast */
    border-radius: 8px; /* Slightly rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  }
  
  h2 {
    color: #333; /* Dark color for headers */
  }
  
  .option {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #ddd; /* Light border for options */
    border-radius: 5px; /* Slightly rounded corners */
    background-color: #ffffff; /* White background for options */
  }
  
  button {
    padding: 10px 15px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #007bff; /* Primary button color */
    color: white;
    border: none;
    border-radius: 5px; /* Slightly rounded corners */
    cursor: pointer;
    transition: background-color 0.3s; /* Smooth transition for hover */
  }
  
  button:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }
  
  .note {
    margin-top: 20px;
    font-size: 14px;
    color: #555; /* Softer color for notes */
  }
  
  .back-button {
    margin-top: 30px;
    background-color: #6c757d; /* Secondary button color */
  }
  
  .back-button:hover {
    background-color: #5a6268; /* Darker shade on hover */
  }
  </style>
  