<template>
  <div>
    <NavBar/>
    <div class="content">
      <div class="settings">
        <h2>{{ $t('account-settings') }}</h2>
        <div class="account-settings">
          <form @submit.prevent="onFormSubmitted">

            <div class="form">
              <div>
                <img id="preview" src="" alt="Preview" width="200">
              </div>
<!--              <div>-->
<!--                <label for="avatar">Avatar</label>-->
<!--                <input-->
<!--                    type="file"-->
<!--                    id="avatar"-->
<!--                    accept="image/*"-->
<!--                />-->
<!--              </div>-->
            </div>

            <div class="form">
              <label for="firstName">First Name</label>
              <input
                  type="text"
                  id="firstName"
              />
            </div>

            <div class="form">
              <label for="lastName">Last Name</label>
              <input
                  type="text"
                  id="lastName"
              />
            </div>

            <div class="form">

              <label for="email">Email</label>
              <input
                  type="text"
                  id="email"
              />
            </div>

            <div class="form">
              <label for="password">Password</label>
              <input
                  type="password"
                  id="password"
              />
            </div>

            <div class="form">
              <label for="password">Confirm Password</label>
              <input
                  type="password"
                  id="confirm-password"
              />
            </div>

            <div class="form">
              <button id="submit-button" type="submit">Save Modifications</button>
            </div>

            <div class="form">
              <p id="submit-status"></p>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import NavBar from '../components/NavBar.vue';
import {useAuthStore} from "@/store/auth";
import {computed} from "vue";
import apiClient from "@/services/apiService";

export default {
  name: 'UserSettings',
  components: {
    NavBar,
  },
  data() {
    return {
      user: null,
      userId: null,
      accessToken: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
      // avatarInput: null,
      avatarPreview: null,
    };
  },
  methods: {
    // onNewAvatarLoaded(event) {
    //   event.preventDefault();
    //   const file = event.target.files[0];
    //   if (file && file.type.match('image.*')) {
    //     this.avatarPreview.src = URL.createObjectURL(file);
    //     this.avatarPreview.onload = () => {
    //       URL.revokeObjectURL(this.avatarPreview.src);
    //     }
    //   }
    // },
    selectDOMInputs() {
      this.firstName = document.querySelector("#firstName");
      this.lastName = document.querySelector("#lastName");
      this.email = document.querySelector("#email");
      this.password = document.querySelector("#password");
      this.confirmPassword = document.querySelector("#confirm-password");
      // this.avatarInput = document.querySelector("#avatar");
      this.avatarPreview = document.querySelector("#preview");
    },
    fetchAuthStore() {
      const authStore = useAuthStore();
      const user = computed(() => authStore.user || {username: 'default', id: ''});
      this.userId = user.value.id;
      this.accessToken = authStore.accessToken;
    },
    async fetchUser() {
      let response = null;
      try {
        response = await apiClient.get(
            `/api/user/${this.userId}/`,
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );
        this.user = response.data;
      } catch (e) {
        console.error(e);
      }
    },
    renderSubmitStatus(text, color) {
      const statusText = document.querySelector("#submit-status");
      statusText.style.color = color;
      statusText.textContent = text;
    },
    async onFormSubmitted() {
      if (!this.isFormValid()) {
        this.renderSubmitStatus("Invalid fields", "red");
        await this.updateInputsValues();
      } else {
        const updatedData = {};
        if (this.firstName.value !== this.user.first_name)
          updatedData["first_name"] = this.firstName.value;
        if (this.lastName.value !== this.user.last_name)
          updatedData["last_name"] = this.lastName.value;
        if (this.email.value !== this.user.email)
          updatedData["email"] = this.email.value;
        // if (this.avatarPreview.src !== this.user.avatar)
        //   updatedData["avatar"] = this.avatarPreview.src;
        if (Object.keys(updatedData).length > 0) {
          await this.patchUser(updatedData);
        } else {
          if (this.password.value === "")
            this.renderSubmitStatus("No field changed", "red");
        }
        if (this.password.value !== "")
          await this.patchPassword(this.password.value);
      }
    },
    async updateInputsValues() {
      await this.fetchUser();
      this.firstName.value = this.user.first_name;
      this.lastName.value = this.user.last_name;
      this.email.value = this.user.email;
      this.avatarPreview.src = this.user.avatar;
      // this.avatarInput.value = "";
      this.password.value = "";
      this.confirmPassword.value = "";
    },
    async patchPassword(newPassword) {
      let response = null;
      try {
        response = await apiClient.patch(
            `/api/v1/update_password/${this.userId}/${newPassword}/`,
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );
        if (parseInt(response.status, 10) === 201)
          this.renderSubmitStatus("Updated account", "green");
      } catch (e) {
        console.error(e);
      }
      await this.updateInputsValues();
    },
    async patchUser(userData) {
      let response = null;
      try {
        response = await apiClient.patch(
            `/api/user/${this.userId}/`,
            userData,
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );
        if (parseInt(response.status, 10) === 200)
          this.renderSubmitStatus("Updated account", "green");
      } catch (e) {
        console.error(Object.values(e.response.data)[0]);
        this.renderSubmitStatus(Object.values(e.response.data)[0], "red");
      }
      await this.updateInputsValues();
    },
    isFormValid() {
      const emailRe = /^\S+@\S+\.\S+$/;
      const passwordRe = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

      const fields = {};
      fields["isFistNameValid"] = String(this.firstName.value).trim() !== "";
      fields["isLastNameValid"] = String(this.lastName.value).trim() !== "";
      fields["isEmailValid"] = emailRe.test(this.email.value);
      fields["isPasswordValid"] = this.password.value.length === 0 || passwordRe.test(this.password.value);
      fields["isConfirmPasswordValid"] = this.confirmPassword.value === this.password.value;

      return Object.values(fields).every(value => value === true);
    },
  },
  async mounted() {
    this.fetchAuthStore();
    await this.fetchUser();
    this.selectDOMInputs();
    await this.updateInputsValues();

    // this.avatarInput.addEventListener("change", this.onNewAvatarLoaded);
  },
};
</script>


<style scoped>
.content {
  color: white;
  margin-top: 80px;
  margin-left: 350px;
  font-family: '8bit', sans-serif;
}

#submit-button {
  font-family: '8bit', sans-serif;
  font-size: 20px;
}

#submit-status {
  font-family: '8bit', sans-serif;
  font-size: 20px;
  color: white;
}

.settings {
  padding: 20px;
  font-size: 40px;
  margin-bottom: 0;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.account-settings {
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

label {
  color: white;
  font-size: 20px;
  margin-top: 10px;

}

input {
  background-color: white;
  color: black;
  font-size: 20px;
  margin-top: 5px;
}

form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #181818;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #cecece;
}

input[type="text"], input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus, input[type="file"]:focus {
  border-color: #3498db;
  outline: none;
}

#submit-button {
  background-color: #707070;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

#submit-button:hover {
  background-color: #616161;
}

#preview {
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  max-width: 200px;
}

#submit-status {
  margin-top: 10px;
  font-weight: bold;
  color: #27ae60;
}

</style>
