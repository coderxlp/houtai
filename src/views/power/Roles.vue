<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限权管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['rowBorder-bottom',i1===0?'rowBorder-top':'','vcontent']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag closable @close="ontag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级 -->
              <el-col :span="19">
                <el-row
                  :class="[i2===0?'':'rowBorder-top','vcontent']"
                  v-for="(itme2,i2) in item1.children"
                  :key="itme2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="ontag(scope.row,itme2.id)"
                    >{{itme2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="itme3 in itme2.children"
                      :key="itme3.id"
                      closable
                      @close="ontag(scope.row,itme3.id)"
                    >{{itme3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog title="提示" :visible.sync="SetRightDialogVisible" width="50%" @close='setRightDialogClosed'>
      <el-tree :data="setRightList"
               :props="treeProps" 
               show-checkbox 
               default-expand-all 
               node-key='id'
               :default-checked-keys='defaulArr'
               
               ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      SetRightDialogVisible:false,
      setRightList:[],
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      defaulArr:[],
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return;
      this.rolesList = res.data;
    },
    async ontag(rowId, id) {
      const data = await this.$confirm(
        "此操作将永久删除该限权, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (data !== "confirm") {
        return this.$message({
          type: "info",
          message: "取消删除！"
        });
      }
      this.$message({
        type: "success",
        message: "删除成功！"
      });
      const { data: res } = await this.$http.delete(
        `roles/${rowId.id}/rights/${id}`
      );
      if (res.meta.status !== 200) {
        returnthis.$message({
          type: "info",
          message: "删除失败！"
        });
      }
      rowId.children = res.data;
    },
    /* 展示分配权 */
    async showSetRightDialog(role) {
      this.roleId=role.id
      const {data:res}=await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        return this.$message({
          type:'error',
          message:'获取失败'
        })
      }
      this.setRightList=res.data
      this.getLeafKeys(role,this.defaulArr)
      this.SetRightDialogVisible=true
    },
    /* 获取已经选择的 */
    getLeafKeys(node,arr){
      if(!node.children){
       return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafKeys(element,arr)
      });
    },
    /* 监听权限对话框的关闭 */
    setRightDialogClosed(){
      this.defaulArr=[]
    },
    async rolesClick(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),
      this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
     
      if(res.meta.status!==200){
        return this.$message({
          type:'error',
          message:'失败'
        })}
         
      this.$message({
        type:'success',
          message:'成功'
      })
      
      this.getRolesList()
      this.SetRightDialogVisible=false
    },
    
    
  }
};
</script>

<style>
.el-tag {
  margin: 7px;
}
.rowBorder-top {
  border-top: 1px solid #eee;
}
.rowBorder-bottom {
  border-bottom: 1px solid #eee;
}
.vcontent {
  display: flex;
  align-items: center;
}
</style>