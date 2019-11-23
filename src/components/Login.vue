<template>
  <div class="login_bg">
    <div class="login_box">
      <!-- 头像 -->
      <div class="login_img_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="login"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="form_box"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /* 重置表单 */
    resetLogin() {
      this.$refs.login.resetFields();
    },
    loginClick() {
      this.$refs.login.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status != 200) return this.$message({
          message: '登录失败',
          type: 'erro'
        })
        /* 登录成功 */
         this.$message({
           message: '登录成功',
          type: 'success'
         })
         window.sessionStorage.setItem('token',res.data.token)
         this.$router.push('/home')
      });
    }
  }
};
</script>

<style scoped>
.login_bg {
  background: #2b4b6b;
  height: 100%;
  width: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 10px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: relative;
}
.login_img_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #ccc;

  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_img_box > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #ccc;
}
.form_box {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
.btn {
  display: flex;
  justify-content: center;
}
</style>