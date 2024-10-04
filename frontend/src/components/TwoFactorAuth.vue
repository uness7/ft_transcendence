<template>
    <div>
      <h2>Two-Factor Authentication</h2>
      
      <div v-if="!isSetupComplete">
        <button @click="enableTwoFactorAuth">Enable Two-Factor Authentication</button>
      </div>
  
      <div v-if="isSetupComplete && !isVerified">
        <h3>Verify Your Token</h3>
        <input type="text" v-model="token" placeholder="Enter your 2FA token" />
        <button @click="verifyTwoFactorAuth">Verify</button>
      </div>
  
      <div v-if="isVerified">
        <h3>2FA is enabled and verified!</h3>
      </div>
  
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isSetupComplete: false,
        isVerified: false,
        token: '',
        error: null,
      };
    },
    methods: {
      async enableTwoFactorAuth() {
        try {
          const response = await this.axios.post('http://localhost:8000/account/two_factor/setup/');
          // Handle response (like showing a QR code or instructions)
          console.log('2FA setup initiated:', response.data);
          this.isSetupComplete = true;
        } catch (err) {
          this.error = 'Error enabling 2FA: ' + err.response.data.detail;
        }
      },
      async verifyTwoFactorAuth() {
        try {
          const response = await this.axios.post('/account/two_factor/verify/', { token: this.token });
          // Handle successful verification
          console.log('2FA verified:', response.data);
          this.isVerified = true;
        } catch (err) {
          this.error = 'Error verifying 2FA: ' + err.response.data.detail;
        }
      },
    },
  };
  </script>
  
  <style>
  .error {
    color: red;
  }
  </style>
  