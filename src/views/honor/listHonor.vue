<template>
  <div class="app-container">
    <!-- 表格选项   -->
    <el-form :inline="true"  ref="form" :model="form" >

      <el-row>
        <el-col :span="6">
          <el-form-item label="获奖时间">
            <el-date-picker
              v-model="form.dateRange"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM"
              :style="{width: '200px'}">
            </el-date-picker>
        </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="获奖类别" >
            <el-select v-model="form.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in typeSelector"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                :style="{width: '200px'}">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="获奖级别">
          <el-select v-model="form.grade" placeholder="请选择" clearable>
            <el-option
              v-for="item in gradeSelector"
              :key="item.value"
              :label="item.value"
              :value="item.value"
              :style="{width: '200px'}">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="获奖等级">
            <el-select v-model="form.level" placeholder="请选择" clearable>
              <el-option
                v-for="item in levelSelector"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                :style="{width: '200px'}">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="审核状态">
            <el-select v-model="form.auditing" placeholder="请选择" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :style="{width: '200px'}">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <ElButton type="primary" @click="fetchData">搜索</ElButton>
          </el-form-item>

          <el-form-item>
            <ElButton type="primary" @click="exportData">导出当前页数据</ElButton>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>


    <!-- 表格数据   -->
    <el-image-viewer v-if="viewVisible" :url-list="urls" :on-close="closeView" :teleported="true" />

    <el-table
      v-loading.fullscreen="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      element-loading-text="拼命加载中，请不要关闭页面，耐心等待0～3分钟。"
      element-loading-spinner="el-icon-loading"
    >

      <el-table-column label="名称"  width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="发奖单位"  width="120">
        <template slot-scope="scope">
          {{ scope.row.unit }}
        </template>
      </el-table-column>

      <el-table-column label="获奖年月份" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型"  align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>

      <el-table-column label="等级"  align="center">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>

      <el-table-column label="级别"  align="center">
        <template slot-scope="scope">
          {{ scope.row.grade }}
        </template>
      </el-table-column>

      <el-table-column label="是否协会性质"  align="center">
        <template slot-scope="scope">
          {{ scope.row.society === 1 ? '是' : '否'}}
        </template>
      </el-table-column>

      <el-table-column label="审核状态"  align="center">
        <template slot-scope="scope">
          {{ scope.row.auditing === 0 ? '未审核' :
          (scope.row.auditing === 2 ? '已完成' : '待复审')
          }}
        </template>
      </el-table-column>

      <el-table-column label="相关资料" fixed="right">
        <template #default="scope">
          <div v-if="scope.row.fileIndex">
            <ElButton  @click="openView(scope.row.fileIndex)"  type="text">点击查看</ElButton>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <ElButton  @click="openUpdateView(scope.row)"  type="text" :disabled="scope.row.auditing > 0 && scope.row.auditing < 3">修改</ElButton>
          <ElButton  @click="onClickDelete(scope.row)"  type="text" :disabled="scope.row.auditing === 2 || scope.row.auditing === 1">删除</ElButton>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页   -->
    <div  style="float: right; margin-top: 10px">
      <el-pagination
        @current-change="fetchData"
        :current-page.sync="currentPage"
        :total="total"
        :small="false"
        layout="prev, pager, next">
      </el-pagination>
    </div>

    <!-- 修改 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="honor" label-width="120px">
        <el-form-item label="荣誉名称">
          <el-input v-model="honor.name" :style="{width: '40%'}"/>
        </el-form-item>

        <el-form-item label="发奖单位">
          <el-input v-model="honor.unit" :style="{width: '40%'}" placeholder="以公章为准"/>
        </el-form-item>

        <el-form-item label="获奖时间">
          <el-date-picker
            v-model="honor.date"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择获奖时间"
            :style="{width: '40%'}"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="获奖类别">
          <el-select v-model="honor.type" placeholder="请选择" :style="{width: '40%'}">
            <el-option
              v-for="item in typeSelector"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="获奖级别">
          <el-select v-model="honor.grade" placeholder="请选择" :style="{width: '40%'}">
            <el-option
              v-for="item in gradeSelector"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="获奖等级">
          <el-select v-model="honor.level" placeholder="请选择" :style="{width: '40%'}">
            <el-option
              v-for="item in levelSelector"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否协会性质">
          <el-switch v-model="honor.society"
                     :active-value="1"
                     :inactive-value="0"
          />
        </el-form-item>

        <el-form-item label="证书照片">
          <el-upload
            class="upload-demo"
            action=""
            :on-preview="handlePreview"
            :http-request="uploadFiles"
            :on-remove="handleRemove"
            :before-upload="handleBefore"
            :file-list="fileList"
            :limit="3"
            list-type="picture-card"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过5MB，最多上传三张</div>
            <div slot="tip" class="el-upload__tip">接受的图片类型: .jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF</div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认上传</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>

</template>

<script>
import {
  downloadFile,
  getDictionary,
  listHonor,
  exportHonor,
  auditHonor,
  addHonor,
  uploadFile,
  updateHonor, deleteHonor
} from "@/api/honor";
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {Message, MessageBox} from "element-ui";
import {mapGetters} from "vuex";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    ElImageViewer,
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  mounted() {
    getDictionary().then(response => {
      const data = response.data
      this.gradeSelector = data['荣誉级别']
      this.typeSelector = data['荣誉类型']
      this.levelSelector = data['荣誉等级']

    }).catch(error => {

    })
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      currentPage: 1,
      form: {
        name: '',
        startDate: '',
        endDate: '',
        dateRange: '',
        type: '',
        level: '',
        society: 1,
        grade: '',
        auditing: '',
        fileIndex: '',
        pageIndex: 0,
        pageSize: 10,
        source: 0,
      },
      src: '',
      viewVisible: false,
      urls: '',
      typeSelector: [],
      levelSelector: [],
      gradeSelector: [],
      dialogFormVisible: false,
      options: [{
        value: 0,
        label: '未审核'
      }, {
        value: 1,
        label: '待复审'
      }, {
        value: 2,
        label: '已完成'
      }
      ],
      honor: {
        name: '',
        date: '',
        type: '',
        level: '',
        society: 1,
        grade: '',
        auditing: '',
        fileIndex: '',
        id: 0,
        unit: '',
      },

      fileList: [],
      fileIndexMap: new Map()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     *  图片展示
     */
    async openView(fileIndex) {
      this.listLoading = true
      await this.initUrls(fileIndex)
      this.listLoading = false
      this.viewVisible = true;
    },
    closeView() {
      this.viewVisible = false;
    },
    async initUrls(fileIndex) {
      const newFileIndex = fileIndex.split(',')
      const urls = []
      let length = 0
      for (let i = 0; i < newFileIndex.length; i++) {
        if (newFileIndex[i]) {
          const newForm = {}
          newForm.fileIndex = newFileIndex[i]

          await downloadFile(newForm).then(res => {
            let name = res.headers['content-disposition'].substring(21)
            this.fileIndexMap.set(name, newFileIndex[i])

            let flow = res.data
            let blob = new Blob([flow])
            const url = window.URL.createObjectURL(blob)
            this.fileList.push({'url': url, 'name': name})
            length = urls.push(url)
          })
        }
      }
      this.urls = urls
    },
    /**
     * 拉数据
     */
    fetchData() {
      this.listLoading = true
      this.form.pageIndex = (this.currentPage - 1) * 10
      this.form.source = 0

      if (this.form.dateRange) {
        this.form.startDate = this.form.dateRange[0]
        this.form.endDate = this.form.dateRange[1]
      } else {
        this.form.startDate = ''
        this.form.endDate = ''
      }
      listHonor(this.form).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /**
     * 导出
     */
    exportData() {
      this.listLoading = true
      this.form.pageIndex = (this.currentPage - 1) * 10
      this.form.source = 0
      exportHonor(this.form).then(res => {

        let blobUrl = window.URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = '证书数据.xlsx';
        a.href = blobUrl;
        a.click();

        this.listLoading = false
      })
    },
    /**
     * 更新
     */
    async openUpdateView(data) {
      this.listLoading = true
      Object.assign(this.honor, data)
      this.fileList = []
      await this.initUrls(data.fileIndex)
      this.listLoading = false
      this.dialogFormVisible = true
    },
    /**
     * 更新
     */
    async onClickDelete(data) {
      this.$confirm("确定删除该记录么？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 用户点击确认按钮后的回调函数
        this.listLoading = true

        deleteHonor(data).then(response => {
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
      }).finally(() => {
        this.listLoading = false
      })
    },
    /**
     * 初审 or 复审
     */
    openAuditView(data) {
      const msg = data.auditing === 2 ? '确定是否打回该记录? ' :
        '确定是否' + (data.auditing === 0 ? '初审' : '复审') + '通过？'

      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 用户点击确认按钮后的回调函数
        this.listLoading = true

        auditHonor(data).then(response => {
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
      }).finally(() => {
        this.listLoading = false
      })
    },
    /**
     * 上传
     */
    onSubmit() {
      let api;

      if (this.fileIndexMap.size === 0) {
        MessageBox.confirm('请上传证书照片！', '通知', {
          confirmButtonText: '确认',
          showCancelButton: false,
        })
        return;
      }

      if (this.honor.name === '' || this.honor.date === '' || this.honor.type === '' ||
        this.honor.level === '' || this.honor.society === '' || this.honor.grade === '' || this.honor.unit === '') {
        MessageBox.confirm('请检查信息是否填写完整！', '通知', {
          confirmButtonText: '确认',
          showCancelButton: false,
        })
        return;
      }

      this.honor.fileIndex = Array.from(this.fileIndexMap.values()).join(',')

      if (this.honor.id) {
        api = updateHonor(this.honor);
      } else {
        api = addHonor(this.honor);
      }
      api.then(response => {
        this.$message({
          message: '操作成功!',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.fetchData()
      })
    },
    handleRemove(item) {
      this.fileIndexMap.delete(item.name)
    },
    handlePreview(item) {
      console.log(item)
    },
    handleBefore(file) {
      if (this.fileIndexMap.get(file.name)) {
        this.$message.error(file.name + ' 文件已存在！')
        return Promise.reject(false);
      }
      let types = ['image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/png'];
      const isImage = types.includes(file.type);
      if (!isImage) {
        this.$message.error('上传图片只能是 JPG、JPEG、GIF、BMP、PNG 格式!');
        return Promise.reject(false);
      }
      const isLtSize = file.size / 1024 / 1024 < 5;
      if (!isLtSize) {
        this.$message.error('上传图片大小不能超过5MB!');
        return Promise.reject(false);
      }
      return true;
    },
    uploadFiles(item) {
      let formData = new FormData()
      formData.append('file', item.file)
      uploadFile(formData).then(response => {
        if (response.code === 0) {
          this.fileIndexMap.set(item.file.name, response.data)
          this.$message({
            message: '上传成功!',
            type: 'success'
          })
        } else {
          this.$message({
            message: '上传失败，请重新上传!',
            type: 'error'
          })
        }
      })
    }
  }
}




</script>
