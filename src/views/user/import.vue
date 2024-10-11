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
          :before-upload="beforeUpload"
          :http-request="uploadFiles"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :limit="1"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

import {Message, MessageBox} from "element-ui";
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
    beforeUpload(file) {
      let types = ['xls', 'xlsx'];
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isExcel = types.includes(fileType);
      if (!isExcel) {
        this.$message.error('文件只能是 Excel！仅接受 XLSX、XLS 格式!');
        return Promise.reject(false);
      }
      return true;
    },
    uploadFiles(item) {
      let formData = new FormData()
      formData.append('file', item.file)
      importData(formData).then(response => {
        this.fileIndexMap.set(item.file.name, response.data)
        this.$message({
          message: '操作成功! 请前往人员列表进行查看！',
          type: 'success'
        })
      }).catch(error => {
        this.$message({
          message: '操作成功! 请前往人员列表进行查看！',
          type: 'error'
        })
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

