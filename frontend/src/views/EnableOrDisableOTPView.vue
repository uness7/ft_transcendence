<template>
  <div class="two-fa-settings">
    <h2>Two-Factor Authentication Settings</h2>

    <p class="status-message">
      Two-Factor Authentication is currently <strong>disabled</strong> for your account.
    </p>

    <p>
      In today’s digital landscape, securing your online accounts is more crucial than ever. With increasing reports of data breaches and account takeovers, relying solely on passwords for protection is no longer sufficient. This is where <strong>Two-Factor Authentication (2FA)</strong> comes into play.
    </p>

    <p>
      By enabling 2FA, you add an additional layer of security, making it significantly harder for unauthorized users to access your account. Protect your sensitive information and enjoy peace of mind with this vital security feature.
    </p>
    <RouterLink to="/two-factor-auth/setup">Enable two factor auth</RouterLink>
    <br>  
    <RouterLink to="/">Go back to Homepage</RouterLink>    
  </div>  
</template>


<script>
export default {
  data() {
    return {
      // All dynamic properties are removed for now
    };
  },
  created() {
    // Removed async calls for now
  },
  methods: {
  },
};
</script>


<style scoped>
.two-fa-settings {
  max-width: 400px;
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

.status-message {
  font-size: 18px;
  margin-bottom: 20px;
  color: #ff5722; /* Attention-grabbing color for status */
}

p {
  margin: 10px 0;
  line-height: 1.5; /* Improved readability */
  color: #555; /* Softer color for text */
}

button {
  padding: 10px 20px;
  margin: 10px 0;
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

.error-message {
  color: red;
  margin-top: 10px;
}

.hello-world {
  text-align: center;
  color: #007bff; /* Matching the button color */
  margin-top: 20px;
}
</style>