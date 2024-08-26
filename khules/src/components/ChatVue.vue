<template>
    <div class="chat">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message...">
    </div>
</template>
  
<script>
import socket from "../socket";

export default {
  data() {
    return {
      messages: [],
      newMessage: "",
    };
  },
  created() {
    socket.on("message", (message) => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        socket.emit("message", this.newMessage);
        this.newMessage = "";
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$el.querySelector(".messages");
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
    },
  },
};
</script>


  
<style>

  .chat {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 400px;
    display: flex;
    flex-direction: column;
    background-color: #333;
    overflow: hidden;
    color: white;
    border: var(--primary-color);
  }

  .messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #444;
  }

  .message {
    padding: 8px;
    margin-bottom: 4px;
    border-radius: 5px;
    background-color: #555;
    color: rgb(255, 255, 255);
    font-size: 17px;
  }

  input {
    padding: 8px;
    border: none;
    border-top: 1px solid var(--primary-color);
    width: 100%;
    box-sizing: border-box;
    background-color: #333;
    color: white;
  }

  input:focus {
    outline: none;
    border-top: 1px solid var(--primary-color);
  }

  input::placeholder {
    color: #ffffff;
  }
</style>
