const exec = require("child_process").execSync;
const fs = require("fs");
const axios = require("axios");
const AutoReplace = require("./AutoReplace");

async function changeFiele() {
    let response = await axios.get(process.env.REPOURL + process.env.SYNCURL);
    let content = response.data;
    content = await AutoReplace.inject(content);
    await fs.writeFileSync("./executeOnce.js", content, "utf8");
    console.log("替换变量完毕");
}

async function start() {
    console.log(`北京时间 (UTC+08)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}}`);
    if (!process.env.JD_COOKIE) {
        console.log("请填写 JD_COOKIE 后再继续");
		return;
    }
    if (!process.env.BNRE || !process.env.PHRE || !process.env.HPRE || !process.env.NECEURL) {
        console.log("请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号");
        return;
    }
    if (!process.env.SYNCURL) {
        console.log("请填写 SYNCURL 后再继续");
        return;
    }
    try {
        await changeFiele();
        await exec("node executeOnce.js", { stdio: "inherit" });
    } catch (e) {
        console.log("执行异常:" + e);
    }
    console.log("执行完毕");
}

start();
