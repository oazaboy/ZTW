<template>
  <form  @submit.prevent="saveAuthor">
    <div class="form-group">
      <label for="authorName">Name</label>
      <input
          id="authorName"
          v-model="author.authorName"
          type="text"
          class="form-control"
          :class="{'is-invalid': submitting && invalidName }"
          @focus="clearStatus"
          @keypress="clearStatus"
      />
      <label for="authorLastName" id="mt1">Last name</label>
      <input
          id="authorLastName"
          v-model="author.authorLastName"
          type="text"
          :class="{ 'is-invalid': submitting && invalidLastName }"
          @focus="clearStatus"
          class="form-control"
      />

      <p v-if="error && submitting" class="error-message">
        Please, fill all of the fields.
      </p>
      <p v-if="success" class="success-message">
        Successfully saved.
      </p>

      <button class="btn btn-success" >Add author</button>
    </div>
  </form>
</template>



<script>
import AuthorDataService from "@/services/AuthorDataService";

export default {
  name: 'authors-form',
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      author: {
        id: null,
        authorName: '',
        authorLastName: '',
      },
    }
  },
  methods: {
    saveAuthor() {
      this.submitting = true
      this.clearStatus()

      //check form fields
      if (this.invalidName || this.invalidLastName) {
        this.error = true
        return
      }

      const data = {
        authorName: this.author.authorName,
        authorLastName: this.author.authorLastName
      };

      AuthorDataService.create(data)
          .then(response => {
            this.author.id = response.data.id;
            console.log(response.data);
            this.success = true;
          })
          .catch(e => {
            console.log(e);
          });

      this.error = false
      this.success = true
      this.submitting = false

      this.author = {
        authorName: '',
        authorLastName: '',
      }
    },


    clearStatus() {
      this.success = false
      this.error = false
    },
  },

  computed: {
    invalidName() {
      return this.author.authorName === ''
    },
    invalidLastName() {
      return this.author.authorLastName === ''
    },
  },
}
</script>

<style scoped>
  form {
    margin-bottom: 2rem;
  }

  [class*='-message'] {
    font-weight: 500;
  }
  .error-message {
    color: #d33c40;
  }
  .success-message {
    color: #32a95d;
  }

  .btn{
    margin-top: 20px;
  }

  .form-group{
    font-weight: bolder;
    font-size: 20px;
  }

  #authorName, #mt1{
    margin-top: 10px;
  }

  #authorLastName{
    margin-top: 6px;
  }

</style>
