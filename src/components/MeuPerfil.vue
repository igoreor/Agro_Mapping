<template>
  <div class="perfil-container">
    <header class="perfil-header">
      <h1>Minha Conta</h1>
      <p>Gerencie suas informações pessoais, pedidos e segurança.</p>
    </header>

    <div class="perfil-content">
      <aside class="perfil-menu">
        <nav>
          <ul>
            <li class="active"><a href="#">Meu Perfil</a></li>
            <li><a href="#">Meus Pedidos</a></li>
            <li><a href="#">Endereços</a></li>
            <li><a href="#">Segurança</a></li>
            <li><a href="#" class="logout">Sair</a></li>
          </ul>
        </nav>
      </aside>

      <main class="perfil-details">
        <div class="card">
          <div class="card-header">
            <h2>Informações Pessoais</h2>
            <button @click="toggleEditMode" class="btn btn-primary">{{ isEditing ? 'Salvar' : 'Editar' }}</button>
          </div>
          <div class="card-body">
            <div class="profile-pic-section">
              <img src="https://i.pravatar.cc/150?img=32" alt="Foto do Perfil" class="profile-pic">
              <label v-if="isEditing" for="file-upload" class="btn btn-secondary">
                Trocar Foto
              </label>
              <input v-if="isEditing" id="file-upload" type="file" @change="onFileChange">
            </div>
            <form @submit.prevent="saveProfile">
              <div class="form-grid">
                <div class="form-group">
                  <label for="nome">Nome Completo</label>
                  <input type="text" id="nome" v-model="user.nome" :disabled="!isEditing">
                </div>
                <div class="form-group">
                  <label for="email">E-mail</label>
                  <input type="email" id="email" v-model="user.email" :disabled="!isEditing">
                </div>
                <div class="form-group">
                  <label for="telefone">Telefone</label>
                  <input type="tel" id="telefone" v-model="user.telefone" :disabled="!isEditing">
                </div>
                <div class="form-group">
                  <label for="cpf">CPF</label>
                  <input type="text" id="cpf" v-model="user.cpf" disabled>
                </div>
              </div>
              <div v-if="isEditing" class="form-actions">
                <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeuPerfil',
  data() {
    return {
      isEditing: false,
      user: {
        nome: 'Maria Silva',
        email: 'maria.silva@email.com',
        telefone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        profilePic: 'https://i.pravatar.cc/150?img=32'
      },
      originalUser: {}
    };
  },
  methods: {
    toggleEditMode() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        // Salva o estado original para poder cancelar
        this.originalUser = { ...this.user };
      }
    },
    saveProfile() {
      // Aqui você adicionaria a lógica para enviar os dados para a API
      console.log('Salvando perfil:', this.user);
      this.isEditing = false;
      // Opcional: mostrar uma notificação de sucesso
    },
    cancelEdit() {
      // Restaura os dados originais
      this.user = { ...this.originalUser };
      this.isEditing = false;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.user.profilePic = URL.createObjectURL(file);
        // Aqui você adicionaria a lógica para fazer upload da imagem
      }
    }
  }
};
</script>

<style scoped>
.perfil-container {
  max-width: 1200px;
  margin: 2rem auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.perfil-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.perfil-header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.perfil-content {
  display: flex;
  gap: 2rem;
}

/* Menu Lateral */
.perfil-menu {
  flex: 0 0 220px;
}

.perfil-menu nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.perfil-menu nav li a {
  display: block;
  padding: 0.8rem 1rem;
  text-decoration: none;
  color: #555;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
}

.perfil-menu nav li a:hover {
  background-color: #f0f0f0;
  color: #000;
}

.perfil-menu nav li.active a {
  background-color: #007bff;
  color: #fff;
}

.perfil-menu nav li a.logout {
    color: #d9534f;
}

.perfil-menu nav li a.logout:hover {
    background-color: #fce8e6;
}


/* Detalhes do Perfil */
.perfil-details {
  flex-grow: 1;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;
}

.card-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

/* Seção da Foto */
.profile-pic-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e0e0e0;
}

#file-upload {
    display: none;
}

/* Formulário */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:disabled {
  background-color: #f4f4f4;
  cursor: not-allowed;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.2);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

/* Botões */
.btn {
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
    transform: translateY(-2px);
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}
.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}
.btn-secondary:hover {
    background-color: #5a6268;
}

</style>