<template>
  <div class="container-component">
    <div ref="ibpsCrud" class="ibps-container-crud">
      <!-- 工具栏 -->
      <div
        v-if="toolbars || $slots.header"
        ref="ibpsCrudHeader"
        class="ibps-container-crud__header"
      >
        <div
          v-if="toolbars"
          :class="['ibps-toolbar--' +$ELEMENT.size]"
          class="ibps-toolbar"
        >
          <div class="header">
            <div class="buttons">
              <ibps-toolbar
                :actions="toolbars"
                :socpe="thatSocpe"
                @action-event="handleActionEvent"
              />
            </div>
            <div class="tools">
              <slot name="rightTools" />
              <el-dropdown v-if="showField" :hide-on-click="false" @visible-change="showFieldVisibleChange">
                <el-button icon="ibps-icon-eye">显示字段</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-checkbox
                      v-model="showFieldCheckAll"
                      :indeterminate="showFieldIndeterminate"
                      @change="handleShowFieldCheckAllChange"
                    >全选</el-checkbox>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <el-checkbox
                      v-model="indexRow"
                    >序号</el-checkbox>
                  </el-dropdown-item> -->
                  <el-checkbox-group v-model="checkedShowFields" @change="handleCheckedShowFieldChange">
                    <el-dropdown-item v-for="column in columns" :key="column.prop">
                      <el-checkbox :label="column.prop">{{ column.label }}</el-checkbox>
                    </el-dropdown-item>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
              <el-tooltip
                v-show="$utils.isNotEmpty(searchForm)"
                :content="showToolbar?$t('components.crud.collapse'):$t('components.crud.expand')"
              >
                <a class="expand" @click="handleCollapseExpandToolbar">
                  <i :class="showToolbar?'el-icon-caret-top':'el-icon-caret-bottom'" />
                </a>
              </el-tooltip>
            </div>
          </div>
          <div
            v-show="$utils.isNotEmpty(searchForm) && showToolbar"
            ref="toolbarBox"
            class="toolbar-box clear"
          >
            <template v-if="$slots.searchForm" ref="searchForm">
              <slot :loading="loading" name="searchForm" />
            </template>
            <template v-else>
              <search-form
                v-if="searchForm"
                ref="searchForm"
                :forms="searchForm.forms||[]"
                :size="searchForm.size"
                :fuzzy="searchForm.fuzzy"
                :inline="searchForm.inline"
                :label-width="searchForm.labelWidth"
                :item-width="searchForm.itemWidth"
                @search="handleActionEvent({key:'search'}, 'toolbar')"
              >
                <template v-for="item in searchFormSlot" :slot="item.slotName">
                  <slot :name="item.slotName" :item="item" />
                </template>
              </search-form>
            </template>
          </div>
          <slot name="header" />
        </div>
      </div>
      <div class="ibps-container-crud__body">
        <!--列表-->
        <el-table
          v-if="!isTree"
          ref="elTable"
          v-loading="loading"
          v-bind="options"
          :data="ibpsData"
          :height="tableHeight"
          @current-change="handleCurrentChange"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @cell-mouse-enter="handleCellMouseEnter"
          @cell-mouse-leave="handleCellMouseLeave"
          @cell-click="handleCellClick"
          @cell-dblclick="handleCellDblclick"
          @row-click="handleRowClick"
          @row-contextmenu="handleRowContextmenu"
          @row-dblclick="handleRowDblclick"
          @header-click="handleHeaderClick"
          @header-contextmenu="handleHeaderContextmenu"
        >
          <template slot="empty">
            <slot
              v-if="$slots.empty"
              name="empty"
            />
            <span
              v-else
            >
              <ibps-empty />
            </span>
          </template>
          <!--选择列 多选-->
          <el-table-column
            v-if="(selectionRow || selectionRow === '') && selectionType === 'checkbox'"
            v-bind="typeof selectionRow === 'Object'?selectionRow:null"
            :label="handleAttribute(selectionRow.label, '')"
            type="selection"
          />
          <!--选择列 单选-->
          <el-table-column
            v-if="(selectionRow || selectionRow === '') && selectionType === 'radio'"
            :label="selectionRow.label||''"
            :width="selectionRow.width||55"
          >
            <template slot-scope="scope">
              <el-radio v-model="selectionRadio" :label="scope.row[pkKey]">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column
            v-if="indexRow || indexRow === ''"
            v-bind="typeof indexRow === 'Object'?indexRow:null"
            :label="handleAttribute(indexRow.label, $t('components.crud.index'))"
            :width="handleAttribute(indexRow.label, '50px')"
            type="index"
          />
          <slot name="prepend-column" />
          <template v-for="(column, index) in columns">
            <el-table-column
              v-if="!showField || showField && showFields.indexOf(column.prop) > -1"
              :key="index"
              :prop="handleAttribute(column.prop, null)"
              :label="handleAttribute(column.label, '')"
              v-bind="column"
            >
              <template slot-scope="scope">
                <!--时间格式-->
                <span v-if="column.dateFormat" class="ibps-table-column">
                  {{ scope.row[column.prop] | dateFormat(column.dateFormat,column.origDateFormat) }}
                </span>
                <!--通用过滤器-->
                <span v-else-if="column.filter" class="ibps-table-column">
                  {{ handleColumnFilter(column.filter,scope.row[column.prop]) }}
                </span>
                <!-- 下拉组件-->
                <span v-else-if="column.options" class="ibps-table-column">
                  <!--stringArray 字符串类型的数组,逗号分隔-->
                  <template v-if="column.dataType==='stringArray'">
                    <span
                      v-for="(value,i) in handleColumnDataConvert(scope.row[column.prop],column.separator)"
                      :key="i"
                    >
                      {{ handleColumnOptions('label',column.options,value,column) }}<template v-if="handleColumnDataConvert(scope.row[column.prop],column.separator).length-1 !==i">,</template>
                    </span>
                  </template>
                  <!--stringArray 字符串类型的数组-->
                  <template v-else-if="column.dataType==='objectList'">
                    <span v-for="(value,j) in scope.row[column.prop]" :key="j">
                      {{ value[column.tagLabel] }}
                    </span>
                  </template>
                  <span v-else>{{ handleColumnOptions('label',column.options,scope.row[column.prop]) }}</span>

                </span>
                <!-- tags组件-->
                <span v-else-if="column.tags" class="ibps-table-column">
                  <span v-if="$utils.isEmpty(scope.row[column.prop]) ">{{ column.defaultLabel||'' }}</span>
                  <!--stringArray 字符串类型的数组-->
                  <template v-else-if="column.dataType==='stringArray'">
                    <el-tag
                      v-for="(value,i) in handleColumnDataConvert(scope.row[column.prop],column.separator)"
                      :key="i"
                      :type="handleColumnOptions('type',column.tags,value,column)"
                    >
                      {{ handleColumnOptions('label',column.tags,value,column) }}
                    </el-tag>
                  </template>
                  <!--stringArray 字符串类型的数组-->
                  <template v-else-if="column.dataType==='objectList'">
                    <el-tag v-for="(value,j) in scope.row[column.prop]" :key="j">
                      {{ value[column.tagLabel] }}
                    </el-tag>
                  </template>
                  <template v-else>
                    <el-tag :type="handleColumnOptions('type',column.tags,scope.row[column.prop],column)">{{ handleColumnOptions('label',column.tags,scope.row[column.prop],column) }}</el-tag>
                  </template>
                </span>
                <!-- link组件-->
                <span v-else-if="column.link" class="ibps-table-column">
                  <el-link :type="column.type||'primary'" :underline="column.underline||false" @click="handleColumnLink(column,scope.row)">
                    {{ scope.row[column.prop] |removeHtmlTag }}
                  </el-link>
                  <!-- <a href="javascript:void(0)" class="table-column-link" >{{}}</a> -->
                </span>
                <!-- 自定义slot组件-->
                <span v-else-if="column.slotName" class="ibps-table-column">
                  <slot :name="column.slotName" :row="scope.row" :value="scope.row[column.prop]" :column="column" :$index="scope.$index" />
                </span>
                <!--自定义组件-->
                <render-custom-component
                  v-else-if="column.component && column.component.name"
                  v-model="scope.row[column.prop]"
                  :component-name="column.component.name"
                />
                <!--渲染组件-->
                <render-component
                  v-else-if="column.component && column.component.render"
                  :render-function="column.component.render"
                  :scope="scope"
                />
                <template v-else>
                  {{ column.formatter ? column.formatter(scope.row, scope.column, _get(scope.row, column.prop), scope.$index) : _get(scope.row, column.prop) }}
                </template>
              </template>
              <!--子列 -->
              <template v-if="column.children">
                <el-table-column
                  v-for="(column2, index2) in column.children"
                  :key="index2"
                  :label="handleAttribute(column2.title, '')"
                  :prop="handleAttribute(column2.key, null)"
                  v-bind="column2"
                >
                  <template slot-scope="scope">
                    <!--过滤器-->
                    <span v-if="column2.filter">
                      {{ handleColumnFilter(column2.filter,scope.row[column2.prop]) }}
                    </span>
                    <!-- 下拉组件-->
                    <span v-else-if="column2.options" class="table-column-options">
                      <span>{{ handleColumnOptions('label',column2.options,scope.row[column2.prop]) }}</span>
                    </span>
                    <!-- tags组件-->
                    <span v-else-if="column2.tags" class="table-column-tags">
                      <el-tag :type="handleTags('type',column2.tags,scope.row[column2.prop])">{{ handleTags('label',column2.tags,scope.row[column2.prop]) }}</el-tag>
                    </span>
                    <!-- link组件-->
                    <span v-else-if="column2.link">
                      <a href="javascript:void(0)" class="table-column-link" @click="handleColumnLink(column2,scope.row)">{{ scope.row[column2.prop] }}</a>
                    </span>
                    <span v-else-if="column2.slotName">
                      <slot :name="column2.slotName" :row="scope.row" :$index="scope.$index" />
                    </span>
                    <!--自定义组件-->
                    <render-custom-component
                      v-else-if="column2.component && column2.component.name"
                      v-model="scope.row[column2.prop]"
                      :component-name="column2.component.name"
                    />
                    <!--渲染组件-->
                    <render-component
                      v-else-if="column2.component && column2.component.render"
                      :render-function="column2.component.render"
                      :scope="scope"
                    />
                    <template v-else>{{ column2.formatter ? column2.formatter(scope.row, scope.column2, _get(scope.row, column2.prop), scope.$index) : _get(scope.row, column2.prop) }}</template>
                  </template>
                </el-table-column>
                <!-- end 子列-->
              </template>
            </el-table-column>
          </template>
          <!--操作列begin-->
          <el-table-column
            v-if="rowHandle"
            v-bind="rowHandle"
            :label="handleAttribute(rowHandle.columnHeader, $t('components.crud.manage'))"
            :width="handleAttribute(rowHandle.width, rowHandleDefaultWidth)"
            :fixed="handleAttribute(rowHandle.fixed, 'right')"
            :align="handleAttribute(rowHandle.align, 'center')"
          >
            <template slot-scope="scope">
              <el-dropdown v-if="hasRowHandleActions(thatSocpe,scope.row)">
                <ibps-icon name="chevron-circle-down" size="16" />
                <el-dropdown-menu slot="dropdown" class="table-dropdown-menu">
                  <ibps-toolbar
                    :actions="rowHandleActions"
                    :socpe="thatSocpe"
                    :data="scope.row"
                    position="manage"
                    @action-event="handleActionEvent"
                  />
                </el-dropdown-menu>
              </el-dropdown>
              <span>&nbsp;</span>
            </template>
          </el-table-column>
          <!--操作列end-->
        </el-table>
        <!--树形列表-->
        <ibps-tree-table
          v-else
          ref="elTable"
          v-loading="loading"
          v-bind="options"
          :height="tableHeight"
          :index-row="indexRow"
          :data="ibpsData"
          :columns="columns"
          :selection-row="selectionRow"
          @selection-change="handleSelectionChange"
        />

      </div>
      <!--分页 或底部 自定义底部-->
      <div
        v-if="isShowPagination"
        ref="ibpsCrudFooter"
        class="ibps-container-crud__footer"
      >
        <slot name="footer">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-count="pagination[pageCountKey]"
            :total="pagination[totalKey]"
            v-bind="paginationOptions"
            @size-change="handlePaginationSizeChange"
            @current-change="handlePaginationCurrentChange"
            @prev-click="handlePaginationPrevClick"
            @next-click="handlePaginationNextClick"
          >
            <template v-slot>
              <span class="el-pagination__total">{{ pageInfo }}</span>
            </template>
          </el-pagination>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import base from './mixin/base'
import handleRow from './mixin/handleRow'
import data from './mixin/data'
import search from './mixin/search'
import column from './mixin/column'
import pagination from './mixin/pagination'
import showField from './mixin/showField'
import utils from './mixin/utils'

import RenderComponent from './components/render-component.vue'
import RenderCustomComponent from './components/render-custom-component.vue'
import SearchForm from './components/search-form'
import IbpsTreeTable from '@/components/ibps-tree-table'

export default {
  name: 'ibps-crud',
  components: {
    RenderComponent,
    RenderCustomComponent,
    SearchForm,
    IbpsTreeTable
  },
  mixins: [
    base,
    data,
    search,
    column,
    handleRow,
    pagination,
    showField,
    utils
  ]
}
</script>
<style lang="scss" scoped>
  .table-dropdown-menu{
    &.el-popper[x-placement^="bottom"] {
      margin-top: -30px;
      padding: 5px 5px;
    }
    .popper__arrow {
      display: none;
    }
  }

  .ibps-table-column .el-tag+.el-tag {
    margin-left: 5px;
    margin-top: 5px;
  }

</style>

