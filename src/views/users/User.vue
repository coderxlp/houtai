<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据区 -->
      <el-table :data="users" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="switchClick(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editClick(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteClick(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="角色分配" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="rolesClick(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClick">
      <!-- 主体 -->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改信息 -->
    <el-dialog title="修改信息" :visible.sync="editVisible" width="50%">
      <!-- 主体 -->
      <el-form
        :model="editInfo"
        :rules="editInfoRules"
        ref="editInfoRef"
        label-width="70px"
        @close="editClickVisible"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOkClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 角色分配 -->
    <el-dialog title="提示" :visible.sync="RolesdialogVisible" width="50%" @close='setRoleDialogClosed'>
      <div>
        <p>当前的用户：{{rolesInfo.username}}</p>
        <p>当前的角色：{{rolesInfo.role_name}}</p>
        <p>
          分配角色：
          <el-select v-model="rolesListStr" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    /* 邮箱正则 */
    const checkEmail = (rule, value, cd) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cd();
      }
      cd(new Error("请输入合法的邮箱"));
    };
    /* 手机号 */
    const checkMobile = (rule, value, cd) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cd();
      }
      cd(new Error("请输入正确的手机号"));
    };
    return {
      /* 页码 */
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      users: [],
      total: 0,
      /* 显示 */
      dialogVisible: false,
      editVisible: false,
      RolesdialogVisible: false,
      /* 添加 */
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      /* 修改 */
      editInfo: {},
      /* 添加规则 */
      addRules: {
        username: [
          { required: true, message: "请输用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      /* 修改规则 */
      editInfoRules: {
        email: [
          { required: true, message: "请输邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      /* 角色信息 */
      rolesInfo: {},
      /* 所有角色 */
      rolesList: [],
      rolesListStr: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return res.meta.msg;
      }
      this.users = res.data.users;
      this.total = res.data.total;
    },
    /* 每页显示几条 */
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    /* 第几页 */
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getUserList();
    },
    async switchClick(scope) {
      const { data: res } = await this.$http.put(
        `users/${scope.id}/state/${scope.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "是被"
        });
      }
    },
    addDialogClick() {
      this.$refs.addFormRef.resetFields();
    },
    validateClick() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) return;
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    /* 获取修改的用户 */
    async editClick(id) {
      const { data: res } = await this.$http.get("users/" + id);
      this.editInfo = res.data;
      this.editVisible = true;
    },
    editClickVisible() {
      this.$refs.editInfoRef.resetFields();
    },
    editOkClick() {
      this.$refs.editInfoRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editInfo.id,
          {
            email: this.editInfo.email,
            mobile: this.editInfo.mobile
          }
        );
        if (res.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "修改失败"
          });
        }
        this.$message({
          type: "success",
          message: "修改成功"
        });
        this.editVisible = false;
        this.getUserList();
      });
    },
    async deleteClick(id) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err =>
        this.$message({
          type: "info",
          message: "已取消删除"
        })
      );
      if (res !== "confirm") {
        return;
      }

      this.$http.delete("users/" + id);
      this.$message({
        type: "success",
        message: "删除成功"
      });
      this.getUserList();
    },
    async rolesClick(roles) {
      this.rolesInfo = roles;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message({
          message: "获取失败",
          type: "info"
        });
      }
      this.rolesList = res.data;
      console.log(this.rolesList);

      this.RolesdialogVisible = true;
    },
    /* 修改角色 */
    async saveRoleInfo() {
      if (!this.rolesListStr) {
        return this.$message({
          type: "error",
          message: "请选择要分配的角色"
        });
      }
      const { data: res } = await this.$http.put(
        `users/${this.rolesInfo.id}/role`,{rid:this.rolesListStr}
      );
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "修改失败！"
        });
      }
      this.$message({
        type: "success",
        message: "修改成功！"
      });
      this.getUserList()
      this.RolesdialogVisible=false
    },
    /* 监听修改角色是否关闭 */
    setRoleDialogClosed(){
      this.rolesInfo={}
      this.rolesListStr=''
    }
  }
};
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}
</style>