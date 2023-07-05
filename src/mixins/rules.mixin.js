export default {
  data: () => ({
    rules: {
      /* required: value => (value.trim() && Boolean(value) || typeof value == Number) || "Campo requerido", */
      required: value => {
        /* console.log("typeof", typeof value); */
        if (typeof value === "string") {
          if (value.trim() && Boolean(value)) return true;
          else return "Campo requerido";
        } else {
          if (value && Boolean(value)) return true;
          else return "Campo requerido";
        }
      },
      emailTrim: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let tempVal = typeof value == "string" ? value.trim() : value;
        /* console.log("in email rule",tempVal,pattern); */
        return pattern.test(tempVal) || "Email no valido";
      },
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Email no valido";
      }
    }
  })
};
