<template>
  <div>
    <h1>Listado de Heroes</h1>
    <hr />
    <div class="row">
      <div class="col text-right">
        <router-link :to="'/heroe/nuevo'" class="btn btn-outline-primary" title="Alta">
          <font-awesome-icon icon="plus" /> Nuevo
        </router-link>
      </div>
    </div>

    <table aria-describedby="tabla-heroes" v-if="!cargando && heroes.length > 0" class="table mt-3">
      <thead class="bg-custom">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Poder</th>
          <th scope="col">Estado</th>
          <th scope="col" colspan="2" class="text-center">Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="heroe in heroes" :key="heroe._id">
          <td>{{ heroe.nombre }}</td>
          <td>{{ heroe.poder }}</td>
          <td>
            <font-awesome-icon v-if="heroe.estado" icon="thumbs-up" class="text-success fa-2x" title="Vivo" />
            <font-awesome-icon v-if="!heroe.estado" icon="thumbs-down" class="text-danger fa-2x" title="Muerto" />
          </td>
          <td class="text-center">
            <router-link :to="'/heroe/' + heroe._id" class="btn btn-outline-warning mr-1" title="Modificar">
              <font-awesome-icon icon="edit" />
            </router-link>
            <button class="btn btn-outline-danger" @click="borrarHeroe(heroe._id)" title="Eliminar">
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" class="bg-custom">
            <span><e>Copyright© - Carlos Mur</e></span>
          </td>
        </tr>
      </tfoot>
    </table>

    <div v-if="!cargando && heroes.length === 0" class="alert alert-warning text-center mt-3">
      <h4 class="alert-heading">No hay registros</h4>
      <p><i class="fa fa-exclamation fa-2x"></i></p>
    </div>

    <div v-if="cargando" class="alert alert-info text-center mt-3">
      <h4 class="alert-heading">Cargando</h4>
      <p><i class="fa fa-spinner fa-spin fa-2x"></i></p>
      <p class="mb-0">Espere por favor...</p>
    </div>

    <!-- Mensaje de error si hay algún problema -->
    <div v-if="error" class="alert alert-danger text-center mt-3">
      <h4 class="alert-heading">Error</h4>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'HeroesComponent',
  mounted() {
    this.getHeroes();
  },
  data() {
    return {
      api: 'https://crud-heroes-service.vercel.app/api',
      cargando: false,
      heroes: [],
      error: null,
    };
  },
  methods: {
    async getHeroes() {
      this.cargando = true;
      this.error = null;

      try {
        const response = await axios.get(`${this.api}/heroes`);

        // La respuesta viene con la estructura { heroes: [...] }
        if (response.data && response.data.heroes) {
          this.heroes = response.data.heroes;
        } else {
          this.heroes = [];
        }
      } catch (error) {
        console.error('Error al obtener heroes:', error);
        this.error = 'Error al cargar los héroes. Por favor, intenta de nuevo.';
        this.heroes = [];
      } finally {
        this.cargando = false;
      }
    },

    async borrarHeroe(idHeroe) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Una vez eliminado, no podrás recuperar este héroe.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        this.cargando = true;
        try {
          await axios.delete(`${this.api}/heroes/${idHeroe}`);

          // Mostrar mensaje de éxito
          await Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Héroe eliminado correctamente',
            showConfirmButton: false,
            timer: 1500,
          });

          // Recargar la lista de héroes
          await this.getHeroes();
        } catch (error) {
          console.error('Error al eliminar héroe:', error);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el héroe. Intenta de nuevo.',
          });
        } finally {
          this.cargando = false;
        }
      }
    },
  },
};
</script>
