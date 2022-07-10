const { createApp, ref, computed, onMounted, onBeforeUnmount, onUpdated } = Vue;
dayjs.extend(dayjs_plugin_relativeTime);

createApp({
  setup() {
    const product = ref({
      docCode: "",
      type: "off",
      code: "",
      properties: "",
      version: "",
      name: "",
      amt: "",
      price: "",
      age: "",
      date: dayjs().format("YYYY-MM-DD"),
    });

    const type = ref({
      veh: "ครุภัณฑ์ยานพาหนะและขนส่ง",
      kit: "ครุภัณฑ์งานบ้านงานครัว",
      com: "ครุภัณฑ์คอมพิวเตอร์",
      off: "ครุภัณฑ์สำนักงาน",
      med: "ครุภัณฑ์วิทยาศาสตร์การแพทย์",
      ads: "ครุภัณฑ์โฆษณาและเผยแพร่",
      elc: "ครุภัณฑ์ไฟฟ้าและวิทยุ",
      res: "อาคารเพื่อพักอาศัย",
      bld: "สิ่งปลูกสร้าง",
      ofb: "อาคารสำนักงาน",
      etc: "อาคารเพื่อประโยชน์อื่น",
    });

    const budgetType = ref({
      1: "เงินงบประมาณ(งบลงทุน)",
      2: "เงินนอกงบประมาณ",
      3: "เงินบริจาค/เงินช่วยเหลือ",
      4: "เงินบำรุง",
    });

    const how = ref({
      1: "ตกลงราคา",
      2: "สอบราคา",
      3: "ประกวดราคา",
      4: "วิธีพิเศษ",
      5: "รับบริจาค",
      6: "วิธีประกาศเชิญชวนทั่วไป",
      7: "วิธีคัดเลือก",
      8: "วิธีเฉพาะเจาะจง",
    });

    const page = ref("home");

    const dpMonth = computed(() => {
      return depre.value / 12;
    });

    const depre = computed(
      () =>
        Math.round(
          (product.value.price / product.value.age + Number.EPSILON) * 100
        ) / 100
    );

    const formatN = (n) => {
      return (Math.round((parseFloat(n) + Number.EPSILON) * 100) / 100)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const calc = computed(() => {
      const table = [];
      const firstPrice = product.value.price;
      let calPrice = product.value.price;

      calPrice -= dpMonth.value * duration.value;

      table.push({
        depre:
          Math.round((dpMonth.value * duration.value + Number.EPSILON) * 100) /
          100,
        leftPrice: Math.round((calPrice + Number.EPSILON) * 100) / 100,
      });

      while (calPrice > 1) {
        calPrice -= depre.value;

        table.push({
          depre:
            Math.round((firstPrice - calPrice + Number.EPSILON) * 100) / 100,
          leftPrice: Math.round((calPrice + Number.EPSILON) * 100) / 100,
        });

        if (calPrice < 1) {
          table.pop();
          table.push({
            depre: parseFloat(firstPrice - 1),
            leftPrice: parseFloat(1),
          });
        }
      }

      return table;
    });

    const store = () => {
      page.value = "print";
      const pd = JSON.stringify(product.value);
      localStorage.setItem("product", pd);
    };

    const duration = computed(() => {
      let date =
        dayjs("2022-09-30T16:00:00.000Z").format("M") -
        dayjs(product.value.date).format("M");

      if (date < 0) {
        date += 12;
      }

      return date;
    });

    const formatDate = (date) => {
      return dayjs(date).add("543", "year").format("DD/MM/YYYY");
    };

    const print = () => {
      const printContents = document.querySelector("#toJpg").innerHTML;

      document.title = `${type.value[product.value.type]} - ${
        product.value.code
      }`;
      document.body.innerHTML = printContents;
      window.print();
      window.location.reload();
    };

    const reset = () => {
      localStorage.removeItem("product");
      product.value = {
        docCode: "",
        type: "off",
        code: "",
        properties: "",
        version: "",
        name: "",
        amt: "",
        price: "",
        age: "",
        date: dayjs().format("YYYY-MM-DD"),
      };
    };

    onMounted(() => {
      const pd = JSON.parse(localStorage.getItem("product"));

      if (pd) {
        product.value = pd;
        console.log(product.value);
        page.value = "print";
      }
    });

    onUpdated(() => {
      if (page.value === "print") {
        document.body.style.backgroundColor = "white";
        document.querySelector(".container").style.maxWidth = "none";
      } else {
        document.body.style.backgroundColor = "#e7e9eb";
      }
    });

    onBeforeUnmount(() => {
      localStorage.removeItem("product");
    });

    return {
      product,
      depre,
      page,
      calc,
      duration,
      how,
      type,
      budgetType,
      reset,
      store,
      print,
      formatN,
      formatDate,
    };
  },
}).mount("#app");
