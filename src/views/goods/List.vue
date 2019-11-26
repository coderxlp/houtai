<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!--头部 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable class="inp" v-model="queryInfo.query" clearable @clear='getGoodsList'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="goodslist" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column label="创建时间" width="170">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteItem(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",

  data() {
    return {
      // 获取商品的页数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品数据
      goodslist: [],
      // 商品总数
      total: 0
    };
  },

  created() {
    this.getGoodsList();
  },

  methods: {
    /* 获取数据 */
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return;
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    /* 每页展示多少数据 */
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    /* 第几页 */
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getGoodsList();
    },
    //删除某项数据
    async deleteItem(id){
      const confirmReult=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(confirmReult);
        
        if(confirmReult!=='confirm'){
          return this.$message({
            type:'info',
            message:'取消删除'
          })
        }
        const {data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200){
          return
        }
        this.$message({
            type:'success',
            message:'删除成功'
          })
        this.getGoodsList()
    },
    // 跳转到添加页面
    dialogVisible(){
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style scoped>
.el-table {
  margin: 10px 0;
}
</style>