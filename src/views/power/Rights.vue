<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" stripe  border>
        <el-table-column type='index'  ></el-table-column>
        <el-table-column prop="authName" label="权限" ></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">  
            <el-tag type='success' v-if="scope.row.level==='1'">一级</el-tag>
            <el-tag type='warning' v-else-if="scope.row.level==='2'">二级</el-tag>
            <el-tag type='danger' v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  naem: "Rights",
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      this.rightsList = res.data;
      if (res.meta.status !== 200) return;
      this.rightsList = res.data;
      console.log(this.rightsList);
    }
  }
};
</script>

<style>
</style>