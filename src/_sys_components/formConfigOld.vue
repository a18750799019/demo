<template>
  <div class="__sysFrom">
    <div class="formTitle" v-if="!noHeader">
      <span class="text">{{title}}&nbsp;</span>
      <div class="optPanel">
        <el-button 
          v-for="(item,d) in optBtns"
          :key="d"
         :type="item.type" size="mini">{{item.name}}</el-button>
      </div>
    </div>
    <div class="searchPanel" v-if="!noSearch">
      <slot name="search_before"></slot>
      <span class="searchItem" v-for="(item,x) in searchBtns" :key="x">
        <!-- 文本框 -->
        <template v-if="item.type=='text'">
          <span class="itemTitle">{{item.name}}</span>：
          <input class="searchInput" />
        </template>
      </span>
      <slot name="search_after"></slot>
      <slot name="search_btn_before"></slot>
      <el-button v-if="!noSearchClickBtn" plain type="primary" class="searchBtn" size="mini">查询</el-button>
      <slot name="search_btn_after"></slot>
    </div>
    <div class="formTable" :style="formStyle">
        <el-table
          class="formTableColumn"
          v-loading="loading"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          :data="perPageDatas" border 
          :header-cell-style="{background:'#E4F1FF',color:'#606266',padding:'0px'}"
          :header-row-style="{height:'32px'}"
          :row-style="{height:'32px'}"
          :cell-style="{padding:'0px'}">
            <el-table-column v-if="isCheckbox" type="selection" width="55"></el-table-column>
            <el-table-column  align="center" v-if="isIndex" type="index" label="序号" idth="50" width="55">
              <template slot-scope="scope">
                <div v-text="(currentPage-1)* pageSize + scope.$index+1"></div>
              </template>
            </el-table-column>
            <el-table-column 
              v-for="(item, i) in headerColumnsDealAfter"
              :key="i"
              :align="item.align"
              :fixed="item.fixed"
              :prop="item.key"  
              :width="item.width"
              :label="item.value"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div v-if="item.key ==''">
                    <el-button v-for="(btn,index) in item.operate" type="text" size="small" :key="index"
                               :style="btn.style" @click="btnHandle(scope.row,btn.type)">
                        {{btn.name}}
                    </el-button>
                </div>
                <div v-if="item.key !==''">
                  {{scope.row[item.key]}}
                </div>
              </template>
            </el-table-column>
            <!-- 扩展列 -->
            <el-table-column 
              :key="ext.label+g" 
              :align="ext.align" 
              :width="ext.width" 
              :label="ext.label" 
              v-for="(ext,g) in extendColumns"
            >
              <template slot-scope="scope">
                <component :is="ext.content(scope)"></component>
              </template>
            </el-table-column>
          <slot name="table_column"></slot>
      </el-table>
      
    </div>
    <el-pagination
      class="elPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :pager-count="pagerCount"
      :page-sizes="[10, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, pager, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>

export default {
  props:{
    // title:{
    //   type: String,
    //   default:"表单配置"
    // },
    // searchBtns:{ //搜索按钮
    //   type: Array,
    //   default:[]
    // },
    // optBtns:{  //增删改查
    //   type: Array,
    //   default:()=>{
    //     return []
    //   }
    // },
    tableData:{ //数据项
      type: Array,
      default:()=>{ return [] }
    },
    // loading:{ //是否加载
    //   type: Boolean,
    //   default: false
    // },
    // headerColumns:{
    //   type: Array,
    //   default:[]
    // },
    // total: 0,
    // isIndex: {
    //   default:true
    // }
  tableConf: { //配置项
    type: Object,
    required: true
  }
  },
  data(){
    return {
      formStyle:{
        height:"calc(100% - 100px)"
      },
      title:"",
      loading: false,
      optBtns:[],
      searchBtns:[],
      currentPage: 1,
      pagerCount: 5,
      pageSize: 10,
      total:0,
      perPageDatas: [],
      headerColumnsDealAfter: [] ,//数据处理后
      isIndex: true,
      isCheckbox: false,
      noSearch: false, //不需要搜索面板
      noHeader:false,
      noSearchClickBtn:false,
      searchRows: 1, //搜索面板的行数
      extendColumns:[]
    }
  },
  mounted(){
    this.initData()
  },
  watch:{
    tableData(){
      this.dealHeadColumn();
      this.perPageDatas = this.tableData;
    },
    tableConf: {
      handler(){
        this.initData();
      },
      deep: true
    }
  },
  methods:{
    btnHandle(row, type) {
      this.$emit("operateHandle", row, type)
    },
    dealHeadColumn(){
      let _res = [];
      for (let x = 0; x < this.tableConf.headerColumns.length; x++) {
        const element = this.tableConf.headerColumns[x];
        _res.push(Object.assign({
          fixed: false,
        },this.tableConf.style, element))
      }
      this.headerColumnsDealAfter = _res;
    },
    initData(){
      this.total = this.tableConf.total;
      this.pageSize = this.tableConf.pageSize? this.tableConf.pageSize: 10
      this.currentPage = this.tableConf.currentPage?this.tableConf.currentPage:1
      this.title = this.tableConf.title;
      this.searchBtns = this.tableConf.searchBtns;
      this.optBtns = this.tableConf.optBtns;
      this.isIndex = this.tableConf.isIndex ?  this.tableConf.isIndex: true
      this.isCheckbox = this.tableConf.isCheckbox;
      this.loading = this.tableConf.loading;
      this.noSearch = this.tableConf.noSearch;
      this.noSearchClickBtn = this.tableConf.noSearchClickBtn;
      this.noHeader = this.tableConf.noHeader;
      this.searchRows = 1;
      if(this.noSearch) {
        this.formStyle = { height: 'calc(100% - 65px)'}
      } else {
        //待优化 面板溢出问题处理
        this.formStyle = { height: `calc(100% - (${65+this.searchRows*35})px)`} 
      }
      if(this.tableConf.formStyle) {
        this.formStyle = this.tableConf.formStyle;
      }
      this.extendColumns = this.tableConf.extendColumns?this.tableConf.extendColumns:[]
      if(this.tableData.length==0) {
         this.dealHeadColumn();
      }
    },
    handleSizeChange(num){
      this.currentPage = 1;
      this.pageSize=num;
      this.$emit("handleSizePageChange", this.currentPage, num);
    },
    handleCurrentChange(num){
      this.currentPage = num;
      this.$emit("handleSizePageChange", this.currentPage, this.pageSize)
    }
  }
}
</script>
<style lang="scss" scoped>
.__sysFrom{
  background: #fff;
  height: calc(100% - 20px);
  padding:10px 0;
  .formTitle{
    border-bottom: 2px solid #197eac;
    .text{
      display: inline-block;
      margin:0 0 10px 10px;
    }
    .optPanel{
      float: right;
      margin: -4px 10px 0 0;
    }
  }
  .searchPanel{
    margin:7px 4px;
    .searchItem {
      margin:0 5px;
      input{
        text-indent: 5px;
        font-size: 16px;
        padding:3px;
        border: 1px solid #c3c3c3;
        width: 75px;
      }
    }
    // .searchInput{
    //   height: 35px;
    // }
  }
  .formTable .formTableColumn{
    height: 100%;
    width: 100%;
    margin-top: 12px;
  }
  .elPagination{
    margin-top: 2px;
    text-align: center;
  }
}
::v-deep .el-table--scrollable-x .el-table__body-wrapper{
  height: calc(100% - 48px);
}
</style>
