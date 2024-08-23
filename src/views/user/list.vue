<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column label="名称"  align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="学科"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subject }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="密码"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <ElButton  @click="updatePassword(scope.row)"  type="text">修改</ElButton>
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
import { list, update} from '@/api/user'

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
  data() {
    return {
      list: null,
      listLoading: true,

      form: {
        pageIndex: 0,
        pageSize: 10,
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      list(this.form).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    updatePassword(data) {
      this.$prompt(
        '请输入新密码:', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      ).then(({value}) => {
        const updateForm = {}
        Object.assign(updateForm, data)
        updateForm.password = value

        this.listLoading = true

        update(updateForm).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '操作成功!',
              type: 'success'
            })

            this.fetchData()
          } else {
            this.$message({
              message: '操作失败!请联系管理员！',
              type: 'error'
            })
          }
        }).finally(() => {
          this.listLoading = true
        })
      })
    },
  }
}
</script>
