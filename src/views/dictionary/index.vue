<template>
  <div class="app-container">
    <!--  表单  -->
    <el-form ref="form" :model="form" :inline="true">

      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <ElButton type="primary" @click="fetchData">搜索</ElButton>
        <ElButton type="primary" @click="clickAddBtn">新增</ElButton>
      </el-form-item>

    </el-form>

    <!--  表格  -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="词条类型">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>

      <el-table-column label="词条名称">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </el-table-column>

      <el-table-column label="展示优先级">
        <template slot-scope="scope">
          {{ scope.row.priority }}
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <ElButton  @click="clickUpdateBtn(scope.row)"  type="text">修改</ElButton>
          <ElButton  @click="clickDeleteBtn(scope.row)"  type="text">删除</ElButton>
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <el-dialog :title="dictionary.id ? '修改词条' : '新增词条'" :visible.sync="dialogFormVisible">
      <el-form :model="dictionary" ref="dictionary">
        <el-form-item label="词条类型" label-width="15%">
          <el-select v-model="dictionary.type" placeholder="请选择" :style="{width: '40%'}">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="词条名称" label-width="15%">
          <el-input v-model="dictionary.value"  :style="{width: '40%'}"/>
        </el-form-item>


        <el-form-item label="展示优先级" label-width="15%">
          <el-input v-model="dictionary.priority"  :style="{width: '40%'}"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {Message} from "element-ui";
import {deleteDictionary, getDictionaryV2, operateDictionary} from "@/api/admin";




export default {
  mounted() {
    this.fetchData()
  },
  data() {
    return {
      list: null,
      form: {
        type: ''
      },
      options: [{
        value: '荣誉类型',
        label: '荣誉类型'
      }, {
        value: '荣誉级别',
        label: '荣誉级别'
      }, {
        value: '荣誉等级',
        label: '荣誉等级'
      }, {
        value: '教师科目',
        label: '教师科目'
      }
      ],

      listLoading: false,
      dialogFormVisible: false,
      dictionary: {
        type: '',
        value: '',
        priority: '',
      }
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getDictionaryV2(this.form).then(response => {
        this.list = response.data
      }).catch(error => {
        Message({
          message: error || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }).finally(() =>  this.listLoading = false)
    },
    clickUpdateBtn(data) {
      Object.assign(this.dictionary, data);
      this.dialogFormVisible = true
    },
    clickAddBtn() {
      this.dictionary = {}
      this.dialogFormVisible = true
    },
    onConfirm() {
      operateDictionary(this.dictionary).then(response => {
        this.$message({
          message: '操作成功!',
          type: 'success'
        })

        this.dialogFormVisible = false
        this.fetchData()
      }).catch(error => {

      }).finally(() => {

      })
    },
    clickDeleteBtn(data) {
      deleteDictionary(data).then(response => {
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
        this.fetchData()
      })
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

