<template>
  <div class="content">
      <div id="versus-screen">
        <div class="player player1">
          <img :src="player1.photo" alt="Player 1 Avatar" class="avatar" />
          <h2>{{ player1.name }}</h2>
        </div>
        <div class="versus">VS
          
        </div>
        <div class="player player2">
          <img :src="player2.photo" alt="Player 2 Avatar" class="avatar" />
          <h2>{{ player2.name }}</h2>
        </div>
      </div>
    <div class="loading">
      <span>Loading</span><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player1: {
        name: "Player One",
        photo: require("../assets/img/pp/ssadat.jpg"),
      },
      player2: {
        name: "Player Two",
        photo: require("../assets/img/pp/okazdar.jpg"),
      },
    };
  },
};
</script>

<style scoped>
@font-face {
        font-family: '8bit';
        src: url('../assets/font/8bit.ttf') format('truetype');
    }

.content {
  color: white;
  margin-top: 200px;   /* <--- ne pas trop changer */
  font-family: '8bit',sans-serif;
  display: flex;
  justify-content: center;
}
#versus-screen {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  text-align: center;
  position: relative;
  padding: 2rem;
  height: 50vh;
  /* background-color: #222; */
  color: white;
}

.player {
  flex: 1;
  padding: 1rem;
  border-radius: 10px;
  font-family: '8bit',sans-serif;
}

.player1 {
  background-color: black; /* Distinct background for player 1 */
  border: 1px solid #fff;
  font-family: '8bit',sans-serif;
  letter-spacing: 1px;
}
.player2 {
  background-color: black; /* Distinct background for player 2 */
  border: 1px solid #fff;
  letter-spacing: 1px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.versus {
  font-size: 4rem;
  font-weight: bold;
  padding: 1rem;
  background-color: #444;
  border-radius: 50%;
  border: 1px solid #fff;
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.loading{
  display: flex;
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  letter-spacing: 3px;
}

.loading .dot {
  animation: blink 1s infinite;
  font-size: 2rem;
  display: block;
  margin-left: 5px;
}


.loading .dot:nth-child(2) {
  animation-delay: 0.2s;
  margin-left: 5px;
}

.loading .dot:nth-child(3) {
  animation-delay: 0.4s;
}

.loading .dot:nth-child(4) {
  animation-delay: 0.6s;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
