<template>
  <div>
    <h2>Restablecer Contraseña</h2>
    <form @submit.prevent="resetPassword">
      <input type="password" v-model="nueva" placeholder="Nueva contraseña" required />
      <button type="submit">Cambiar contraseña</button>
      <p>{{ mensaje }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nueva: "",
      mensaje: "",
    };
  },
  methods: {
    async resetPassword() {
      const token = new URLSearchParams(window.location.search).get("token");
      const response = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nueva: this.nueva }),
      });
      const data = await response.json();
      this.mensaje = data.message;
    },
  },
};
</script>
