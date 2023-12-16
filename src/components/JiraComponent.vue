<template>
  <!-- TODO: Add progress bar with steps -->
  <div class="container mt-5 mb-5">
    <div class="row justify-content-center">
      <div class="col-8">
        <step-progress :steps="mySteps" :current-step="currentStep" icon-class="fa fa-check" active-color="#e20074"
          active-thickness=5 passive-color="#eee" line-thickness=5></step-progress>
      </div>

    </div>
  </div>
  <h1 class="display-4 mb-3">Add requirment files
  </h1>
  <div v-if="alertMessage" class="alert alert-success mb-3" role="alert">
    {{ alertMessage }}
  </div>
  <div class="input-group mb-3">
    <input type="file" id="inputGroupFile02" ref="uploadFile" @change="onFileUpload">
  </div>
  <button @click="uploadFile" class="btn btn-primary mb-5">Upload file</button>
  <h1 class="display-4 mb-3">Analyze whole context</h1>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Epic name</label>
    <input type="text" class="form-control mb-3" v-model="requestEpic" placeholder="MAVI-XXXXX">
    <label for="exampleFormControlInput2" class="form-label">Your role</label>
    <br>
    <select v-model="selectedRole" class="form-select">
      <option>Business analyst</option>
      <option>Product owner</option>
      <option>Tester</option>
    </select>
  </div>
  <div class="d-flex justify-content-between">
    <button @click="getResponse" class="btn btn-primary mb-5">Analyze epic</button>
    <button @click="cleanContext" class="btn btn-outline-danger mb-5">Clean context</button>
  </div>
  <div v-if="isLoading"><content-loader></content-loader></div>
  <div v-if="gptResponse" class="card">
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">GPT Response:
        <small class="text-muted"> Total token count: {{ gptTokenCount }}</small>
      </h6>
      <div v-html="gptResponse" class="response"></div>
    </div>
  </div>
  <div v-if="gptResponse || isAdjust" class="mt-3">
    <h1>Do you like this report? You can ajust it by query</h1>
    <form>
    <div class="mb-3">
      <label for="requestText" class="form-label">Input your request</label>
      <textarea class="form-control" v-model="requestText" rows="3"></textarea>
    </div>
  </form>
  <div class="d-flex justify-content-between">
    <button @click="getAdjustedResponse" class="btn btn-primary mb-5">Send</button>
  </div>  
  </div>
</template>


<script>
import axios from 'axios'
import { marked } from 'marked'
import StepProgress from 'vue-step-progress'
import { ContentLoader } from 'vue-content-loader'
import 'vue-step-progress/dist/main.css'

export default {
  name: 'JiraComponent',
  components: {
    'step-progress': StepProgress,
    ContentLoader,
  },
  data() {
    return {
      gptResponse: '',
      gptTokenCount: '',
      backendUrl: 'http://localhost:8080/api',
      isLoading: false,
      requestEpic: '',
      requestText: '',
      file: null,
      alertMessage: "",
      selectedRole: 'Business analyst',
      mySteps: ['Add requirments', 'Analyze epic', 'Adjust report'],
      currentStep: 0,
      isAdjust: false
    }
  },
  methods: {
    onFileUpload() {
      this.file = this.$refs.uploadFile.files[0];
    },
    async uploadFile() {
      if (this.file == null) return;
      this.isLoading = true;
      const url = `${this.backendUrl}/analyze/uploadFile`;
      const params = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append("file", this.file);
      try {
        await axios.post(url, formData, params)
        this.isLoading = false;
        this.alertMessage = "File uploaded and added to context!";
        await new Promise(r => setTimeout(r, 2000));
        this.alertMessage = ""
        this.currentStep = 1
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    async getAdjustedResponse() {
      if (this.requestText.trim().length < 1) return;
      this.isLoading = true;
      this.gptResponse = '';
      try {
        const response = await axios.post(this.backendUrl, this.requestText)
        this.gptResponse = marked(response.data.response)
        this.gptTokenCount = response.data.tokenCount
        this.isAdjust = true
        this.currentStep = 3
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    async getResponse() {
      if (this.requestEpic.trim().length < 1 || this.selectedRole == '') return;
      this.isLoading = true;
      this.gptResponse = '';
      this.gptTokenCount = '';
      const url = `${this.backendUrl}/analyze/epic/${this.requestEpic}`;
      const body = {
        role: this.selectedRole
      }
      try {
        const response = await axios.post(url, body)
        this.gptResponse = marked(response.data.response)
        this.gptTokenCount = response.data.tokenCount
        this.currentStep = 2
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    async cleanContext() {
      try {
        await axios.delete(`${this.backendUrl}/clean`)
        this.gptResponse = '';
        this.currentStep = 0;
        this.isAdjust = false;
        alert("Context is flushed!");
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped></style>
