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
              <div>
                <label for="avatar">Avatar</label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                />
              </div>
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
                  type="text"
                  id="password"
              />
            </div>

            <div class="form">
              <label for="password">Confirm Password</label>
              <input
                  type="text"
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
import axios from "axios";

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
      avatarInput: null,
      avatarPreview: null,
    };
  },
  methods: {
    onNewAvatarLoaded(event) {
      event.preventDefault();
      const file = event.target.files[0];
      if (file && file.type.match('image.*')) {
        this.avatarPreview.src = URL.createObjectURL(file);
        console.log("hello: ", this.avatarPreview.src);
        this.avatarPreview.onload = () => {
          URL.revokeObjectURL(this.avatarPreview.src);
        }
      }
    },
    selectDOMInputs() {
      this.firstName = document.querySelector("#firstName");
      this.lastName = document.querySelector("#lastName");
      this.email = document.querySelector("#email");
      this.password = document.querySelector("#password");
      this.confirmPassword = document.querySelector("#confirm-password");
      this.avatarInput = document.querySelector("#avatar");
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
        response = await axios.get(
            `http://localhost:8000/api/user/${this.userId}/`,
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
        if (this.password.value !== "")
          updatedData["password"] = this.password.value;
        if (this.avatarPreview.src !== this.user.avatar)
          updatedData["avatar"] = this.avatarPreview.src;
        if (Object.keys(updatedData).length > 0) {
          console.log(updatedData);
          await this.patchUser(updatedData);
        } else
          this.renderSubmitStatus("No field changed", "red");
      }
    },
    async updateInputsValues() {
      await this.fetchUser();
      this.firstName.value = this.user.first_name;
      this.lastName.value = this.user.last_name;
      this.email.value = this.user.email;
      this.avatarPreview.src = this.user.avatar;
      this.avatarInput.value = "";
    },
    async patchUser(userData) {
      let response = null;
      try {
        response = await axios.patch(
            `http://localhost:8000/api/user/${this.userId}/`,
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

    this.avatarInput.addEventListener("change", this.onNewAvatarLoaded);
  },
};
</script>


<style scoped>
.content {
  color: white;
  margin-top: 80px;
  margin-left: 400px;
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
  max-width: 600px; /* Limit the width of the form */
  margin: 0 auto; /* Center the form */
  padding: 20px; /* Padding around the form */
  background-color: #f9f9f9; /* Light background color */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.form {
  margin-bottom: 20px; /* Space between form elements */
}

label {
  display: block; /* Ensure labels are block elements */
  font-weight: bold; /* Bold font for labels */
  margin-bottom: 5px; /* Space below the label */
  color: #34495e; /* Darker text color */
}

input[type="text"], input[type="file"] {
  width: 100%; /* Full width input */
  padding: 10px; /* Padding inside the input */
  border: 1px solid #ccc; /* Light border */
  border-radius: 5px; /* Rounded corners */
  box-sizing: border-box; /* Include padding in total width */
  font-size: 16px; /* Font size */
  transition: border-color 0.3s ease; /* Transition for border color */
}

/* Focus effect for inputs */
input[type="text"]:focus, input[type="file"]:focus {
  border-color: #3498db; /* Change border color on focus */
  outline: none; /* Remove outline */
}

/* Button styling */
#submit-button {
  background-color: #3498db; /* Primary button color */
  color: white; /* White text */
  padding: 10px; /* Padding inside button */
  border: none; /* Remove default border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor */
  font-size: 16px; /* Font size */
  transition: background-color 0.3s ease; /* Transition for hover effect */
}

/* Button hover effect */
#submit-button:hover {
  background-color: #2980b9; /* Darker shade on hover */
}

/* Image preview styling */
#preview {
  margin-bottom: 10px; /* Space below the image */
  border: 1px solid #ddd; /* Light border around the preview */
  border-radius: 5px; /* Rounded corners */
  width: 100%; /* Make sure the image fits */
  max-width: 200px; /* Limit the width */
}

/* Submit status message styling */
#submit-status {
  margin-top: 10px; /* Space above the status message */
  font-weight: bold; /* Bold text */
  color: #27ae60; /* Green color for success messages */
}

</style>
