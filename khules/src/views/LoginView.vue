<template>
    <div class="content">
        <p>login page</p>
        <p>test api : {{title}}</p>
    </div>
</template>

<script>

    import axios from 'axios';

    export default {
    data() {
        return {
        title: ''
        };
    },
    mounted() {
        this.fetchTitle();
    },
    methods: {
        fetchTitle() {
        axios.get('https://jsonplaceholder.typicode.com/posts/1')
            .then(response => {
            this.title = response.data.title;
            })
            .catch(error => {
            console.error('Erreur:', error);
            });
        }
    }
    };

</script>

<style scoped>

    .content {
        color: white;
        margin-top: 80px;   /* <--- ne pas trop changer */
    }

</style>