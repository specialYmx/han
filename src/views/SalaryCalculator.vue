<template>
  <div class="salary-calculator-page">
    <div class="page-header">
      <van-nav-bar title="薪资计算" fixed />
    </div>
    <div class="page-content">
      <SalaryCalculatorComponent />
    </div>
  </div>
</template>

<script setup>
import SalaryCalculatorComponent from '@/components/SalaryCalculator.vue'
</script>

<style scoped>
.salary-calculator-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  position: relative;
  z-index: 100;
}

.page-header :deep(.van-nav-bar) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
}

.page-header :deep(.van-nav-bar__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.page-content {
  padding-top: 46px; /* 导航栏高度 */
  padding: 66px 20px 20px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .page-content {
    padding: 66px 16px 20px;
  }
}
</style>
