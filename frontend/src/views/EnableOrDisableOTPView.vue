<template>
  <div class="otp-verification">
    <transition name="fade" mode="out-in">
      <div v-if="isFirstTime" key="qr-code-view" class="qr-code-container">
        <h2>Scan QR Code for 2FA Setup</h2>
        <p>To secure your account, please scan the QR code with your authentication app (Google Authenticator, etc.)</p>
        <img :src="`data:image/svg+xml;base64,${qrCode}`" alt="QR Code" v-if="qrCode" class="qr-code-img"/>
        <button @click="handleNext">Next</button>
      </div>

      <div v-else key="otp-input-view" class="otp-container">
        <h2>Enter OTP Code</h2>
        <p>Please enter the 6-digit code from your authentication app.</p>
        <input v-model="otpCode" type="text" maxlength="6" placeholder="Enter OTP" class="otp-input" />
        <button @click="verifyOTP">Verify</button>
        <button @click="displayQR">Display QR Code</button>
        <img :src="`data:image/svg+xml;base64,${qrCodeAgain}`" alt="QR Code" v-if="qrCodeAgain" class="qr-code-img" />
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
    
    const isFirstTime = ref();
    const qrCode = ref("");
    const sharedKey = ref("");
    const otpCode = ref("");
    const qrCodeAgain = ref("");

    const displayQR = () => {
      axios.get(`http://localhost:8000/api/v1/display_qr_code/${userId.value}/`)
        .then(response => {
          qrCodeAgain.value = response.data.qr_code;
        })
        .catch(e => {console.error(e)});
    }

    const verifyOTP = async () => {
      try {
        const response = await axios.post(`http://localhost:8000/api/v1/verify_otp_code/${userId.value}/`, {
          otp_code: otpCode.value,
        });
        if (response.request.status === 200)
        {
//          console.log("DEBUG: \n");
//          console.log("Response: \n"); console.log(response);
//          console.log("is_otp_verified: ", )
          router.push('/');
        } else {
          console.log("Verify otp has failed");
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

          // save qr code in db
          try {
            const response = await axios.post(`http://localhost:8000/api/v1/save_qr_code/${userId.value}/`, {
              key: sharedKey.value,
            });
            if (response.request.status === 201) {
              isFirstTime.value = true;    
            }
            else {
              isFirstTime.value = false;
            }
          } catch (error) {
            throw new Error("Error has occured", error);
          }
        } catch (error) {
          console.log("Error has occurred: ", error);
        }
      } else {
        router.push('/login');
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
      displayQR,
      qrCodeAgain
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

p, h2, img {
  color: white;
}

.qr-code-container,
.otp-container {
  max-width: 400px;
  margin: auto;
}

.qr-code-img {
  color: white;
  background-color: white;
}

.qr-code-container img {
  width: 200px;
  height: 200px;
  margin: 20px 0;
  color: white;
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
