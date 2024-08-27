<template>
  <div class="chat-wrapper">
    <button @click="toggleChat" class="toggle-button">
      <span v-if="isChatOpen">▼</span>
      <span v-else>▲</span>
    </button>
    <div v-if="isChatOpen" class="chat">
      <div class="messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." maxlength="100"/>
    </div>
  </div>
</template>

<script>
  import socket from "../socket";

  export default {
    data() {
      return {
        messages: [],
        newMessage: "",
        isChatOpen: false,
      };
    },
    created() {
      socket.on("message", (message) => {
        this.messages.push(message);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
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
          const messagesContainer = this.$refs.messagesContainer;
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        });
      },
      toggleChat() {
        this.isChatOpen = !this.isChatOpen;
        this.$nextTick(() => {
          if (this.isChatOpen) {
            this.scrollToBottom();
          }
        });
      },
    },
  };
</script>

<style>
  .chat-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
  }

  .toggle-button {
    width: 100%;
    background-color: #333;
    color: var(--primary-color);
    border: none;
    cursor: pointer;
    text-align: center;
    font-size: 16px;
    box-sizing: border-box;
    margin: 0;
    height: 30px;
  }

  .chat {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    background-color: #333;
    overflow: hidden;
    color: white;
    border: 1px solid #333;
    transition: height 0.3s ease;
    box-sizing: border-box;
  }

  .messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #444;
    word-wrap: break-word;
  }

  .message {
    padding: 8px;
    margin-bottom: 4px;
    border-radius: 5px;
    background-color: #555;
    color: rgb(255, 255, 255);
    font-size: 17px;
    overflow-wrap: break-word;
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
