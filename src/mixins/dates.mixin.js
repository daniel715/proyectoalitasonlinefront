export default {
  data: () => ({
    formatISODate: "YYYY-MM-DD"
  }),
  methods: {
    getCurrentTime() {
      return this.$moment().format("HH:mm");
    },
    getCurrentDate() {
      return this.$moment().format("YYYY-MM-DD");
    },
    // formatDate(value, formatIn = "DD/MM/YYYY") {
    //   console.log("formatendo fecha");
    //   return this.$moment(value).format(formatIn);
    //   /* let pieces = value.split("/");
    //     let day = pieces[0];
    //     let month = pieces[1];
    //     let year = pieces[2];
    //     let dateFormated = year +"-"+month+"-"+day
    //     console.log("fecha formateada", dateFormated)
    //     return dateFormated  */
    // },
    formatDate(value, formatIn = "DD/MM/YYYY") {
      console.log("formatendo fecha");
      return this.$moment(value, formatIn).format("YYYY-MM-DD");
    }
  },
  computed: {
    /**primer dia del mes */
    startOfMonth() {
      return this.$moment()
        .startOf("month")
        .format(this.formatISODate);
    },
    /**primer dia de la semana */
    startOfWeek() {
      return this.$moment()
        .startOf("week")
        .format(this.formatISODate);
    },
    /**ultimo dia del mes */
    endOfMonth() {
      return this.$moment()
        .endOf("month")
        .format(this.formatISODate);
    },
    /**fecha actual */
    currentDate() {
      let format = "";
      let formatDate = format === "" ? this.formatISODate : format;
      return this.$moment().format(formatDate);
    },
    /**hora actual */
    currentTime() {
      return this.$moment().format("HH:mm");
    }
  }
};
