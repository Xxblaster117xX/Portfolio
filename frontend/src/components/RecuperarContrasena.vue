<template>
  <div class="recuperar">
    <h2>Recuperar contraseña</h2>
    <form @submit.prevent="enviarToken">
      <input type="email" v-model="email" placeholder="Introduce tu correo" required />
      <button type="submit">Enviar enlace</button>
      <p v-if="mensaje">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      mensaje: "",
    };
  },
  methods: {
    async enviarToken() {
      const response = await fetch("http://localhost:3000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email }),
      });

      const res = await response.json();
      this.mensaje = res.message;
    },
  },
};
</script>
