<template>
    <div class="content">
      <div class="settings">
        <h2>Change Color</h2>
        <div class="color-options">
          <button 
            v-for="color in colors" 
            :key="color" 
            :style="{ backgroundColor: color }" 
            class="color-button" 
            @click="changeColor(color)"
          >
            <span class="visually-hidden">{{ color }}</span>
          </button>
        </div>
      </div>
    </div>
</template>
    
<script>
  export default {
    data() {
      return {
        colors: ['#FF5733', '#33FF57', '#3357FF'] // Exemple de couleurs
      };
    },
    methods: {
      changeColor(color) {
        localStorage.setItem('primaryColor', color);
        this.updateCssVariables(color);
      },
      updateCssVariables(color) {
        document.documentElement.style.setProperty('--primary-color', color);
      }
    },
    mounted() {
      const savedColor = localStorage.getItem('primaryColor') || '#FF5733'; // Couleur par défaut
      this.updateCssVariables(savedColor);
    }
  };
</script>
    
<style scoped>
  .content {
    color: white;
    margin-top: 80px; /* <--- ne pas trop changer */
    margin-left: 300px;
  }
  
  .settings {
    padding: 20px;
  }
  
  .color-options {
    display: flex;
    gap: 10px;
  }
  
  .color-button {
    width: 50px;
    height: 50px;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    position: relative;
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
  