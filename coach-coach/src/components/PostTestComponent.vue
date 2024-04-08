<template>
    <div>
        <h1>서버에 POST로 API를 요청하는 컴포넌트</h1>
        <form @submit.prevent="submitForm">
        <div>
            <label for="title">제목:</label>
            <input type="text" id="title" v-model="postData.title">
        </div>
        <div>
            <label for="body">내용:</label>
            <textarea id="body" v-model="postData.body"></textarea>
        </div>
        <button type="submit">전송</button>
        </form>
        <div v-if="response">
        <h2>응답:</h2>
        <p>제목: {{ response.title }}</p>
        <p>내용: {{ response.body }}</p>
        <p>ID: {{ response.id }}</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PostComponent',
  data() {
    return {
      postData: {
        title: '',
        body: ''
      },
      response: null
    }
  },
  methods: {
    async submitForm() {
      const url = 'https://jsonplaceholder.typicode.com/posts';
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(this.postData),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const responseData = await response.json();
        this.response = responseData;
      } catch (error) {
        console.error('데이터를 보내는 중 오류가 발생했습니다::', error);
      }
    }
  }
}
</script>
