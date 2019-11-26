<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤区域有 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabclicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cal">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item2" v-for="(item2,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headObj"
              :on-success="onSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add" class="btn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="preview" alt class="previewimg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      /* 添加商品信息 */
      addForm: {
        goods_name: "",
        goods_price: "0",
        goods_weight: "0",
        goods_number: "0",
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      /* 添加商品规则 */
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },
      /* 商品分类数据 */
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      manyData: [],
      onlyData: [],
      headObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      preview: "",
      dialogVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  methods: {
    /* 获取数据 */
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return;
      this.cateList = res.data;
      /*       console.log(this.cateList); */
    },
    /* 获取分类数据 */
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message({
          type: "error",
          message: "请选择分类"
        });
        return false;
      }
    },
    async tabclicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200) {
          return;
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyData = res.data;
        console.log(this.manyData);
        
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return;
        }
        this.onlyData = res.data;
      }
    },
    /* 浏览图片 */
    handlePreview(file) {
      this.dialogVisible = true;
      this.preview = file.response.data.url;
    },
    /* 删除图片 */
    handleRemove(file) {
      console.log(file);
      const fileStr = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(item => {
        return item.pic === fileStr;
      });
      this.addForm.pics.splice(index, 1);
    },
    /* 图片 */
    onSuccess(response) {
      const resp = { pic: response.data.tmp_path };
      this.addForm.pics.push(resp);
    },
    /* 编辑按钮 */
    add() {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) {
          return this.$message({
            type: "error",
            message: "请填写必要项"
          })
        }
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        console.log(this.manyData);
        
        this.manyData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        
        this.onlyData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        })
        form.attrs = this.addForm.attrs;
        const {data:res}=await this.$http.post('goods',form)
        if(res.meta.status!==201){
          return this.$message({
            type:'error',
            message:'添加商品失败'
          })
        }
        this.$message({
          type:'success',
          message:'添加商品成功'
        })
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewimg {
  width: 100%;
}
.btn {
  margin-top: 15px;
}
</style>