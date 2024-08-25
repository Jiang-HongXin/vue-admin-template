<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="下载导入模版">
        <el-button size="small" type="primary" @click="exportTpl">下载模版</el-button>
      </el-form-item>

      <el-form-item label="导入教师名单">
        <el-upload
          class="upload-demo"
          action=""
          :http-request="uploadFiles"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :limit="1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

import {Message} from "element-ui";
import {exportTpl, importData} from "@/api/admin";




export default {
  mounted() {
  },
  data() {
    return {
      form: {},
      fileList: [],
      fileIndexMap: new Map()
    }
  },
  methods: {
    exportTpl() {
      exportTpl().then(response => {
        let blobUrl = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = '导入教师名单模版.xlsx';
        a.href = blobUrl;
        a.click();
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
      importData(formData).then(response => {
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

