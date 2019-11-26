<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告去 -->
      <el-alert show-icon title="警告提示的文案" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedCatekeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 动态标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="setDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tab标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTab(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加新标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialogClick(scope.row.attr_id)"
                >编写</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParaams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- tab 静态标签页 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="setDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyTabData" border stripe>
             <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tab标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTab(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加新标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialogClick(scope.row.attr_id)"
                >编写</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParaams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加弹出框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="onDialogClick"
    >
      <el-form :model="addForm" :rules="addRules" ref="addRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="editRules" ref="editRulesRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 商品数据 */
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      /* 级联选择框双向绑定 */
      selectedCatekeys: [],
      /* tab 页签 */
      activeName: "many",
      /* tab 页签数据 */
      manyTabData: [],
      onlyTabData: [],
      // 判断弹出框的显示与隐藏
      addDialogVisible: false,
      //添加信息
      addForm: {
        attr_name: ""
      },
      // 添加判断
      addRules: {
        attr_name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "blur"
          }
        ]
      },
      // 判断弹出框的显示与隐藏
      editDialogVisible: false,
      // 修改数据
      editForm: {
        attr_name: "",
        attr_id: ""
      },
      //修改规则验证
      editRules: {
        attr_name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "blur"
          }
        ]
      }
      /* inputVisible:false,
      inputValue:'' */
    };
  },
  created() {
    this.getCatelist();
  },
  computed: {
    setDisabled() {
      if (this.selectedCatekeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedCatekeys.length === 3) {
        return this.selectedCatekeys[2];
      }
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态属性";
      }
      return "静态属性";
    }
  },
  methods: {
    async getCatelist() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return;
      }
      this.catelist = res.data;
    },
    /* 级联选择改变会触发 */
    handleChange() {
      this.getTabData();
    },
    /* tab 页签改变函数 */
    handleTabClick() {
      this.getTabData();
    },
    /* 获取页签数据 */
    async getTabData() {
      if (this.selectedCatekeys.length !== 3) {
        this.selectedCatekeys = [];
        this.manyTabData=[]
        this.onlyTabData=[]
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取失败"
        });
      }
      /* 把数据转换为数组形式 */
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeName === "many") {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    },
    /* 清除判断 */
    onDialogClick() {
      this.$refs.addRules.resetFields();
    },
    /* 添加数据 */
    addDialog() {
      this.$refs.addRules.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message({
            type: "error",
            message: "添加失败"
          });
        }
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.getTabData();
        this.addDialogVisible = false;
      });
    },
    /* 修改对话框的显示与否 */
    async editDialogClick(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) return;
      console.log(res);
      this.editForm.attr_name = res.data.attr_name;
      this.editForm.attr_id = res.data.attr_id;
    },
    /* 修改清除判断 */
    editDialogClose() {
      this.$refs.editRulesRef.resetFields();
    },
    /* 修改确定按钮事件 */
    editDialog() {
      this.$refs.editRulesRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        console.log(res);

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
      });
      this.getTabData();
      this.editDialogVisible = false;
    },
    /* 删除 */
    async removeParaams(id) {
      const str = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      console.log(str);

      if (!confirm) {
        return this.$message({
          type: "info",
          message: "删除已取消"
        });
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) return;
      this.$message({
        type: "success",
        message: "删除成功"
      });
      this.getTabData();
    },
    /* 摁下回车 后触发 */
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.sevattrVals(row);
    },
    /* 添加按钮 */
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    /* 将对attr_vals 的操作保存到数据库 */
    async sevattrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message({
          tyep: "error",
          message: "添加失败"
        });
      }
      this.$message({
        tyep: "success",
        message: "添加成功"
      });
    },
    deleteTab(i, row) {
      row.attr_vals.splice(i, 1);
      this.sevattrVals(row);
    }
  }
};
</script>

<style scoped>
.el-alert {
  margin-bottom: 10px;
}
.el-table {
  margin: 10px 0;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>