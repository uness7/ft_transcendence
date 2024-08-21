<template>
    <div class="content">
        <div class="cards-container">
            <div class="cards">
                <div class="card">
                    <img src="../assets/img/mods/ai1.png" alt="card1" class="ai-card" id="aiCard">
                    <div class="card-text ai-text" id="aiText">{{ $t('aiText') }}</div>
                </div>
                <div class="card">
                    <img src="../assets/img/mods/lan1.png" alt="card2" class="lan-card" id="lanCard">
                    <div class="card-text lan-text" id="lanText">{{ $t('lanText') }}</div>
                </div>
                <div class="card">
                    <img src="../assets/img/mods/multiplayer1.png" alt="card3" class="multi-card" id="multiCard">
                    <div class="card-text multi-text" id="multiText">{{ $t('multiText') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>

    .content {
        color: white;
        margin-top: 200px; /* <--- ne pas trop changer */
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .cards-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 50px;
    }

    .cards {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 100px;
    }

    .card {
        position: relative;
        display: inline-block;
        transition: transform 0.3s;
    }

    .card img {
        width: 300px;
        height: auto;
    }

    .card-text {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-family: '8bit';
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 18px;
    }

    .card:hover {
        transform: scale(1.2);
    }

    .ai-text {
        font-size: 50px;
        bottom: 60px;
    }

    .lan-text {
        font-size: 50px;
        bottom: 40px;
    }

    .multi-text {
    font-size: 45px;
    bottom: 100px;
    }

</style>