<template>
  <div class="app-container">
    <!-- 表格选项   -->
    <el-form :inline="true"  ref="form" :model="form" >

      <el-form-item label="名称">
        <el-input  v-model="form.name"
          placeholder="输入教师名称"/>
      </el-form-item>

      <el-form-item label="手机号">
        <el-input  v-model="form.phone"
                   placeholder="输入手机号"/>
      </el-form-item>

      <el-form-item label="教师科目">
        <el-select v-model="form.subject" placeholder="请选择" clearable>
          <el-option
            v-for="item in subjectSelector"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <ElButton type="primary" @click="fetchData">搜索</ElButton>
      </el-form-item>

    </el-form>


    <!-- 表格   -->
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

      <el-table-column label="权限"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <ElButton  @click="updatePassword(scope.row)"  type="text" v-show="role === '教研组长' || role === '系统管理员'">修改密码</ElButton>
          <ElButton  @click="onClickUpdateBtn(scope.row)"  type="text" v-show="role === '系统管理员'">修改人员信息</ElButton>

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

    <!-- Form -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="user" ref="user">
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="user.name"  :style="{width: '200px'}"/>
        </el-form-item>

        <el-form-item label="学科" label-width="100px">
          <el-select v-model="user.subject" placeholder="请选择" :style="{width: '200px'}">
            <el-option
              v-for="item in subjectSelector"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" label-width="100px">
          <el-input v-model="user.phone"  :style="{width: '200px'}"/>
        </el-form-item>

        <el-form-item label="密码" label-width="100px">
          <el-input v-model="user.password"  :style="{width: '200px'}"/>
        </el-form-item>

        <el-form-item label="权限" label-width="100px">
          <el-select v-model="user.role" placeholder="请选择" :style="{width: '200px'}">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClickConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, update} from '@/api/user'
import {getDictionary} from "@/api/honor";
import {Message} from "element-ui";
import {mapGetters} from "vuex";
import {operateDictionary} from "@/api/admin";

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
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  mounted() {
    getDictionary().then(response => {
      const data = response.data
      this.subjectSelector = data['教师科目']

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
      user: {
        name: '',
        role: '',
        subject: '',
        password: '',
        phone: '',
      },
      total: 0,
      currentPage: 1,
      dialogFormVisible: false,
      subjectSelector: [],
      form: {
        pageIndex: 0,
        pageSize: 10,
      },
      options: [{
        value: '普通教师',
        label: '普通教师'
      }, {
        value: '教研组长',
        label: '教研组长'
      }, {
        value: '教科室主任',
        label: '教科室主任'
      }, {
        value: '系统管理员',
        label: '系统管理员'
      }
      ],
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
    onClickUpdateBtn(data) {
      Object.assign(this.user, data);
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
