<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="荣誉名称">
        <el-input v-model="form.name" :style="{width: '40%'}"/>
      </el-form-item>

      <el-form-item label="获奖时间">
        <el-date-picker
          v-model="form.date"
          value-format="yyyy-MM"
          type="month"
          placeholder="选择获奖时间"
          :style="{width: '40%'}"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="获奖类别">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in typeSelector"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="获奖级别">
        <el-select v-model="form.grade" placeholder="请选择">
          <el-option
            v-for="item in gradeSelector"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="获奖等级">
        <el-select v-model="form.level" placeholder="请选择">
          <el-option
            v-for="item in levelSelector"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否协会性质">
        <el-switch v-model="form.society"
                   active-value="1"
                   inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="证书照片">
        <el-upload
          class="upload-demo"
          action=""
          :http-request="uploadFiles"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :limit="3"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过5MB，最多上传三张</div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认上传</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {computed, onMounted, ref, reactive} from 'vue';
import {addHonor, getDictionary, uploadFile} from "@/api/honor";
import {Message, MessageBox} from "element-ui";
import store from "@/store";




export default {
  mounted() {
    getDictionary().then(response => {
      const data = response.data
      this.gradeSelector = data['荣誉级别']
      this.typeSelector = data['荣誉类型']
      this.levelSelector = data['荣誉等级']
    }).catch(error => {
      Message({
        message: error || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    })
  },
  data() {
    return {
      form: {
        name: '',
        date: '',
        type: '',
        level: '',
        society: 1,
        grade: '',
        fileIndex: '',
      },
      typeSelector: [],
      levelSelector: [],
      gradeSelector: [],
      fileList: [],
      fileIndexMap: new Map()
    }
  },
  methods: {
    onSubmit() {
      if (this.form.name === '' || this.form.date === '' || this.form.type === '' ||
        this.form.level === '' || this.form.society === '' || this.form.grade === '' ) {
        MessageBox.confirm('请检查信息是否填写完整！', '确认', {
          confirmButtonText: '确认',
          showCancelButton: false,
        })
        return;
      }


      this.form.fileIndex = Array.from(this.fileIndexMap.values()).join(',')
      addHonor(this.form).then(response => {
        if (response.code === 0) {
          MessageBox.confirm('上传成功! 是否前往证书列表进行查看?', '操作结果通知', {
            cancelButtonText: '否',
            confirmButtonText: '是',
          }).then(() => {
            this.$router.push("/honor/listHonor")
          })
        }
      })
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    handleRemove(item) {
      this.fileIndexMap.delete(item.name)
    },
    uploadFiles(item) {
      let formData = new FormData()
      formData.append('file', item.file)
      uploadFile(formData).then(response => {
        if (response.code === 0) {
          this.fileIndexMap.set(item.file.name, response.data)
        }
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

