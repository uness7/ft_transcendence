<template>
  <div class="two-factor-auth-container content">
    <h2>Two-Factor Authentication</h2>
    
    <form @submit.prevent="handleSubmit">
      <!-- Phone Number Input Section -->
      <div v-if="!isCodeSent" class="input-group">
        <label for="phone">Enter your Phone Number to receive the code</label>
        <input
          id="phone" 
          type="tel"
          v-model="phoneNumber"
          placeholder="07XXXXXXXX"
          required
          maxlength="10"
          autofocus
        />
        <button type="submit" class="verify-button submit-button">Submit</button>
      </div>

      <!-- Verification Code Input Section -->
      <div v-else>
        <p>Please enter the one-time code sent to your registered method.</p>
        <div class="input-group">
          <label for="otp">One-Time Code</label>
          <input 
            id="otp" 
            v-model="code" 
            type="text" 
            placeholder="Enter your code" 
            required 
            maxlength="6" 
          />
        </div>
        <button type="submit" class="verify-button">Verify</button>
      </div>

      <!-- Error and Success Messages -->
      <div v-if="error" class="error-message">{{ error }}</div>
      <p v-if="success" class="success-message">{{ success }}</p>
    </form>

    <!-- Resend Code Section -->
    <div class="resend-container" v-if="isCodeSent && !success">
      <p>Didn't receive the code? <button @click="resendCode">Resend Code</button></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      phoneNumber: '',
      code: '',
      error: '',
      success: '',
      token: this.$route.params.token, // Token passed from the previous page
      isCodeSent: false // Track whether the code has been sent
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.isCodeSent) {
        // Step 1: Submit phone number to receive the code
        try {
          const response = await axios.post('/api/send-code', {
            phoneNumber: this.phoneNumber
          });
          // Check if the response indicates success
          if (response.data && response.data.success) {
            //console.log("Code sent successfully!")
            this.isCodeSent = true; // Show the code input section
            this.success = "Code sent successfully! Please check your phone.";
            this.error = '';
          } else {
            this.error = "Failed to send code. Please try again.";
          }
        } catch (error) {
          this.error = "Failed to send code. Please try again.";
          this.success = '';
        }
      } else {
        // Step 2: Verify the code
        try {
          const response = await axios.post('/api/verify-2fa', {
            token: this.token,
            code: this.code
          });

          const { jwt } = response.data;

          // Store the JWT in local storage upon successful verification
          localStorage.setItem('jwt', jwt);
          this.success = "Verification successful! Redirecting...";
          this.error = '';

          // Redirect to HOME after a brief delay
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        } catch (error) {
          this.error = "Invalid code. Please try again.";
          this.success = '';
        }
      }
    },
    async resendCode() {
      try {
        await axios.post('/api/resend-2fa', { token: this.token });
        this.success = "Code resent successfully!";
        this.error = '';
      } catch (error) {
        this.error = "Failed to resend code. Please try again.";
        this.success = '';
      }
    }
  }
};
</script>

<!-- TESTTING VERSION  -->
<!-- <template>
  <div class="two-factor-auth-container content">
    <h2>Two-Factor Authentication</h2>
    
    <form @submit.prevent="handleSubmit">
      <div v-if="!isCodeSent" class="input-group">
        <label for="phone">Enter your Phone Number to receive the code</label>
        <input
          id="phone" 
          type="tel"
          v-model="phoneNumber"
          placeholder="07XXXXXXXX"
          required
          maxlength="10"
          autofocus
        />
        <button type="submit" class="verify-button submit-button">Submit</button>
      </div>

      <div v-else>
        <p>Please enter the one-time code sent to your registered method.</p>
        <div class="input-group">
          <label for="otp">One-Time Code</label>
          <input 
            id="otp" 
            v-model="code" 
            type="text" 
            placeholder="Enter your code" 
            required 
            maxlength="6" 
          />
        </div>
        <button type="submit" class="verify-button">Verify</button>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
      <p v-if="success" class="success-message">{{ success }}</p>
    </form>

    <div class="resend-container" v-if="isCodeSent && !success">
      <p>Didn't receive the code? <button @click="resendCode">Resend Code</button></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      phoneNumber: '',
      code: '',
      error: '',
      success: '',
      token: this.$route.params.token, // Token passed from the previous page
      isCodeSent: false // Track whether the code has been sent
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.isCodeSent) {
        // Skip API call for testing
        this.isCodeSent = true; // Show the code input section for testing
        this.success = "Code sent successfully! Please check your phone.";
        this.error = '';

        // Uncomment for real API call later
        // try {
        //   const response = await axios.post('/api/send-code', {
        //     phoneNumber: this.phoneNumber
        //   });

        //   if (response.data && response.data.success) {
        //     this.isCodeSent = true; // Show the code input section
        //     this.success = "Code sent successfully! Please check your phone.";
        //     this.error = '';
        //   } else {
        //     this.error = "Failed to send code. Please try again.";
        //   }
        // } catch (error) {
        //   this.error = "Failed to send code. Please try again.";
        //   this.success = '';
        // }
      } else {
        // Step 2: Verify the code
        try {
          const response = await axios.post('/api/verify-2fa', {
            token: this.token,
            code: this.code
          });

          const { jwt } = response.data;

          localStorage.setItem('jwt', jwt);
          this.success = "Verification successful! Redirecting...";
          this.error = '';

          setTimeout(() => {
            this.$router.push('/dashboard');
          }, 2000);
        } catch (error) {
          this.error = "Invalid code. Please try again.";
          this.success = '';
        }
      }
    },
    async resendCode() {
      try {
        await axios.post('/api/resend-2fa', { token: this.token });
        this.success = "Code resent successfully!";
        this.error = '';
      } catch (error) {
        this.error = "Failed to resend code. Please try again.";
        this.success = '';
      }
    }
  }
};
</script>

<style scoped>
/* Your existing styles here */
</style>
 -->

<style scoped>
@font-face {
        font-family: '8bit';
        src: url('../assets/font/8bit.ttf') format('truetype');
    }

.content {
  color: white;
  margin: 300px auto;
  font-family: '8bit',sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid #ccc;
}
.two-factor-auth-container {
  max-width: 500px;
  /* margin: auto; */
  padding: 20px;
  border-radius: 8px;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff; */
}

h2 {
  text-align: center;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

.submit-button{
  margin-bottom: 10px;
}

.verify-button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.verify-button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.resend-container {
  text-align: center;
  margin-top: 20px;
}

.resend-container button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
</style>

