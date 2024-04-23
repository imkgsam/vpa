<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { detailFormRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { useHook } from "../utils/hook";
import { useDetail } from "@/helpers/hooks/useDetailHook";

import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Share,
  Setting
} from "@element-plus/icons-vue";
import { ItemAPI } from "@/api/system";
import { Item } from "@/store/modules/types";

const {
  categoriesOptions,
  ItemTypeOptions,
  attributeOptions,
  usePublicStoreHook,
  handleItemSubmit,
  openVariantDialog,
  allProducibleItems,
  moldTypeOptions
} = useHook();

onBeforeMount(async () => {
  const params = getParameter;
  console.log("in onBeforeMount", params);
  if (params?.id) {
    const { data } = await ItemAPI.detail(params.id as string);
    if (data) {
      newFormInline.value = data;
      ops.value = "update";
    }
  }
});

const ops = ref("create");

const { getParameter, closeTagAndGoTo } = useDetail();

const newFormInline = ref({
  _id: undefined,
  code: "",
  alias: "",
  category: undefined,
  etype: "",
  meta: {
    enabled: undefined,
    canBeStocked: undefined,
    canBeSold: undefined,
    canBePurchased: undefined,
    canBeProduced: undefined,
    canBeRented: undefined,
    hasVariants: undefined,
    isVariantOf: undefined,
    attributeTags: []
  },
  attributes: [],
  mold: {
    maxGroutingTimes: null,
    warningThreadhold: null,
    product: null,
    mtype: ""
  }
} as Item);

const ruleFormRef = ref();

const deleteRow = (index: number) => {
  newFormInline.value?.attributes.splice(index, 1);
};

const onAddItem = () => {
  newFormInline.value?.attributes.push({
    attribute: null,
    options: []
  });
};
</script>

<template>
  <div>
    <!-- 顶部tab links -->
    <div class="bg-bg_color w-full mb-5">
      <el-button-group>
        <el-button class="!text-left !p-5">
          <IconifyIconOnline
            icon="streamline-emojis:beaming-face-with-smiling-eyes"
            class="ml-1"
            width="30"
          />
          <div class="inline-block ml-1 mr-10">
            <span class="block"> 0 </span>
            <span class="block"> 在手 </span>
          </div>
        </el-button>
        <el-button class="!text-left !p-5">
          <IconifyIconOnline
            icon="streamline-emojis:beaming-face-with-smiling-eyes"
            class="ml-1"
            width="30"
          />
          <div class="inline-block ml-1 mr-10">
            <span class="block"> 0 </span>
            <span class="block"> 在手 </span>
          </div>
        </el-button>
      </el-button-group>
      <div class="float-right block">
        <el-dropdown trigger="click" class="!align-middle float-right m-a">
          <el-button :icon="Setting" plain text> 操作 </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-button
                  class="reset-margin"
                  link
                  type="warning"
                  @click="openVariantDialog({ _id: newFormInline._id })"
                >
                  查看变体
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="reset-margin" link> 停用 </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button class="reset-margin" link type="danger">
                  删除
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button
          class="float-right m-a"
          text
          @click="handleItemSubmit(newFormInline, ruleFormRef, ops)"
          >提交
        </el-button>
      </div>
    </div>

    <!-- 主体部分 -->
    <div class="main bg-bg_color w-[99/100] p-8">
      <el-form
        ref="ruleFormRef"
        :model="newFormInline"
        :rules="detailFormRules"
        label-width="100px"
      >
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="产品型号" prop="code">
              <el-input
                v-model="newFormInline.code"
                clearable
                placeholder="请输入产品型号"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="内部型号" prop="alias">
              <el-input
                v-model="newFormInline.alias"
                clearable
                placeholder="请输入内部型号"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" class="my-5">
            <el-checkbox
              v-model="newFormInline.meta.enabled"
              label="是否已启用"
              size="small"
            />
            <el-checkbox
              v-model="newFormInline.meta.canBeStocked"
              label="是否可库存"
              size="small"
            />
            <el-checkbox
              v-model="newFormInline.meta.canBeSold"
              label="是否可出售"
              size="small"
            />
            <el-checkbox
              v-model="newFormInline.meta.canBePurchased"
              label="是否可采购"
              size="small"
            />
            <el-checkbox
              v-model="newFormInline.meta.canBeProduced"
              label="是否可生产"
              size="small"
            />
            <el-checkbox
              v-model="newFormInline.meta.canBeRented"
              label="是否可出租"
              size="small"
            />
          </el-col>
        </el-row>

        <div v-if="newFormInline?.meta?.isVariantOf">
          所属ITEM: {{ newFormInline?.meta?.isVariantOf }}
        </div>

        <el-tabs type="border-card" class="my-5">
          <el-tab-pane class="my-5" label="基本信息">
            <el-row :gutter="30">
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item label="所属类别" prop="category">
                  <el-cascader
                    v-model="newFormInline.category"
                    class="w-full"
                    collapse-tags
                    :options="categoriesOptions"
                    :props="{
                      value: '_id',
                      label: 'name',
                      emitPath: false,
                      checkStrictly: true
                    }"
                    clearable
                    filterable
                    placeholder="请选择所属类别"
                  >
                    <template #default="{ node, data }">
                      <span>{{ data.name }}</span>
                      <span v-if="!node.isLeaf">
                        ({{ data.children.length }})
                      </span>
                    </template>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item label="产品类型" prop="etype">
                  <el-select
                    v-model="newFormInline.etype"
                    placeholder="请选择产品类型"
                  >
                    <el-option
                      v-for="(itm, idx) in ItemTypeOptions"
                      :key="idx"
                      :label="itm.cn"
                      :value="itm.en"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane class="my-5" label="变体属性">
            <div>
              <el-table :data="newFormInline?.attributes" style="width: 80%">
                <el-table-column fixed label="属性">
                  <template #default="scope">
                    <el-form-item
                      label="属性名称"
                      :prop="'attributes.' + scope.$index + '.attribute'"
                      :rules="detailFormRules.attribute"
                    >
                      <el-select
                        v-model="
                          newFormInline.attributes[scope.$index].attribute
                        "
                      >
                        <el-option
                          v-for="(itm, idx) in attributeOptions"
                          :key="idx"
                          :label="itm.name"
                          :value="itm._id"
                          :disabled="
                            newFormInline.attributes
                              .map(each => each.attribute)
                              .includes(itm._id)
                          "
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="attributes.options" label="选项">
                  <template #default="scope">
                    <el-form-item
                      label="属性可选值"
                      :prop="'attributes.' + scope.$index + '.options'"
                      :rules="detailFormRules.options2"
                    >
                      <el-select
                        v-model="newFormInline.attributes[scope.$index].options"
                        multiple
                        :disabled="
                          !newFormInline.attributes[scope.$index].attribute
                        "
                      >
                        <el-option
                          v-for="(
                            itm, idx
                          ) in usePublicStoreHook().getAttributeValuesByAttirbute(
                            newFormInline.attributes[scope.$index].attribute
                          )"
                          :key="idx"
                          :label="itm.name"
                          :value="itm._id"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="Operations"
                  width="300"
                  class-name="!text-right"
                >
                  <template #default="scope">
                    <el-button
                      :icon="Delete"
                      link
                      type="primary"
                      size="small"
                      @click.prevent="deleteRow(scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <el-button class="mt-4" @click="onAddItem"> Add Item </el-button>
            </div>
            <div />
          </el-tab-pane>
          <el-tab-pane
            v-if="newFormInline.etype === 'Mold'"
            class="my-5"
            label="模具属性"
          >
            <el-row :gutter="30">
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="最高注浆次数" prop="mold.maxGroutingTimes">
                  <el-input-number
                    v-model.number="newFormInline.mold.maxGroutingTimes"
                    clearable
                    :min="1"
                    placeholder="请输入最高注浆次数"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="预警阈值" prop="mold.warningThreadhold">
                  <el-input-number
                    v-model.number="newFormInline.mold.warningThreadhold"
                    clearable
                    :min="1"
                    placeholder="请输入注浆预警阈值"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="模具ITEM" prop="mold.product">
                  <el-select
                    v-model="newFormInline.mold.product"
                    placeholder="请选择产品SPU"
                    class="w-full"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in allProducibleItems"
                      :key="index"
                      :label="item.alias || item.code"
                      :value="item._id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="模具类型" prop="mold.mtype">
                  <el-select
                    v-model="newFormInline.mold.mtype"
                    placeholder="请选择产品SPU"
                    class="w-full"
                    clearable
                  >
                    <el-option
                      v-for="(itm, idx) in moldTypeOptions"
                      :key="idx"
                      :label="itm.cn"
                      :value="itm.en"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            v-if="newFormInline.meta.canBeStocked"
            class="my-5"
            label="库存"
          >
            库存
          </el-tab-pane>
          <el-tab-pane
            v-if="newFormInline.meta.canBeProduced"
            class="my-5"
            label="生产"
          >
            生产
          </el-tab-pane>
          <el-tab-pane
            v-if="newFormInline.meta.canBePurchased"
            class="my-5"
            label="采购"
          >
            采购
          </el-tab-pane>
          <el-tab-pane
            v-if="newFormInline.meta.canBeSold"
            class="my-5"
            label="销售"
            >销售</el-tab-pane
          >
          <el-tab-pane
            v-if="newFormInline.meta.canBeRented"
            class="my-5"
            label="租赁"
            >租赁</el-tab-pane
          >
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>
