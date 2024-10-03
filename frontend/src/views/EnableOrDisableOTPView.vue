<template>
  <div class="otp-verification">
    <transition name="fade" mode="out-in">
      <div v-if="isFirstTime" key="qr-code-view" class="qr-code-container">
        <h2>Scan QR Code for 2FA Setup</h2>
        <p>To secure your account, please scan the QR code with your authentication app (Google Authenticator, etc.)</p>
        <img :src="`data:image/svg+xml;base64,${qrCode}`" alt="QR Code" v-if="qrCode" />
        <button @click="handleNext">Next</button>
      </div>

      <div v-else key="otp-input-view" class="otp-container">
        <h2>Enter OTP Code</h2>
        <p>Please enter the 6-digit code from your authentication app.</p>
        <input v-model="otpCode" type="text" maxlength="6" placeholder="Enter OTP" class="otp-input" />
        <button @click="verifyOTP">Verify</button>
      </div>
    </transition>
  </div>
</template>

<script>

import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import axios from "axios";

export default {
  name: 'QRCodeViewer',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const isLoggedIn = computed(() => authStore.isAuthenticated);
    const user = computed(() => authStore.user || { username: '', id: '' });
    const username = computed(() => user.value.username);
    const userId = computed(() => user.value.id);
    
    const isFirstTime = ref(); // Initially, we assume it is the first time
    const qrCode = ref(""); // Use ref to make this reactive
    const sharedKey = ref(""); // Reactive shared key
    const otpCode = ref(""); // To capture user OTP input


    const verifyOTP = async () => {
      console.log("otp code: ", otpCode);
      try {
        const response = await axios.post(`http://localhost:8000/api/v1/verify_otp_code/${userId.value}/`, {
          otp_code: otpCode.value,
        });
        console.log(response);
        if (response.request.status === 200)
        {
          router.push('/');
        } else {
          console.log("otp verification has failed!");
        }
      } catch (error) {
        throw new Error("Error occurred: ", error);
      }
    };

    const generateQRCode = async () => {
      if (isLoggedIn.value) {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/get_qr_code/${userId.value}/`);

          qrCode.value = response.data.qr_code;
          sharedKey.value = response.data.key;

          console.log("qr code : ", qrCode); // success
          console.log("shared secret: ", sharedKey); // success
          

          // save qr code in db
          try {
            const response = await axios.post(`http://localhost:8000/api/v1/save_qr_code/${userId.value}/`, {
              key: sharedKey.value,
            });
            console.log("save_qr_code res: ", response);
            if (response.request.status === 201) {
              console.log("the qr code was saved successfully!");
              isFirstTime.value = true;    
            }
            else {
              console.log("failure is here!");
              isFirstTime.value = false;
            }
          } catch (error) {
            throw new Error("Error occured", error);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("nope");
      }
    };

    const handleNext = () => {
      isFirstTime.value = false;
    };

    onMounted(() => {
      generateQRCode();
    });

    return {
      generateQRCode,
      isFirstTime,
      handleNext,
      verifyOTP,
      userId,
      username,
      qrCode,
      otpCode,
    }
  },
}
</script>


<style scoped>
.otp-verification {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.qr-code-container,
.otp-container {
  max-width: 400px;
  margin: auto;
}

.qr-code-container img {
  width: 200px;
  height: 200px;
  margin: 20px 0;
}

.otp-input {
  padding: 10px;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
  width: 100%;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>