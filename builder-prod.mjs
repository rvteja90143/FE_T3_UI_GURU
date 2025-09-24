import Fs from "fs-extra";
import concat from "concat";

const builder = async () => {
  const allJS = [
    "./dist/eshopus/polyfills.js",
    "./dist/eshopus/main.js", 
    "./dist/eshopus/runtime.js",
    "./styles_builder_web_prod.js"
  ];
  const allCss = [
    "./dist/eshopus/styles.css",
    "src/assets/css/widgetBootstrap.css"
  ];
  await Fs.ensureDir("./elements");
  await concat(allJS, "./elements/app-element-redesign-prod.js");
  await concat(allCss, "./elements/app-element-redesign-prod.css");
};

builder();