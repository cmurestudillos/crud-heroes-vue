<template>
  <div>
    <h1 v-if="heroe.nombre">
      Héroe: <small>{{ heroe.nombre }}</small>
    </h1>
    <h1 v-if="!heroe.nombre">
      Héroe: <small>{{ isNuevo ? 'Nuevo héroe' : 'Cargando...' }}</small>
    </h1>
    <hr />

    <div class="row text-end">
      <div class="col">
        <router-link :to="'/heroes'" class="btn btn-outline-primary" title="Volver">
          <font-awesome-icon icon="arrow-left" /> Volver
        </router-link>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <form v-if="!cargando" @submit.prevent="guardar">
          <div class="form-group">
            <label>ID MongoDB</label>
            <input v-model="heroe._id" type="text" class="form-control" placeholder="ID MongoDB" name="_id" disabled />
            <small class="form-text text-muted">Este campo se genera automáticamente.</small>
          </div>

          <div class="form-group">
            <label>Nombre *</label>
            <input
              v-model="heroe.nombre"
              type="text"
              class="form-control"
              placeholder="Nombre del héroe"
              name="nombre"
              required />
          </div>

          <div class="form-group">
            <label>Poder</label>
            <input v-model="heroe.poder" type="text" class="form-control" placeholder="Poder del héroe" name="poder" />
          </div>

          <div class="form-group">
            <label>Estado</label>
            <br />
            <button
              v-if="heroe.estado"
              class="btn btn-outline-success w-25"
              type="button"
              title="Vivo"
              @click="heroe.estado = false">
              <font-awesome-icon icon="thumbs-up" title="Vivo" /> Vivo
            </button>
            <button
              v-if="!heroe.estado"
              class="btn btn-outline-danger w-25"
              type="button"
              title="Muerto"
              @click="heroe.estado = true">
              <font-awesome-icon icon="thumbs-down" title="Muerto" /> Muerto
            </button>
          </div>

          <hr />

          <div class="form-group text-center">
            <button type="submit" class="btn btn-outline-primary w-25" title="Guardar" :disabled="guardando">
              <font-awesome-icon
                :icon="guardando ? 'spinner' : 'save'"
                :class="{ 'fa-spin': guardando }"
                title="Guardar" />
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>

        <!-- Loading mientras carga los datos -->
        <div v-if="cargando" class="alert alert-info text-center mt-3">
          <h4 class="alert-heading">Cargando</h4>
          <p><i class="fa fa-spinner fa-spin fa-2x"></i></p>
          <p class="mb-0">Espere por favor...</p>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="alert alert-danger text-center mt-3">
          <h4 class="alert-heading">Error</h4>
          <p>{{ error }}</p>
          <button class="btn btn-outline-danger" @click="reintentar">Reintentar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';

export default {
  name: 'HeroeComponent',
  data() {
    return {
      api: API_URL,
      heroeId: null,
      isNuevo: false,
      cargando: false,
      guardando: false,
      error: null,
      heroe: {
        _id: '',
        nombre: '',
        poder: '',
        estado: true, // Por defecto vivo
      },
    };
  },
  mounted() {
    this.heroeId = this.$route.params.id;
    this.isNuevo = this.heroeId === 'nuevo';

    if (!this.isNuevo) {
      this.getHeroeById(this.heroeId);
    }
  },
  methods: {
    async getHeroeById(heroeId) {
      this.cargando = true;
      this.error = null;

      try {
        const response = await axios.get(`${this.api}/heroes/${heroeId}`);

        if (response.data && response.data.heroe) {
          this.heroe = response.data.heroe;
        } else if (response.data) {
          // En caso de que venga directamente el héroe sin wrapper
          this.heroe = response.data;
        } else {
          throw new Error('Héroe no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener héroe:', error);
        this.error =
          error.response?.status === 404
            ? 'Héroe no encontrado'
            : 'Error al cargar el héroe. Por favor, intenta de nuevo.';
      } finally {
        this.cargando = false;
      }
    },

    async guardar() {
      // Validación básica
      if (!this.heroe.nombre || this.heroe.nombre.trim() === '') {
        await Swal.fire({
          icon: 'warning',
          title: 'Campo requerido',
          text: 'El nombre del héroe es obligatorio',
        });
        return;
      }

      this.guardando = true;

      try {
        if (this.isNuevo) {
          // Crear nuevo héroe
          await axios.post(`${this.api}/heroes`, {
            nombre: this.heroe.nombre.trim(),
            poder: this.heroe.poder.trim(),
            estado: this.heroe.estado,
          });

          await Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El héroe ha sido creado correctamente.',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          // Actualizar héroe existente
          await axios.put(`${this.api}/heroes/${this.heroeId}`, {
            nombre: this.heroe.nombre.trim(),
            poder: this.heroe.poder.trim(),
            estado: this.heroe.estado,
          });

          await Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El héroe ha sido modificado correctamente.',
            showConfirmButton: false,
            timer: 1500,
          });
        }

        // Redirigir a la lista de héroes
        this.$router.push('/heroes');
      } catch (error) {
        console.error('Error al guardar héroe:', error);

        let mensaje = 'Error al guardar el héroe. Intenta de nuevo.';
        if (error.response?.status === 400) {
          mensaje = 'Datos inválidos. Verifica los campos.';
        } else if (error.response?.status === 404) {
          mensaje = 'Héroe no encontrado.';
        }

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
        });
      } finally {
        this.guardando = false;
      }
    },

    reintentar() {
      this.error = null;
      if (!this.isNuevo) {
        this.getHeroeById(this.heroeId);
      }
    },
  },
};
</script>
