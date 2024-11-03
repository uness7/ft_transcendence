<template>
  <div class="content">
    <section class="about-team">
      <h1 class="heading">{{ $t('team') }}</h1>
      <div class="image-container">
        <div class="img" v-for="(member, index) in teamMembers" :key="index" @click="selectedMemberIndex = index">
          <img :src="member.profileImage" :alt="member.name"/>
          <div class="info">
            <h2 class="name">{{ member.name }}</h2>
            <p>{{ $t(member.statusKey) }}</p>
          </div>
        </div>
      </div>
    </section>
    <div class="privacy-container">
      <router-link to="/privacy" class="privacy">{{ $t('read-privacy') }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedMemberIndex: 0,
      teamMembers: [
        {
          name: "Jules Norget",
          statusKey: 'jules-status',
          profileImage: require("../assets/img/pp/jnorget.jpg"),
        },
        {
          name: "Navid Sadat",
          statusKey: 'navid-status',
          profileImage: require("../assets/img/pp/ssadat.jpg"),
        },
        {
          name: "Lionel Guyon",
          statusKey: 'lionel-status',
          profileImage: require("../assets/img/pp/liguyon.jpg"),
        },
        {
          name: "Youness Zioual",
          statusKey: 'joker',
          profileImage: require("../assets/img/pp/yzioual.jpg"),
        },
        {
          name: "Ouissem Kazdar",
          statusKey: 'ouissem-status',
          profileImage: require("../assets/img/pp/okazdar.jpg"),
        }
      ]
    };
  }
};
</script>

<style scoped>
.content {
  color: white;
  background-color: var(--background-color);
  margin-top: 200px;
}

.heading {
  text-align: center;
  font-size: 3rem;
  margin: 0;
  padding: 0 1rem;
  font-family: '8bit', sans-serif;
}

.image-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 80px;
  padding: 100px;
}

.img {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 200px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 0 0 var(--primary-color);
}

.img:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 10px 5px var(--primary-color);
}

.img img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5%;
  filter: blur(3px);
}

.img img:hover{
  filter: blur(0);
}

.info {
  text-align: center;
  margin-top: 10px;
}

.name {
  font-size: 1.2rem;
  margin: 5px 0 2px 0;
  color: white;
}

p {
  font-size: 1rem;
  color: white;
  margin: 0;
}

.privacy-container {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.privacy {
  font-family: '8bit', sans-serif;
  font-size: 25px;
  color: rgb(200, 200, 200);
  background: var(--background-color);
  margin-left: auto;
  margin-right: auto;
  display: block;
  text-align: center;
}
</style>
