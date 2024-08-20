<template>
  <div class="content">
    <section class="about-team">
      <h1 class="heading">Our Team</h1>
      <div class="image-container">
        <div
          class="image"
          v-for="(member, index) in teamMembers"
          :key="index"
          @click="selectedMemberIndex = index"
        >
          <img :src="member.profileImage" alt="">
        </div>
      </div>
      <div class="info-container">
        <img class="profile" :src="teamMembers[selectedMemberIndex].profileImage" alt="Profile Picture">
        <div class="info">
          <h1 class="name">{{ teamMembers[selectedMemberIndex].name }}</h1>
          <h3 class="status">{{ $t(teamMembers[selectedMemberIndex].statusKey) }}</h3>
          <p class="about">{{ $t(teamMembers[selectedMemberIndex].detailsKey) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedMemberIndex: 0,
      teamMembers: [
        {
          name: "Ouissem Kazdar",
          statusKey: 'ouissem-status',
          profileImage: require("../assets/img/pp/okazdar.jpg"),
          detailsKey: 'ouissem-about'
        },
        {
          name: "Lionel Guyon",
          statusKey: 'lionel-status',
          profileImage: require("../assets/img/pp/liguyon.jpg"),
          detailsKey: 'lionel-about'
        },
        {
          name: "Jules Norget",
          statusKey: 'jules-status',
          profileImage: require("../assets/img/pp/jnorget.jpg"),
          detailsKey: 'jules-about'
        },
        {
          name: "Navid Sadat",
          statusKey: 'navid-status',
          profileImage: require("../assets/img/pp/ssadat.jpg"),
          detailsKey: 'navid-about'
        }
      ]
    };
  }
};
</script>

<style scoped>
  .content {
    color: var(--primary-color);
    background-color: var(--background-color);
    margin-top: 200px; /* <--- ne pas trop changer */
    font-family: '8bit',sans-serif;
  }

  .heading {
    text-align: center;
    font-size: 2rem;
    margin: 0;
    padding: 0;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image {
    width: 120px;
    height: 120px;
    background: var(--background-color);
    margin: 2px 50px;
    border-radius: 50%;
    border: 3px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: var(--primary-color);
  }

  .image:hover {
    border: 3px solid var(--primary-color)
  }

  img {
    width: 116px;
    height: 116px;
    border-radius: 50%;
  }

  .info-container {
    width: 1100px;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(15,15,15);
    margin: 0 auto;
    margin-top: 50px;
    border-top: 5px;
    box-shadow: 0px 0px 30px var(--primary-color);
    border-radius: 20px;
  }

  .profile {
    width: 250px;
    height: 325px;
    border-radius: 15px;
    padding: 10px;
    margin: 0;
  }

  .name {
    margin-top: 80px;
    padding: 0px 15px;
    text-align: left;
    font-size: 50px;
    line-height: 20px;
  }

  .status {
    padding: 0px 20px;
    text-align: left;
    line-height: 20px;
    margin: 0;
  }

  .about {
    height: 240px;
    padding: 0 20px;
  }
</style>

