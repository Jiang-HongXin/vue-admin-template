<template>
  <div class="app-container">
    <h3 style="margin-left: 100px; margin-bottom: 50px">你好，欢迎使用证书提交系统！</h3>

    <el-descriptions title="用户信息" border :column="1" >
      <el-descriptions-item label="名称">{{ name }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ phone }}</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">
        <el-tag size="small">学校</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
    </el-descriptions>

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户手机">
        <el-input v-model="phone"></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="password"></el-input>
      </el-form-item>
      <el-form-item label="用户权限">
        <el-input v-model="role" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="createTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="修改时间">
        <el-input v-model="modifyTime" disabled></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'name', 'modifyTime', 'createTime', 'role', 'phone', 'password'
    ])
  },
  data() {
    return {
      form: {
        name: '',
        region: '',
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

