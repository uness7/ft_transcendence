<template>
  <div class="top-bar">
    <header id="top-bar-content">
      <router-link to="/"><img src='./assets/img/logo1.png' id="main-image"/></router-link>
      <img :src="currentFlag" alt="flag" id="language-flag" @click="toggleLanguage">
      <router-link to="/about" id="about-button">{{ $t('about') }}</router-link>
      <router-link to="/login" id="login-button">{{ $t('login') }}</router-link>
    </header>
  </div>
  <router-view/>
</template>

<script>
export default {
  data() {
    return {
      languages: ['en', 'fr', 'es'],
      flags: {
        en: require('./assets/img/flags/english.png'),
        fr: require('./assets/img/flags/french.png'),
        es: require('./assets/img/flags/spanish.png')
      },
      currentLanguageIndex: 0
    }
  },
  computed: {
    currentFlag() {
      return this.flags[this.languages[this.currentLanguageIndex]];
    }
  },
  methods: {
    toggleLanguage() {
      this.currentLanguageIndex = (this.currentLanguageIndex + 1) % this.languages.length;
      this.$i18n.locale = this.languages[this.currentLanguageIndex];
    }
  }
}
</script>

<style scoped>

/*  ##### GLOBAL  ##### */

  @font-face {
      font-family: '8bit';
      src: url('./assets/font/8bit.ttf') format('truetype');
  }
  :global(body) {
    background-color: rgb(10, 10, 10);
  }

/*  ##### HEADER  ##### */  

  .top-bar {
    width: 100%;
    background-color: rgb(10, 10, 10);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(70, 70, 70);
  }

  #top-bar-content{
    margin-top: 20px;
    font-family: '8bit', sans-serif;
    color: white;
    margin-bottom: 20px;
  }

  #main-image {
    margin-left: 20px;
    width: 30%;
  }

  #language-flag {
    width: 3%;
    position: absolute;
    right: 350px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  #language-flag:hover {
    transform: scale(1.1);
  }

  #about-button {
    background-color: rgb(10, 10, 10);
    border: none;
    text-decoration: none;
    color: rgb(255, 255, 255);
    font-size: xx-large;
    position: absolute;
    right: 200px;
    font-family: '8bit', sans-serif;
    transition: all 0.2s ease;
  }

  #about-button:hover {
    transform: scale(1.05);
    color: rgb(255, 89, 0);
  }

  #login-button {
    margin-right: 10px;
    background-color: rgb(10, 10, 10);
    border: none;
    text-decoration: none;
    color: rgb(255, 255, 255);
    font-size: xx-large;
    position: absolute;
    right: 50px;
    font-family: '8bit', sans-serif;
    transition: all 0.2s ease;
  }

  #login-button:hover {
    transform: scale(1.05);
    color: rgb(255, 89, 0);
  }
</style>
