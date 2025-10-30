<template>
  <div class="salary-calculator">
    <div class="calculator-card">
      <!-- 标题 -->
      <div class="header">
        <h1 class="title">💰 工资计算器</h1>
        <p class="subtitle">快速计算您的工作时长和工资(张含)</p>
      </div>

      <!-- 时间选择区域 -->
      <div class="time-section">
        <div class="time-item">
          <div class="time-label">
            <van-icon name="clock-o" color="#667eea" />
            <span>开始时间</span>
          </div>
          <van-field
            v-model="startTimeDisplay"
            readonly
            placeholder="请选择开始时间"
            @click="showStartPicker = true"
            class="time-input"
          >
            <template #button>
              <van-icon name="arrow" />
            </template>
          </van-field>
        </div>

        <div class="time-item">
          <div class="time-label">
            <van-icon name="clock-o" color="#764ba2" />
            <span>结束时间</span>
          </div>
          <van-field
            v-model="endTimeDisplay"
            readonly
            placeholder="请选择结束时间"
            @click="showEndPicker = true"
            class="time-input"
          >
            <template #button>
              <van-icon name="arrow" />
            </template>
          </van-field>
        </div>
      </div>

      <!-- 时薪设置 -->
      <div class="hourly-rate-section">
        <div class="rate-label">
          <van-icon name="gold-coin-o" color="#f59e0b" />
          <span>时薪（元/小时）</span>
        </div>
        <van-field v-model="hourlyRate" type="number" placeholder="请输入时薪" class="rate-input" />
      </div>

      <!-- 计算按钮 -->
      <van-button
        type="primary"
        block
        round
        size="large"
        class="calculate-btn"
        @click="calculateSalary"
      >
        <van-icon name="chart-trending-o" />
        <span>计算工资</span>
      </van-button>

      <!-- 结果展示 -->
      <div v-if="showResult" class="result-section">
        <div class="result-card">
          <div class="result-item">
            <span class="result-label">工作时长</span>
            <span class="result-value duration">{{ workDuration }}</span>
          </div>
          <div class="result-divider"></div>
          <div class="result-item">
            <span class="result-label">应得工资</span>
            <span class="result-value salary">¥ {{ totalSalary }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 开始时间选择器 -->
    <van-popup v-model:show="showStartPicker" position="bottom" round>
      <van-time-picker
        v-model="startTime"
        title="选择开始时间"
        :columns-type="['hour', 'minute']"
        @confirm="onStartTimeConfirm"
        @cancel="showStartPicker = false"
      />
    </van-popup>

    <!-- 结束时间选择器 -->
    <van-popup v-model:show="showEndPicker" position="bottom" round>
      <van-time-picker
        v-model="endTime"
        title="选择结束时间"
        :columns-type="['hour', 'minute']"
        @confirm="onEndTimeConfirm"
        @cancel="showEndPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'

// 时间选择器显示状态
const showStartPicker = ref(false)
const showEndPicker = ref(false)

// 时间数据
const startTime = ref(['09', '00'])
const endTime = ref(['18', '00'])

// 时薪
const hourlyRate = ref('21')

// 结果显示
const showResult = ref(true) // 默认显示结果
const workDuration = ref('9小时0分钟') // 默认工作时长
const totalSalary = ref('189.00') // 默认工资

// 显示的时间文本
const startTimeDisplay = computed(() => {
  return startTime.value.length === 2 ? `${startTime.value[0]}:${startTime.value[1]}` : ''
})

const endTimeDisplay = computed(() => {
  return endTime.value.length === 2 ? `${endTime.value[0]}:${endTime.value[1]}` : ''
})

// 确认开始时间
const onStartTimeConfirm = () => {
  showStartPicker.value = false
}

// 确认结束时间
const onEndTimeConfirm = () => {
  showEndPicker.value = false
}

// 计算工资
const calculateSalary = () => {
  // 验证时薪
  const rate = parseFloat(hourlyRate.value)
  if (!rate || rate <= 0) {
    showToast({
      message: '请输入有效的时薪',
      position: 'top'
    })
    return
  }

  // 验证时间
  if (!startTime.value.length || !endTime.value.length) {
    showToast({
      message: '请选择开始和结束时间',
      position: 'top'
    })
    return
  }

  // 计算时间差（分钟）
  const startHour = parseInt(startTime.value[0])
  const startMinute = parseInt(startTime.value[1])
  const endHour = parseInt(endTime.value[0])
  const endMinute = parseInt(endTime.value[1])

  let totalMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute)

  // 处理跨天情况
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60
  }

  // 验证工作时长
  if (totalMinutes === 0) {
    showToast({
      message: '开始时间和结束时间不能相同',
      position: 'top'
    })
    return
  }

  // 计算工作时长
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  workDuration.value = `${hours}小时${minutes}分钟`

  // 计算工资
  const totalHours = totalMinutes / 60
  const salary = totalHours * rate
  totalSalary.value = salary.toFixed(2)

  // 显示结果
  showResult.value = true

  // 显示成功提示
  showToast({
    message: '计算成功！',
    icon: 'success',
    position: 'top'
  })
}
</script>

<style scoped>
.salary-calculator {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.calculator-card {
  background: white;
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
}

/* 时间选择区域 */
.time-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.time-input {
  background: #f9fafb;
  border-radius: 12px;
  padding: 4px 8px;
}

.time-input :deep(.van-field__control) {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

/* 时薪设置 */
.hourly-rate-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.rate-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.rate-input {
  background: #f9fafb;
  border-radius: 12px;
  padding: 4px 8px;
}

.rate-input :deep(.van-field__control) {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

/* 计算按钮 */
.calculate-btn {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.calculate-btn:active {
  transform: translateY(2px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.calculate-btn :deep(.van-icon) {
  margin-right: 6px;
}

/* 结果展示 */
.result-section {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.result-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.result-value.salary {
  font-size: 32px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.result-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 auto;
  width: 80%;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .calculator-card {
    padding: 24px 20px;
  }

  .title {
    font-size: 24px;
  }

  .result-value.salary {
    font-size: 28px;
  }
}
</style>
