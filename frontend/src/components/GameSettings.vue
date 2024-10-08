<template>
  <div>
    <NavBar/>
    <div class="content">
      <div class="settings">
        <h2>{{ $t('color-theme') }}</h2>
        <div class="color-options">
          <button v-for="color in colors" :key="color" :style="buttonStyle(color)" class="color-button"
                  @click="changeColor(color)">
            <span class="visually-hidden">{{ color }}</span>
          </button>
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
      colors: ['#FFFFFF', '#e71d36', '#FF5733', '#2ec4b6', '#9d4edd', '#49a078', '#fdca40'],
      selectedColor: localStorage.getItem('primaryColor') || '#FFFFFF',
    };
  },
  methods: {
    changeColor(color) {
      this.selectedColor = color;
      localStorage.setItem('primaryColor', color);
      this.updateCssVariables(color);
    },
    updateCssVariables(color) {
      document.documentElement.style.setProperty('--primary-color', color);
    },
    buttonStyle(color) {
      return {
        backgroundColor: color,
        border: this.selectedColor === color ? '5px solid white' : 'none',
        borderRadius: '10px',
      };
    },
  },
  async mounted() {
    this.updateCssVariables(this.selectedColor);
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

.color-options {
  display: flex;
  gap: 20px;
}

.color-button {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: transform 0.3s, border 0.3s;
}

.color-button:hover {
  transform: scale(1.1);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

</style>
