<script setup lang="ts">
import { ref, reactive, onMounted, toRaw, onBeforeMount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
import { Entity } from "@/store/modules/types";
import { merge, assign } from "lodash";
import { FormInstance } from "element-plus";

const ruleFormRef = ref<FormInstance>();
const { t } = useI18n();
defineOptions({
  name: "EntityBlock"
});
const editing = ref(false);
const loading = ref(false);
const props = defineProps(["entity"]);

const countries = [
  "Andorra/ 安道尔",
  "United Arab Emirates/ 阿联酋",
  "Afghanistan/ 阿富汗",
  "Antigua and Barbuda/ 安提瓜和巴布达",
  "Anguilla/ 安圭拉",
  "Albania/ 阿尔巴尼亚",
  "Armenia/ 亚美尼亚",
  "Angola/ 安哥拉",
  "Antarctica/ 南极洲",
  "Argentina/ 阿根廷",
  "American Samoa/ 美属萨摩亚",
  "Austria/ 奥地利",
  "Australia/ 澳大利亚",
  "Aruba/ 阿鲁巴",
  "Åland Islands/ 奥兰群岛",
  "Azerbaijan/ 阿塞拜疆",
  "Bosnia and Herzegovina/ 波黑",
  "Barbados/ 巴巴多斯",
  "Bangladesh/ 孟加拉",
  "Belgium/ 比利时",
  "Burkina Faso/ 布基纳法索",
  "Bulgaria/ 保加利亚",
  "Bahrain/ 巴林",
  "Burundi/ 布隆迪",
  "Benin/ 贝宁",
  "Saint Barthelemy/ 圣巴泰勒米岛",
  "Bermuda/ 百慕大",
  "Brunei Darussalam/ 文莱",
  "Bolivia (Plurinational State of)/ 玻利维亚",
  "Bonaire, Sint Eustatius and Saba/ 荷兰加勒比区",
  "Brazil/ 巴西",
  "Bahamas/ 巴哈马",
  "Bhutan/ 不丹",
  "Bouvet Island/ 布韦岛",
  "Botswana/ 博茨瓦纳",
  "Belarus/ 白俄罗斯",
  "Belize/ 伯利兹",
  "Canada/ 加拿大",
  "Cocos (Keeling) Islands/ 科科斯群岛",
  "Congo (the Democratic Republic of the)/ 刚果民主共和国",
  "Central African Republic/ 中非",
  "Congo/ 刚果共和国",
  "Switzerland/ 瑞士",
  "Cote d'Ivoire/ 科特迪瓦",
  "Cook Islands/ 库克群岛",
  "Chile/ 智利",
  "Cameroon/ 喀麦隆",
  "China/ 中国",
  "Colombia/ 哥伦比亚",
  "Costa Rica/ 哥斯达黎加",
  "Cuba/ 古巴",
  "Cabo Verde/ 佛得角",
  "Curacao/ 库拉索岛",
  "Christmas Island/ 圣诞岛",
  "Cyprus/ 塞浦路斯",
  "Czechia/ 捷克",
  "Germany/ 德国",
  "Djibouti/ 吉布提",
  "Denmark/ 丹麦",
  "Dominica/ 多米尼克",
  "Dominican Republic/ 多米尼加",
  "Algeria/ 阿尔及利亚",
  "Ecuador/ 厄瓜多尔",
  "Estonia/ 爱沙尼亚",
  "Egypt/ 埃及",
  "Western Sahara/ 西撒哈拉",
  "Eritrea/ 厄立特里亚",
  "Spain/ 西班牙",
  "Ethiopia/ 埃塞俄比亚",
  "Finland/ 芬兰",
  "Fiji/ 斐济",
  "Falkland Islands [Malvinas]/ 福克兰群岛",
  "Micronesia (Federated States of)/ 密克罗尼西亚联邦",
  "Faroe Islands/ 法罗群岛",
  "France/ 法国",
  "Gabon/ 加蓬",
  "United Kingdom of Great Britain and Northern Ireland/ 英国",
  "Grenada/ 格林纳达",
  "Georgia/ 格鲁吉亚",
  "French Guiana/ 法属圭亚那",
  "Guernsey/ 根西岛",
  "Ghana/ 加纳",
  "Gibraltar/ 直布罗陀",
  "Greenland/ 格陵兰",
  "Gambia/ 冈比亚",
  "Guinea/ 几内亚",
  "Guadeloupe/ 瓜德罗普",
  "Equatorial Guinea/ 赤道几内亚",
  "Greece/ 希腊",
  "South Georgia and the South Sandwich Islands/ 南乔治亚岛与南桑威奇群岛",
  "Guatemala/ 危地马拉",
  "Guam/ 关岛",
  "Guinea-Bissau/ 几内亚比绍",
  "Guyana/ 圭亚那",
  "Hong Kong/ 香港",
  "Heard Island and McDonald Islands/ 赫德岛和麦克唐纳群岛",
  "Honduras/ 洪都拉斯",
  "Croatia/ 克罗地亚",
  "Haiti/ 海地",
  "Hungary/ 匈牙利",
  "Indonesia/ 印尼",
  "Ireland/ 爱尔兰",
  "Israel/ 以色列",
  "Isle of Man/ 马恩岛",
  "India/ 印度",
  "British Indian Ocean Territory/ 英属印度洋领地",
  "Iraq/ 伊拉克",
  "Iran (Islamic Republic of)/ 伊朗",
  "Iceland/ 冰岛",
  "Italy/ 意大利",
  "Jersey/ 泽西岛",
  "Jamaica/ 牙买加",
  "Jordan/ 约旦",
  "Japan/ 日本",
  "Kenya/ 肯尼亚",
  "Kyrgyzstan/ 吉尔吉斯斯坦",
  "Cambodia/ 柬埔寨",
  "Kiribati/ 基里巴斯",
  "Comoros/ 科摩罗",
  "Saint Kitts and Nevis/ 圣基茨和尼维斯",
  "Korea (the Democratic People's Republic of)/ 朝鲜",
  "Korea (the Republic of)/ 韩国",
  "Kuwait/ 科威特",
  "Cayman Islands/ 开曼群岛",
  "Kazakhstan/ 哈萨克斯坦",
  "Lao People's Democratic Republic/ 老挝",
  "Lebanon/ 黎巴嫩",
  "Saint Lucia/ 圣卢西亚",
  "Liechtenstein/ 列支敦士登",
  "Sri Lanka/ 斯里兰卡",
  "Liberia/ 利比里亚",
  "Lesotho/ 莱索托",
  "Lithuania/ 立陶宛",
  "Luxembourg/ 卢森堡",
  "Latvia/ 拉脱维亚",
  "Libya/ 利比亚",
  "Morocco/ 摩洛哥",
  "Monaco/ 摩纳哥",
  "Moldova (the Republic of)/ 摩尔多瓦",
  "Montenegro/ 黑山",
  "Saint Martin (French part)/ 法属圣马丁",
  "Madagascar/ 马达加斯加",
  "Marshall Islands/ 马绍尔群岛",
  "North Macedonia/ 马其顿",
  "Mali/ 马里",
  "Myanmar/ 缅甸",
  "Mongolia/ 蒙古",
  "Macao/ 澳门",
  "Northern Mariana Islands/ 北马里亚纳群岛",
  "Martinique/ 马提尼克",
  "Mauritania/ 毛里塔尼亚",
  "Montserrat/ 蒙塞拉特岛",
  "Malta/ 马耳他",
  "Mauritius/ 毛里求斯",
  "Maldives/ 马尔代夫",
  "Malawi/ 马拉维",
  "Mexico/ 墨西哥",
  "Malaysia/ 马来西亚",
  "Mozambique/ 莫桑比克",
  "Namibia/ 纳米比亚",
  "New Caledonia/ 新喀里多尼亚",
  "Niger/ 尼日尔",
  "Norfolk Island/ 诺福克岛",
  "Nigeria/ 尼日利亚",
  "Nicaragua/ 尼加拉瓜",
  "Netherlands (Kingdom of the)/ 荷兰",
  "Norway/ 挪威",
  "Nepal/ 尼泊尔",
  "Nauru/ 瑙鲁",
  "Niue/ 纽埃",
  "New Zealand/ 新西兰",
  "Oman/ 阿曼",
  "Panama/ 巴拿马",
  "Peru/ 秘鲁",
  "French Polynesia/ 法属波利尼西亚",
  "Papua New Guinea/ 巴布亚新几内亚",
  "Philippines/ 菲律宾",
  "Pakistan/ 巴基斯坦",
  "Poland/ 波兰",
  "Saint Pierre and Miquelon/ 圣皮埃尔和密克隆群岛",
  "Pitcairn/ 皮特凯恩群岛",
  "Puerto Rico/ 波多黎各",
  "Palestine, State of/ 巴勒斯坦",
  "Portugal/ 葡萄牙",
  "Palau/ 帕劳",
  "Paraguay/ 巴拉圭",
  "Qatar/ 卡塔尔",
  "Reunion/ 留尼汪",
  "Romania/ 罗马尼亚",
  "Serbia/ 塞尔维亚",
  "Russian Federation/ 俄罗斯",
  "Rwanda/ 卢旺达",
  "Saudi Arabia/ 沙特阿拉伯",
  "Solomon Islands/ 所罗门群岛",
  "Seychelles/ 塞舌尔",
  "Sudan/ 苏丹",
  "Sweden/ 瑞典",
  "Singapore/ 新加坡",
  "Saint Helena, Ascension and Tristan da Cunha/ 圣赫勒拿岛",
  "Slovenia/ 斯洛文尼亚",
  "Svalbard and Jan Mayen/ 斯瓦尔巴群岛和扬马延岛",
  "Slovakia/ 斯洛伐克",
  "Sierra Leone/ 塞拉利昂",
  "San Marino/ 圣马力诺",
  "Senegal/ 塞内加尔",
  "Somalia/ 索马里",
  "Suriname/ 苏里南",
  "South Sudan/ 南苏丹",
  "Sao Tome and Principe/ 圣多美和普林西比",
  "El Salvador/ 萨尔瓦多",
  "Sint Maarten (Dutch part)/ 圣马丁岛",
  "Syrian Arab Republic/ 叙利亚",
  "Eswatini/ 斯威士兰",
  "Turks and Caicos Islands/ 特克斯和凯科斯群岛",
  "Chad/ 乍得",
  "French Southern Territories/ 法属南部领地",
  "Togo/ 多哥",
  "Thailand/ 泰国",
  "Tajikistan/ 塔吉克斯坦",
  "Tokelau/ 托克劳群岛",
  "Timor-Leste/ 东帝汶",
  "Turkmenistan/ 土库曼斯坦",
  "Tunisia/ 突尼斯",
  "Tonga/ 汤加",
  "Turkiye/ 土耳其",
  "Trinidad and Tobago/ 特立尼达和多巴哥",
  "Tuvalu/ 图瓦卢",
  "Taiwan (Province of China)/ 台湾",
  "Tanzania, the United Republic of/ 坦桑尼亚",
  "Ukraine/ 乌克兰",
  "Uganda/ 乌干达",
  "United States Minor Outlying Islands/ 美国本土外小岛屿",
  "United States of America/ 美国",
  "Uruguay/ 乌拉圭",
  "Uzbekistan/ 乌兹别克斯坦",
  "Holy See/ 梵蒂冈",
  "Saint Vincent and the Grenadines/ 圣文森特和格林纳丁斯",
  "Venezuela (Bolivarian Republic of)/ 委内瑞拉",
  "Virgin Islands (British)/ 英属维尔京群岛",
  "Virgin Islands (U.S.)/ 美属维尔京群岛",
  "Viet Nam/ 越南",
  "Vanuatu/ 瓦努阿图",
  "Wallis and Futuna/ 瓦利斯和富圖納群島",
  "Samoa/ 萨摩亚",
  "Yemen/ 也门",
  "Mayotte/ 马约特",
  "South Africa/ 南非",
  "Zambia/ 赞比亚",
  "Zimbabwe/ 津巴布韦"
];

var dataForm = reactive<Entity>({
  _id: "",
  name: "",
  alias: "",
  etype: "",
  scompany: {
    _id: "",
    name: "",
    alias: "",
    etype: ""
  },
  personal: {
    jobTitle: "",
    sex: null,
    birth: null
  },
  enterprise: {
    manager: "",
    foundedAt: null,
    taxNum: ""
  },
  common: {
    website: "",
    email: "",
    landline: "",
    mobilePhone: "",
    country: "",
    city: "",
    industry: "",
    internalNote: ""
  },
  socialMedias: []
});

onBeforeMount(() => {
  merge(dataForm, props.entity);
});

// watch(props.entity, () => {
//   merge(dataForm, props.entity)
// })

async function save() {
  if (!editing.value) {
    editing.value = !editing.value;
  } else {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      editing.value = !editing.value;
    }, 3000);
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

async function cancle(formEl: FormInstance | undefined) {
  resetForm(formEl);
  merge(dataForm, props.entity);
  editing.value = !editing.value;
}
</script>

<template>
  <div>
    <el-form ref="ruleFormRef" :model="dataForm">
      <el-row :gutter="25">
        <el-col v-motion :xz="24" :lg="12">
          <div>
            <el-divider>个人信息</el-divider>
            <el-form-item :label="t('label.fullName')">
              <!-- <el-input v-if="editing" :value="props.entity.name" v-model="dataForm.name" /> -->
              <span>{{ props.entity.name }}</span>
            </el-form-item>
            <el-form-item
              v-if="props.entity.etype === 'Person'"
              :label="t('label.sex')"
            >
              <el-radio-group
                v-model="dataForm.personal.sex"
                :value="props.entity.personal.sex"
                :disabled="!editing"
              >
                <el-radio label="Male">男性</el-radio>
                <el-radio label="Female">女性</el-radio>
                <el-radio label="Others">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="props.entity.etype === 'Person'"
              :label="t('label.birth')"
            >
              <!-- <span> {{ props.entity.personal.birth || "无" }}</span> -->
              <el-date-picker
                v-model="dataForm.personal.birth"
                :disabled="!editing"
                type="date"
                :placeholder="t('common.text.pickADate')"
              />
            </el-form-item>
            <el-form-item :label="t('label.pemail')">
              <el-input v-if="editing" v-model="dataForm.common.email" />
              <span v-else>{{ props.entity.common?.email || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.pwebsite')">
              <el-input v-if="editing" v-model="dataForm.common.website" />
              <span v-else>{{ props.entity.common?.website || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.plandline')">
              <el-input v-if="editing" v-model="dataForm.common.landline" />
              <span v-else>{{ props.entity.common?.landline || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.pmobilePhone')">
              <el-input v-if="editing" v-model="dataForm.common.mobilePhone" />
              <span v-else>{{ props.entity.common?.mobilePhone || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.incountry')">
              <el-select
                v-model="dataForm.common.country"
                filterable
                clearable
                placeholder="Select"
              >
                <el-option
                  v-for="(country, idx) in countries"
                  :key="idx"
                  :label="country + '' + idx"
                  :value="country"
                />
              </el-select>
              <span>{{ dataForm.common.country }} {{ countries.length }}</span>
            </el-form-item>
            <el-form-item :label="t('label.incity')">
              <el-input v-if="editing" v-model="dataForm.common.city" />
              <span v-else> {{ props.entity.common?.city || "无" }}</span>
            </el-form-item>
            <!-- <el-form-item :label="t('label.etype')">
              <el-radio-group v-model="props.entity.etype" disabled>
                <el-radio label="Person">个人</el-radio>
                <el-radio label="Company">公司</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </div>
        </el-col>
        <el-col v-motion :xz="24" :lg="12">
          <div>
            <el-divider>基本信息</el-divider>
            <el-form-item
              v-if="props.entity.scompany"
              :label="t('label.scompany')"
            >
              <span>{{ props.entity.scompany?.name }}</span>
              <!-- <el-input v-else :value="dataForm.scompany?.name" /> -->
            </el-form-item>
            <el-form-item
              v-if="props.entity.etype === 'Person'"
              :label="t('label.jobTitle')"
            >
              <!-- <el-input v-if="editing" v-model="dataForm.personal.jobTitle" /> -->
              <span>{{ props.entity.personal?.jobTitle || "无" }}</span>
            </el-form-item>
            <!-- <el-form-item :label="t('label.alias')">
              <el-input v-if="editing" v-model="dataForm.alias" />
              <span>{{ props.entity.alias || '无' }}</span>
            </el-form-item> -->
            <el-form-item :label="t('label.industry')">
              <span> {{ props.entity.common?.industry || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.verificationStatus')">
              <el-tag
                :type="props.entity.meta.verified ? 'success' : 'danger'"
                size="small"
              >
                {{
                  props.entity.meta.verified
                    ? t("label.verified")
                    : t("label.unverified")
                }}
              </el-tag>
            </el-form-item>
          </div>
        </el-col>
        <el-col v-motion :xs="24">
          <el-form-item class="flex right">
            <el-button
              v-if="editing"
              :loading="loading"
              type="default"
              @click="cancle(ruleFormRef)"
            >
              {{ "取消" }}
            </el-button>
            <el-button
              :loading="loading"
              :type="editing ? 'primary' : 'warning'"
              @click="save"
              >{{ editing ? "保存" : "修改" }}</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
