<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div slot="header" class="clearfix">
      <span>快速开始/快捷导航</span>
      <el-button icon="ibps-icon-add" type="primary" size="mini" @click="getFormData">添加</el-button>
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <div :style="{height:showHeight,width:'100%'}" class="nav-content">
        <el-tag
          v-for="(tag,i) in quickNavigationData"
          :key="i"
          closable
          :disable-transitions="false"
          @close="handleClose(i)"
        >
          <a :href="tag.url" :target="tag.target">{{ tag.label }}</a>
        </el-tag>
      </div>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" title="添加" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="名称:" prop="label">
          <el-input v-model="form.label" autocomplete="off" />
        </el-form-item>
        <el-form-item label="url地址:" prop="url">
          <el-input v-model="form.url" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新页面显示:" prop="target">
          <el-select v-model="form.target" placeholder="请选择" style="width:100%">
            <el-option label="是" value="_blank" />
            <el-option label="否" value="_self" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="el-dialog--center">
        <el-button type="primary" icon="el-icon-circle-save" @click="confirm">确 定</el-button>
        <el-button icon="ibps-icon-close" @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
