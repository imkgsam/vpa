import {
  ref
  // , computed
} from "vue";
import { tableDataDrag } from "../data";
// import { message } from "@/utils/message";
// import { templateRef } from "@vueuse/core";
import {
  clone
  //  useDark, useECharts
} from "@pureadmin/utils";

export function useColumns() {
  const dataList = ref(clone(tableDataDrag, true).splice(0, 4));

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id"
    },
    {
      label: "姓名",
      prop: "name"
    },
    {
      label: "日期",
      prop: "date"
    },
    {
      label: "echarts图表",
      slot: "echart",
      cellRenderer: () => {
        return <el-progress type="dashboard" percentage={40} color="red" />;
      }
    }
  ];

  // const { isDark } = useDark();

  // const theme = computed(() => (isDark.value ? "dark" : "light"));

  // dataList.value.forEach((_, i) => {

  //   const { setOptions } = useECharts(templateRef(`PieChartRef${i}`), {
  //     theme
  //   });
  //   setOptions(
  //     {
  //       tooltip: {
  //         trigger: "item",
  //         // 将 tooltip 控制在图表区域里
  //         confine: true
  //       },
  //       series: [
  //         {
  //           name: "Github信息",
  //           type: "gauge",
  //           // center: ["30%", "50%"],
  //           data: [
  //             { value: 30, name: "watchers" },
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       name: "click",
  //       callback: ({ data: { name, value } }) => {
  //         message(
  //           `您点击了第 ${i + 1} 行，图表标题为${name}，图表数据为：${value}`,
  //           {
  //             type: "success"
  //           }
  //         );
  //       }
  //     }
  //   );
  // });

  return {
    columns,
    dataList
  };
}
