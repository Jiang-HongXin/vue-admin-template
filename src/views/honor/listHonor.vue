<template>
  <div class="app-container">
    <!-- 表格选项   -->
    <el-form :inline="true"  ref="form" :model="form" >

      <el-form-item label="获奖时间">
        <el-date-picker
          v-model="form.date"
          type="month"
          placeholder="选择获奖时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="获奖类别" >
        <el-select v-model="form.type" placeholder="请选择" clearable>
          <el-option
            v-for="item in typeSelector"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="获奖级别">
        <el-select v-model="form.grade" placeholder="请选择" clearable>
          <el-option
            v-for="item in gradeSelector"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="获奖等级">
        <el-select v-model="form.level" placeholder="请选择" clearable>
          <el-option
            v-for="item in levelSelector"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <ElButton type="primary" @click="fetchData">搜索</ElButton>
      </el-form-item>

      <el-form-item>
        <ElButton type="primary" @click="exportData">导出当前页数据</ElButton>
      </el-form-item>

    </el-form>


    <!-- 表格数据   -->
    <el-image-viewer v-if="viewVisible" :url-list="urls" :on-close="closeView" :teleported="true" />

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column label="名称"  width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
          (scope.row.auditing === 1 ? '待复审' : '已完成')
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
          <ElButton  @click="openUpdateView(scope.row)"  type="text" :disabled="scope.row.auditing !== 2">修改</ElButton>
          <ElButton  @click="openAuditView(scope.row)"  type="text" :disabled="scope.row.auditing !== 0" v-show="role === '教研组长' || role === '系统管理员'">初审</ElButton>
          <ElButton  @click="openAuditView(scope.row)"  type="text" :disabled="scope.row.auditing !== 1" v-show="role === '教科室主任' || role === '系统管理员'">复审</ElButton>
          <ElButton  @click="openAuditView(scope.row)"  type="text" :disabled="scope.row.auditing < 2" v-show="role === '教科室主任' || role === '系统管理员'">打回</ElButton>
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

  </div>

</template>

<script>
import {downloadFile, getDictionary, listHonor, exportHonor, auditHonor} from "@/api/honor";
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {Message} from "element-ui";
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
    ElImageViewer
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
      Message({
        message: error || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
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
        date: '',
        type: '',
        level: '',
        society: 1,
        grade: '',
        fileIndex: '',
        pageIndex: 0,
        pageSize: 10,
      },
      src: '',
      viewVisible: false,
      urls: '',
      typeSelector: [],
      levelSelector: [],
      gradeSelector: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     *  图片展示
     */
    openView(fileIndex) {
      const newFileIndex = fileIndex.split(',')

      const urls = []
      let length = 0
      for (let i = 0; i < newFileIndex.length; i++) {
        const newForm = {}
        newForm.fileIndex = newFileIndex[i]

        downloadFile(newForm).then(res => {
          let flow = res.data
          let blob = new Blob([flow])
          length = urls.push(window.URL.createObjectURL(blob))
        })
      }
      this.urls = urls
      this.viewVisible = true;
    },
    closeView() {
      this.viewVisible = false;
    },
    /**
     * 拉数据
     */
    fetchData() {
      this.listLoading = true
      this.form.pageIndex = this.currentPage - 1
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
      this.form.pageIndex = this.currentPage - 1
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
    openUpdateView(data) {
      this.$router.push({ path: '/honor/updateHonor', query: data})
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
  }
}




</script>
