<template>
  <div class="__sysFrom">
    <slot name="slot_table_head"></slot>
    <div v-if="tableConf.treeObj && tableConf.treeObj.state" class="__dsFormLeft __dsFormTree">
      <slot name="tree_header" />
      <el-tree
        ref="dsTreeForm"
        :props="tableConf.treeObj.props"
        :data="tableConf.treeObj.data"
        :node-key="tableConf.treeObj.nodeKey"
        :highlight-current="true"
        current-node-key
        :default-expanded-keys="tableConf.treeObj.defaultExpandedKeys"
        @current-change="changeTreeCurrent"
        :default-expand-all="tableConf.treeObj.expandAll">
      </el-tree>
      <slot name="tree_footer" />
    </div>
    <div class="__dsFormRight" :class="{'width100':!tableConf.treeObj.state}">
      <div class="formTitle" v-if="!noHeader">
        <span class="text">{{title}}&nbsp;</span>
        <div class="optPanel">
          <el-button 
            v-for="(item,d) in optBtns"
            :key="d"
            :class="item.calssName?item.calssName :''"
            @click="handlerOptBtns(item)"
          :type="item.btnType" size="mini">{{item.name}}</el-button>
        </div>
      </div>
      <div class="searchPanel" v-if="!noSearch">
        <slot name="search_before"></slot>
        <el-form :label-width="searchlabelWidth" :inline="true" :model="searchParams" class="inline-block el-search-form vertical-align-top">
          <el-form-item class="elFormItem" :label="item.value" v-for="(item,x) in searchBtns" :key="x">
            <el-date-picker
              v-if="item.type=='datetime'"
              v-model="searchParams[item.key]"
              type="datetime"
              :placeholder="item.placeholder">
            </el-date-picker>
            <el-date-picker
              v-if="item.type=='date'"
              v-model="searchParams[item.key]"
              type="date"
              :placeholder="item.placeholder">
            </el-date-picker>
            <el-time-picker
              v-if="item.type=='time'"
              v-model="searchParams[item.key]"
              type="time"
              :placeholder="item.placeholder">
            </el-time-picker>
            <template v-if="item.type=='dateRange'">
              <el-time-picker 
                v-model="searchParams[`${item.key}Begin`]"
                :placeholder="item.placeholderBegin||item.placeholder" 
                v-if="item.subtype=='time'"></el-time-picker>
                <el-date-picker
                v-else
                v-model="searchParams[`${item.key}Begin`]"
                :type="item.subtype||'datetime'"
                :placeholder="item.placeholderBegin||item.placeholder" >
              </el-date-picker>
              -
              <el-time-picker 
                v-model="searchParams[`${item.key}Begin`]"
                :placeholder="item.placeholderBegin||item.placeholder" 
                v-if="item.subtype=='time'"></el-time-picker>
              <el-date-picker
                  v-else
                :type="item.subtype||'datetime'"
                v-model="searchParams[`${item.key}End`]"
                :placeholder="item.placeholderEnd||item.placeholder" >
              </el-date-picker>
            </template>
            <el-input v-if="item.type=='input'" @input="item.callback?item.callback($event, {searchParams,item}):noop" 
              clearable
              :style="item.style" 
              :placeholder="item.placeholder" 
              :type="item.type" v-model="searchParams[item.key]"></el-input>
            <el-select 
              clearable 
              v-if="item.type=='ddl'"
              @change="item.callback?item.callback($event, {searchParams,item}):noop" 
              :style="item.style" style="width:100%"  
              v-model="searchParams[item.key]" 
              :placeholder="item.placeholder">
              <template v-if="referenceObj[`${item.key}Search`] && referenceObj[`${item.key}Search`].list">
                <el-option :key="i" v-for="(r,i) in referenceObj[`${item.key}Search`].list" :label="r[item.DTEXT]" :value="r[item.DVALUE]"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
        <slot name="search_after"></slot>
        <slot name="search_btn_before"></slot>
        <el-button 
          v-if="!noSearchClickBtn" plain 
          type="primary" class="searchBtn margin-top-5" @click="handlerOptBtns({type:'search',isExp:tableConf.searchBtnExp==undefined?true:tableConf.searchBtnExp},searchParams)" size="mini">查询</el-button>
        <slot name="search_btn_after"></slot>
        <div class="inline-block float-right">
          <div class="optPanel">
            <el-button 
              class="optBtns4Search"
              v-for="(item,d) in optBtnsInSearch"
              :key="d"
              :class="item.calssName?item.calssName :''"
              @click="handlerOptBtns(item)"
            :type="item.btnType" size="mini">{{item.name}}</el-button>
          </div>
        </div>
      </div>
      <slot name="form_head_table"></slot>
      <div class="formTable" :style="formStyle">
          <el-table
            class="formTableColumn"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            :data="perPageDatas" border 
            :stripe="stripe"
            :header-cell-style="headerCellStyle"
            :header-row-style="{height:'32px'}"
            :row-style="{height:'32px'}"
            @selection-change="handlerSelection"
            :cell-style="{padding:'0px'}">
              <el-table-column v-if="isCheckbox" type="selection" width="40"></el-table-column>
              <el-table-column  align="center" v-if="!isNoIndex" type="index" label="序号" idth="50" width="55">
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
                      <el-button
                          v-if="btn.roleCb?btn.roleCb(scope.row):true"
                          v-for="(btn,index) in item.operate" type="text" size="small" :key="`${i}_${index}`"
                                :style="btn.style" @click="handlerOptBtns(btn,scope.row)">
                          {{btn.name}}
                      </el-button>
                  </div>
                  <div v-if="item.key !==''">
                    <template v-if="item.vhtml">
                      <span v-if="item.formatter" v-html="item.formatter(scope.row[item.key],scope.row)"></span>
                      <span v-else v-html="scope.row[item.key]"></span>
                    </template>
                    <template  v-else>
                      <span v-if="item.formatter">{{item.formatter(scope.row[item.key])}}</span>
                      <span v-else>{{scope.row[item.key]}}</span>
                    </template>
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
      <slot name="form_foot_table"></slot>
      <el-pagination
        :style="paginationStyle"
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
    <slot name="slot_table_foot"></slot>
  </div>
</template>
<script>
import { commonApi } from "@/api";
// import formEditConfig from "./formEditConfig";
export default {
  // components: { formEditConfig },
  props:{
    tableData:{ //数据项
      type: Array,
      default:()=>{ return [] }
    },
    tableConf: { //配置项
      type: Object,
      required: true
    }
  },
  data(){
    return {
      referenceObj:{},
      formStyle:{
        height:"calc(100% - 100px)"
      },
      headerCellStyle:{
        background:'#E4F1FF',
        color:'#606266',
        padding:'0px'
      },
      searchParams:{},
      paginationStyle:{},
      title:"",
      loading: false,
      optBtns:[],
      optBtnsInSearch:[],
      searchBtns:[],
      currentPage: 1,
      pagerCount: 5,
      pageSize: 10,
      total:0,
      stripe:false,
      perPageDatas: [],
      headerColumnsDealAfter: [] ,//数据处理后
      isNoIndex: true,
      isCheckbox: false,
      noSearch: false, //不需要搜索面板
      noHeader:false,
      noSearchClickBtn:false,
      searchRows: 1, //搜索面板的行数
      extendColumns:[],
      url:null,
      searchlabelWidth:"70px",
      method:"pagingGet",
      treeModelInner:""
    }
  },
  mounted(){
    this.initData();
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
    noop(){},
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
    async initData(){
      if(!this.tableConf.treeObj){
        this.tableConf.treeObj = { state: false };
      }
      this.total = this.tableConf.total;
      this.pageSize = this.tableConf.pageSize? this.tableConf.pageSize: 10
      this.currentPage = this.tableConf.currentPage?this.tableConf.currentPage:1
      this.title = this.tableConf.title;
      this.searchBtns = this.tableConf.searchBtns;
      this.searchlabelWidth =  this.tableConf.searchlabelWidth||this.searchlabelWidth
      this.optBtnsInSearch = this.tableConf.optBtnsInSearch;
      this.optBtns = this.tableConf.optBtns;
      this.stripe = this.tableConf.style && this.tableConf.style.stripe!=undefined?this.tableConf.style.stripe:false;
      this.isNoIndex = this.tableConf.isNoIndex; 
      this.isCheckbox = this.tableConf.isCheckbox;
      this.loading = this.tableConf.loading;
      this.noSearch = this.tableConf.noSearch;
      this.noSearchClickBtn = this.tableConf.noSearchClickBtn;
      this.noHeader = this.tableConf.noHeader;
      this.headerCellStyle = this.tableConf.headerCellStyle||this.headerCellStyle;
      this.searchRows = this.tableConf.searchRows? Number.parseInt(this.tableConf.searchRows): 1;
      if(this.noSearch) {
        this.formStyle = { height: 'calc(100% - 65px)'}
      } else {
        //待优化 面板溢出问题处理
        this.formStyle = { height: `calc(100% - (${65+this.searchRows*35})px)`} 
      }
      if(this.tableConf.formStyle) {
        this.formStyle = this.tableConf.formStyle;
      }
      if(this.tableConf.paginationStyle){
        this.paginationStyle = this.tableConf.paginationStyle;
      }
      this.extendColumns = this.tableConf.extendColumns?this.tableConf.extendColumns:[]
      if(this.tableData.length==0) {
         this.dealHeadColumn();
      }
      if(this.tableConf.method){
        this.method = this.tableConf.method;
      }
      if(this.tableConf.url){
        this.url = this.tableConf.url;
        if(this.tableConf.treeObj.state) {
          //树默认加载第一个节点
          this.$refs.dsTreeForm.setCurrentKey(this.$refs.dsTreeForm.data[0][this.tableConf.treeObj.nodeKey])
          this.dealApiRequest({[this.tableConf.treeObj.nodeKey]:this.$refs.dsTreeForm.data[0][this.tableConf.treeObj.nodeKey]});
        }else {
          this.dealApiRequest();
        }
      }
    },
    handleSizeChange(num){
      this.currentPage = 1;
      this.pageSize=num;
      this.dealApiRequest({
        [this.tableConf.initMappingObj.pageSize]:this.pageSize,
        [this.tableConf.initMappingObj.currentPage]:this.currentPage,
      })
    },
    handleCurrentChange(num){
      this.currentPage = num;
       this.dealApiRequest({
        [this.tableConf.initMappingObj.pageSize]:this.pageSize,
        [this.tableConf.initMappingObj.currentPage]:this.currentPage,
      })
    },
    handlerOptBtns(item,row){
      if(item.isExp){
        this.$emit("handlerOptBtns",item,row, this.treeModelInner);
      }else {
        switch(item.type){
          case "add":

          break;
          case "edit":

          break;
          case "delete":

          break;
          case "import":
          
          break;
          case "export":

          break;
        }
      }
    },
    changeTreeCurrent(data, node){
      this.treeModelInner = this.$refs.dsTreeForm.getCurrentKey();
      this.dealApiRequest({
        [this.tableConf.treeObj.nodeKey]:data[this.tableConf.treeObj.nodeKey]
      });
    },
    async dealApiRequest(params={}){
      if(this.tableConf.treeObj && this.tableConf.treeObj.state) {
        
      }
      this.loading = true;
      commonApi[this.method](this.url, {...this.tableConf.postData, ...params}).then(async _=>{

        //search reference
        this.tableConf.searchBtns.forEach(c=>{
          if(["ddl"].includes(c.type) && c.data  && !this.referenceObj[`${c.key}Search`]){
            this.referenceObj[`${c.key}Search`] = {};
            this.referenceObj[`${c.key}Search`].list = c.data;
            this.referenceObj[`${c.key}Search`].key = c.key;
            this.referenceObj[`${c.key}Search`].DTEXT = c.DTEXT;
            this.referenceObj[`${c.key}Search`].DVALUE = c.DVALUE;
          } else if(["ddl"].includes(c.type) && c.url && c.url.length && !this.referenceObj[`${c.key}Search`]){
            this.$set(this.referenceObj, `${c.key}Search`, {}); //设置响应式，必须
            commonApi[c.rtype||"pagingGet"](c.url).then(z=>{
              this.referenceObj[`${c.key}Search`] = {};
              this.referenceObj[`${c.key}Search`].list = z.rows;
              this.referenceObj[`${c.key}Search`].key = c.key;
              this.referenceObj[`${c.key}Search`].DTEXT = c.DTEXT;
              this.referenceObj[`${c.key}Search`].DVALUE = c.DVALUE;
            });
          }
        })

          if(this.tableConf.initSuccessCallback){
            this.loading =false;
            this.tableConf.initSuccessCallback(_, this.perPageDatas, this.tableConf)
          } else {
            if(this.tableConf.initMappingObj){
              this.total = _[this.tableConf.initMappingObj.total]
              for(let columns in this.headerColumnsDealAfter) {
                let c = this.headerColumnsDealAfter[columns];
                if(c.isReference){ 
                  if(c.url && !this.referenceObj[`${c.key}Arr`]){
                     await commonApi[c.type||"pagingGet"](c.url).then(z=>{
                        this.referenceObj[`${c.key}Arr`] = {};
                        this.referenceObj[`${c.key}Arr`].list = z.rows;
                        this.referenceObj[`${c.key}Arr`].key = c.key;
                        this.referenceObj[`${c.key}Arr`].DTEXT = c.DTEXT;
                        this.referenceObj[`${c.key}Arr`].DVALUE = c.DVALUE;
                      });
                  }else if(c.data && !this.referenceObj[`${c.key}Arr`]) {
                    this.referenceObj[`${c.key}Arr`] = {};
                    this.referenceObj[`${c.key}Arr`].list = c.data;
                    this.referenceObj[`${c.key}Arr`].key = c.key;
                    this.referenceObj[`${c.key}Arr`].DTEXT = c.DTEXT;
                    this.referenceObj[`${c.key}Arr`].DVALUE = c.DVALUE;
                  }
                }
              }
              
              this.loading = false;
              this.perPageDatas = _[this.tableConf.initMappingObj.list].filter(v=>{
                Object.keys(this.referenceObj).filter(r=>{
                  let _key = r.replace(/Arr/g,"");
                  if(v[_key]){
                    let _r2 = this.referenceObj[r].list.find(arrTemp=>arrTemp[this.referenceObj[r].DVALUE]==v[_key]);
                    v[_key]=_r2?_r2[this.referenceObj[r].DTEXT]:v[_key];
                  }
                })
                return v;
              })
              
            } else{
              this.perPageDatas =  _.rows;
              this.total = _.records;
            }
            
          }
        })
    },
    handlerSelection(selection){
      this.$emit("handlerSelection", selection);
    },
  }
}
</script>
<style lang="scss" scoped>
.__sysFrom{
  background: #fff;
  height: calc(100% - 20px);
  padding:10px 0;
  text-align: left;
  .__dsFormLeft{
    width: 200px;
    height: inherit;
    display: inline-block;
    vertical-align: top;
  }
  .__dsFormRight{
    height: inherit;
    width:calc(100% - 200px);
    display: inline-block;
  // text-align: center;
  }
  .width100{width:100%}
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
    .elFormItem{
      margin-bottom: 0;
    }
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
    .searchBtn,.optBtns4Search{
      margin-top:5px;
    }
  }
  .formTable .formTableColumn{
    height: 100%;
    width: 100%;
    margin-top: 12px;
    overflow-y: auto;
  }
  .elPagination{
    margin-top: 2px;
    text-align: center;
  }
}
::v-deep .el-table--scrollable-x .el-table__body-wrapper{
  height: calc(100% - 48px);
  overflow-y: auto;
}
</style>
