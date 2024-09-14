<template>
    <div class="content">
        <div class="left-side">
            <router-link to="/local" class="left-up link">
                <div class="text-container">
                    <p class="title">1v1 local</p>
                    <p class="description">Local multiplayer mode for playing with friends on the same device.</p>
                </div>
            </router-link>
            <router-link to="/remote" class="left-bottom link">
                <div class="text-container">
                    <p class="title">1v1 remote</p>
                    <p class="description">Play with friends remotely over the internet.</p>
                </div>
            </router-link>
        </div>
        <div class="right-side">
            <router-link to="/tournament" class="link">
                <div class="text-container">
                    <p class="title">Tournament</p>
                    <p class="description">Compete in a structured tournament with multiple rounds and opponents.</p>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
    .content {
        display: flex;
        height: calc(100vh - 90px);
        color: white;
        background-color: var(--background-color);
        font-size: 50px;
        font-family: '8bit', sans-serif;
        margin-top: 82px;
        box-sizing: border-box;
    }

    .left-side {
        display: flex;
        flex-direction: column;
        width: 50%;
        border-right: 1px solid rgb(25,25,25);
    }

    .left-up, .left-bottom {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid rgb(25,25,25);
        position: relative;
        overflow: hidden;
        transition: background-color 0.3s ease;
    }

    .left-bottom {
        border-bottom: none;
        border-top: 1px solid rgb(25,25,25);
    }

    .right-side {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-left: 1px solid rgb(25,25,25);
    }

    .link {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        color: white;
        position: relative;
        overflow: hidden;
    }

    .link:hover {
        background-color: rgb(20, 20, 20);
        color: var(--primary-color);
    }

    .text-container {
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .title {
        transition: transform 0.3s ease;
    }

    .description {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        color: rgb(200, 200, 200);
        padding: 0 10px;
        margin-top: 10px;
        box-sizing: border-box;
    }

    .link:hover .title {
        transform: translateY(-10px);
    }

    .link:hover .description {
        max-height: 100px;
    }
</style>
