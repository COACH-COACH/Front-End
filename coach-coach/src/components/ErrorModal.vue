<template>
  <transition name="error">
    <div class="error-mask" v-if="show">
      <div class="error-wrapper">
        <div class="error-container">
          <div class="error-header">
            <slot name="header">
              <!-- Default header text -->
              Error
            </slot>
          </div>

          <div class="error-body">
            <slot name="body">
              <!-- Default body text -->
              An error has occurred. Please try again.
            </slot>
          </div>

          <div class="error-footer">
            <slot name="footer">
              <button class="error-default-button" @click="$emit('close')">
                닫기
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ErrorModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close']
};
</script>

<style>
.error-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-wrapper {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease-in-out;
}

.error-container {
  margin: 20px;
 
 text-align: center;
}
.error-container > * {
  margin: 0 auto; /* 가운데 정렬 */
}

.error-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #ebebeb;
  font-size: 24px;
}

.error-body {
  margin-top: 20px;
  margin-bottom: 20px;
  overflow: auto;
}

.error-footer {
  padding-top: 20px;
  border-top: 1px solid #ebebeb;
  text-align: right;
}

.error-default-button {
  border: none;
  background: #f44336;
  color: white;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-default-button:hover {
  background: #d32f2f;
}


</style>
