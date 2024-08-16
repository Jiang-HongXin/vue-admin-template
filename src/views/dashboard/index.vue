<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户名称">
        <el-input v-model="name"></el-input>
      </el-form-item>
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
  name: '主页',
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

