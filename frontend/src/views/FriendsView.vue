<template>
    <div class="content">
        <div class="add-friend">
            <h1>Add a new friend</h1>
            <div class="input-container">
                <input type="text" v-model="newFriendName" placeholder="friend username" class="friend-input" />
                <button @click="addFriend" class="add-button">+</button>
            </div>
        </div>

        <div class="friends-list">
            <h2 class="fh2">Friend list :</h2>
            <div class="friends-container">
                <span v-for="friend in friends" :key="friend.id" class="friend-item">{{ friend.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newFriendName: '',
            friends: [  //friendlsit from backend
                { id: 1, name: 'jules' },
                { id: 2, name: 'youness' },
                { id: 3, name: 'ouissem' },
                { id: 4, name: 'lionel' },
                { id: 5, name: 'navid' }
            ]
        };
    },
    methods: {
        addFriend() {
            //this is jsut a test, use backend
            if (this.newFriendName) {
                this.friends.push({ id: this.friends.length + 1, name: this.newFriendName });
                this.newFriendName = '';
            }
        }
    }
};
</script>

<style scoped>
.content {
    color: white;
    background-color: var(--background-color);
    margin-top: 100px;
    font-family: '8bit', sans-serif;
}

.add-friend {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 50px;
}

.input-container {
    display: flex;
    align-items: center;
}

.friend-input {
    padding: 15px;
    width: 400px;
    background-color: rgb(20,20,20);
    color: white;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 18px;
}

.add-button {
    padding: 15px 30px;
    background-color: rgb(50, 150, 50);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
}

.friends-list {
    padding: 20px;
    font-size: 20px;
    margin-left: 30px;
    margin-top: 30px;
}

.fh2{
    color: var(--primary-color);
}

.friends-container {
    display: flex;
    flex-wrap: wrap;
}

.friend-item {
    margin-right: 15px;
    font-size: 30px;
}

h2{
    font-size: 50px;
}
</style>
