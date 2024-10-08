<template>
  <div>
    <NavBar/>
    <div class="content">
      <div class="settings">

        <h2>{{ $t('color-theme') }}</h2>
        <div class="color-options">
          <button v-for="color in themeColors" :key="color" :style="buttonStyle(color, selectedColor)" class="color-button" @click="changeColor(color)">
            <span class="visually-hidden">{{ color }}</span>
          </button>
        </div>

        <h2>{{ $t('map-background') }}</h2>
        <div class="color-options">
          <button v-for="color in mapBackgroundColors" :key="color" :style="buttonStyle(color, selectedMapColor)" class="color-button" @click="changeMapColor(color)">
            <span class="visually-hidden">{{ color }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  name: 'UserSettings',
  components: {
    NavBar,
  },
  data() {
    return {
      themeColors: ['#FFFFFF', '#e71d36', '#FF5733', '#2ec4b6', '#9d4edd', '#49a078', '#fdca40'],
      mapBackgroundColors: ['#0a0a0a', '#3b3200', '#332000', '#1a331a', '#162b2b', '#261a33', '#3b0000'],
      selectedColor: localStorage.getItem('primaryColor') || '#FFFFFF',
      selectedMapColor: localStorage.getItem('mapBackground') || '#0a0a0a',
      powerUp: localStorage.getItem('PowerUp') === 'true',
    };
  },
  methods: {
    changeColor(color) {
      this.selectedColor = color;
      localStorage.setItem('primaryColor', color);
      this.updateCssVariables('--primary-color', color);
    },
    changeMapColor(color) {
      this.selectedMapColor = color;
      localStorage.setItem('mapBackground', color);
      this.updateCssVariables('--map-background', color);
    },
    updateCssVariables(variable, value) {
      document.documentElement.style.setProperty(variable, value);
    },
    buttonStyle(color, selectedColor) {
      return {
        backgroundColor: color,
        border: selectedColor === color ? '5px solid white' : 'none',
        borderRadius: '10px',
      };
    },
    togglePowerUp() {
      localStorage.setItem('PowerUp', this.powerUp);
    },
  },
  mounted() {
    this.updateCssVariables('--primary-color', this.selectedColor);
    this.updateCssVariables('--map-background', this.selectedMapColor);
  },
};
</script>

<style scoped>
.content {
  color: white;
  margin-top: 80px; /* <--- ne pas trop changer */
  margin-left: 400px;
  font-family: '8bit', sans-serif;
}

.settings {
  padding: 20px;
  font-size: 40px;
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
  box-shadow: 0 0 2px rgba(255, 255, 255);
  border: 3px solid white;
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

.powerup-section {
  margin-top: 40px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #49a078;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>