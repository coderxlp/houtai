<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDalog">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 几集 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operating" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog title="提示" :visible.sync="catedialogVisible" width="50%" @close='addCateDialogClose'>
      <!-- 主体 -->
      <el-form :model="cateForm" :rules="cateRules" ref="cateRules" label-width="100px">
        <el-form-item label="活动名称" prop="cateName">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 数据源 -->
          <el-cascader
            :props="parendkys"
            v-model="selectedKeys"
            :options="parendList"
            @change="addHandleChange"
            :clearable='true'
            :emitPath='true'
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="catedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="catedialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      /* 商品分类数据 */
      catelist: [],
      /* 总数据 */
      total: 0,
      // table 数据渲染
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "是否有效",
          type: "template",
          template: "sort"
        },
        {
          label: "操作",
          type: "template",
          template: "operating"
        }
      ],
      /* 添加分类弹框 */
      catedialogVisible: false,
      /* 添加分类 */
      cateForm: {
        /* 名字 */
        cat_name: "",
        /*  */
        cat_pid: 0,
        /* zi */
        cat_level: 0
      },
      cateRules: {
        cateName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      /* 父级数据 */
      parendList: [],
      
     
      parendkys:{
        expandTrigger: 'hover',
        value:'car',
        label:'cat_name',
        children:'children', 
      },
      /* 添加数据的ID */
       selectedKeys:[],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (res.meta.status !== 200) {
        return;
      }
      console.log(res);
      this.total = res.data.total;
      this.catelist = res.data.result;
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum;
      this.getCateList();
    },
    /* 添加商品 */
    showCateDalog() {
      this.getparentdata();
      this.catedialogVisible = true;
    },
    /* 获取父级数据 */
    async getparentdata() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return;
      }
      this.parendList = res.data;
      console.log(this.parendList);
    },
    addHandleChange(){
      console.log(this.selectedKeys);
      
    },
    addCateDialogClose(){
      this.$refs.cateRules.resetFields();
      this.selectedKeys=[]
      this.cateForm.cat_pid=0
      this.cateForm.cat_level=0
    }
  }
};
</script>

<style scoped>
.treeTable {
  margin: 10px 0;
}
.el-cascader{
  width: 100%;
}
</style>