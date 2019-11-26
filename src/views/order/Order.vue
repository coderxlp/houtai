<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- tab表格 -->
      <el-table :data="orderlist" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="200"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showparpessBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改弹框 -->
    <el-dialog title="提示" :visible.sync="editdialogVisible" width="50%" @close="addressDialog">
      <el-form :model="addRuleForm" :rules="addRules" ref="addruleForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader expand-trigger="hover" v-model="addRuleForm.address1" :options="citydata"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addRuleForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息弹框 -->
    <el-dialog title="物流进度" :visible.sync="dialogVisible" width="50%">
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in parpesslsit"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "./citydata";
export default {
  data() {
    return {
      //亲求参数
      queryInfo: {
        query: "",
        pagesize: 10,
        pagenum: 1
      },
      // 总数据
      total: 0,
      // 列表数据
      orderlist: [],
      editdialogVisible: false,
      addRuleForm: {
        address1: [],
        address2: ""
      },
      addRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      citydata,
      dialogVisible: false,
      parpesslsit: []
    };
  },
  created() {
    this.getOrderLsit();
  },
  methods: {
    async getOrderLsit() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取列表数据失败"
        });
      }
      this.orderlist = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderlist);
    },
    // 显示多少页触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderLsit();
    },
    //第几页
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderLsit();
    },
    //修改
    showBox() {
      this.editdialogVisible = true;
    },
    addressDialog() {
      this.$refs.addruleForm.resetFields();
    },
    async showparpessBox() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取信息失败"
        });
      }
      this.parpesslsit = res.data;
      console.log(this.parpesslsit);

      this.dialogVisible = true;
    }
  }
};
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>