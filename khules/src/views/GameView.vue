<template>
  <div class="content">
    <p>game page</p>
    <!-- Chat box -->
    <div class="chat-box">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type a message..."
        class="input"
      />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      socket: null,
      messages: [],
      newMessage: ''
    };
  },
  mounted() {
    // Connexion au WebSocket (ici on utilise un serveur public pour les tests)
    this.socket = new WebSocket('wss://echo.websocket.org');

    // Écouter les messages du serveur WebSocket
    this.socket.onmessage = (event) => {
      const message = event.data;
      this.messages.push(message);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '' && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(this.newMessage);
        this.messages.push(`You: ${this.newMessage}`);
        this.newMessage = ''; // Réinitialiser l'input
      }
    }
  },
  beforeUnmont() {
    // Fermer la connexion WebSocket avant de détruire le composant
    if (this.socket) {
      this.socket.close();
    }
  }
};
</script>

<style scoped>
.content {
  color: white;
  margin-top: 80px; /* <--- ne pas trop changer */
}

.chat-box {
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #333;
  border-radius: 5px;
  max-width: 300px;
  margin-top: 20px;
}

.messages {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding-right: 10px;
}

.message {
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
  background-color: #444;
}

.input {
  width: calc(100% - 50px);
  padding: 5px;
  border-radius: 3px;
  border: none;
}

.send-button {
  padding: 5px 10px;
  background-color: #00bfff;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0099cc;
}
</style>
