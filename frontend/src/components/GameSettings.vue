<script setup>
import {reactive, watch} from "vue";
import NavBar from "@/components/NavBar.vue";

let powerups = null;
if (!localStorage.getItem("pongConfig")) {
  powerups = reactive({
    playerSpeed: false,
    playerSize: false,
    playerImmortal: false,
    ballSpeed: false,
    aiSpeed: false,
  });
  localStorage.setItem("pongConfig", JSON.stringify(powerups));
} else {
  powerups = reactive(JSON.parse(localStorage.getItem("pongConfig")));
}

watch(powerups, newConf => {
  localStorage.setItem("pongConfig", JSON.stringify(newConf));
});

</script>

<template>
  <NavBar/>
  <div class="content">
    <div class="settings">
      <div class="powerup-section">
        <h3>{{ $t('power-up') }}</h3>

        <div>
          <label class="switch">
            <input type="checkbox" v-model="powerups.playerSpeed">
            <span class="slider"></span>
          </label>
          <label>{{ $t("toggle-player-speed") }}</label>
        </div>

        <div>
          <label class="switch">
            <input type="checkbox" v-model="powerups.playerSize">
            <span class="slider"></span>
          </label>
          <label>{{ $t("toggle-player-size") }}</label>
        </div>

        <div>
          <label class="switch">
            <input type="checkbox" v-model="powerups.playerImmortal">
            <span class="slider"></span>
          </label>
          <label>{{ $t("toggle-player-immortal") }}</label>
        </div>

        <div>
          <label class="switch">
            <input type="checkbox" v-model="powerups.ballSpeed">
            <span class="slider"></span>
          </label>
          <label>{{ $t("toggle-ball-speed") }}</label>
        </div>

        <div>
          <label class="switch">
            <input type="checkbox" v-model="powerups.aiSpeed">
            <span class="slider"></span>
          </label>
          <label>{{ $t("toggle-ai-speed") }}</label>
        </div>

      </div>
    </div>
  </div>
</template>

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

.powerup-section {
  margin-top: 40px;
}

.powerup-section div {
  margin-bottom: 20px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin-right: 20px;
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