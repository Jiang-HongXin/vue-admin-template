<template>
  <div class="app-container">
    <h3 style="margin-left: 100px; margin-bottom: 50px">你好，欢迎使用证书提交系统！</h3>

    <el-descriptions title="用户信息" border :column="1"  size="默认"  v-loading="loading">
      <el-descriptions-item label="名称">{{ user.name }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ user.phone }}</el-descriptions-item>
      <el-descriptions-item label="密码">{{user.password}}</el-descriptions-item>
      <el-descriptions-item label="权限">{{user.role}}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{user.createTime}}</el-descriptions-item>
      <el-descriptions-item label="修改时间">{{user.modifyTime}}</el-descriptions-item>
    </el-descriptions>

    <!-- 弹窗 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="user" ref="user">
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="user.name"  :style="{width: '200px'}"/>
        </el-form-item>

        <el-form-item label="学科" label-width="100px">
          <el-input v-model="user.subject"  :style="{width: '200px'}" disabled/>
        </el-form-item>

        <el-form-item label="手机号" label-width="100px">
          <el-input v-model="user.phone"  :style="{width: '200px'}"/>
        </el-form-item>

        <el-form-item label="密码" label-width="100px">
          <el-input v-model="user.password"  :style="{width: '200px'}"/>
        </el-form-item>

        <el-form-item label="权限" label-width="100px">
          <el-input v-model="user.role"  :style="{width: '200px'}" disabled/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClickConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <div style="margin-top: 30px">
      <ElButton type="primary" @click="onClickToUpdateUser">修改个人信息</ElButton>
      <ElButton type="primary" @click="onCLickToAddHonor">上传证书</ElButton>
      <ElButton type="primary" @click="onClickToListHonor">查看已上传证书</ElButton>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {info, update} from "@/api/user";
import {Message} from "element-ui";

export default {
  mounted() {
    this.fetchData()
  },
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
      },
      dialogFormVisible: false,
      loading: false,
      user: {
        name: '',
        role: '',
        subject: '',
        password: '',
        phone: '',
      },
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      info().then(response => {
        const data = response.data
        Object.assign(this.user, data);
      }).finally(() => {
        this.loading = false
      })
    },
    onClickToListHonor() {
      this.$router.push('/honor/listHonor')
    },
    onCLickToAddHonor() {
      this.$router.push('/honor/addHonor')
    },
    onClickToUpdateUser() {
      this.dialogFormVisible = true
    },
    onClickConfirm() {
      update(this.user).then(response => {
        this.$message({
          message: '操作成功!',
          type: 'success'
        })

      }).catch(error => {
        Message({
          message: error || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }).finally(() => {
        this.dialogFormVisible = false
        this.fetchData()
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

