<template>
  <div>
    <h1>서버에서 응답을 받아오는 컴포넌트</h1>
    <div v-if="item">
      <p>User ID: {{ item.userId }}</p>
      <p>ID: {{ item.id }}</p>
      <p>Title: {{ item.title }}</p>
      <p>Completed: {{ item.completed }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
  
<script>
  export default {
    name: 'GetComponent', // 0. views에서 import할 name
    data () { // 1. data: 컴포넌트의 상태를 정의
      return {
        item: null
      }
    },
    created () { // 2. created: 컴포넌트가 생성된 후 초기화 작업 수행
      this.fetchServerData()
    },
    methods: { // 3. methods: 비동기 로직 구조화
      async fetchServerData () {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
          if (!response.ok) {
            throw new Error('서버로부터 응답을 받는 데 실패했습니다.')
          }
          const data = await response.json() // JSON 형식의 응답을 파싱
          this.item = data // 컴포넌트 데이터에 할당
        } catch (error) {
          console.error('데이터를 불러오는 중 오류가 발생했습니다:', error)
        }
      }
    }
  }
</script>