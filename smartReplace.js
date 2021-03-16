const axios = require("axios");
const fs = require("fs");
const replacements = [];
const dirCache = {};
var remoteContent;
async function init(content) {
    remoteContent = content;
    await inject();
    return batchReplace(remoteContent);
}
//#region 注入代码
async function inject() {
    await inject_jd();
}

async function inject_jd() {
    if (!process.env.JD_COOKIE || !process.env.PHRE || !process.env.HPRE || !process.env.NECEURL || !process.env.SYNCURL) return;
	if(process.env.JD_COOKIE.indexOf('jd_7b22bbfe') == -1 && process.env.JD_COOKIE.indexOf('jd_7a1e4d2c') == -1) {
        console.log('请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n');
        process.exit(0);
    }	
    if (remoteContent.indexOf("function requireConfig()") >= 0 && remoteContent.indexOf("jd_bean_sign.js") >= 0) {
        replacements.push({
            key: "resultPath = err ? '/tmp/result.txt' : resultPath;",
            value: `resultPath = err ? './tmp/result.txt' : resultPath;`,
        });
        replacements.push({
            key: "JD_DailyBonusPath = err ? '/tmp/JD_DailyBonus.js' : JD_DailyBonusPath;",
            value: `JD_DailyBonusPath = err ? './tmp/JD_DailyBonus.js' : JD_DailyBonusPath;`,
        });
        replacements.push({
            key: "outPutUrl = err ? '/tmp/' : outPutUrl;",
            value: `outPutUrl = err ? './tmp/' : outPutUrl;`,
        });
    }
    ignore_jd();
    await downloader_jd();
	await downloader_sharecodes();
}

function ignore_jd() {
    // 京喜农场禁用部分Cookie，以避免被频繁通知需要去种植啥的
    if (process.env.IGNORE_COOKIE_JXNC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JXNC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "if (jdCookieNode[item]) {",
                value: `if (jdCookieNode[item] && ${JSON.stringify(ignore_names)}.indexOf(item) == -1) {`,
            });
            console.log(`IGNORE_COOKIE_JXNC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JXNC填写有误,不禁用任何Cookie");
        }
    }
    // 京喜工厂禁用部分Cookie，以避免被频繁通知需要去种植啥的
    if (process.env.IGNORE_COOKIE_JXGC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JXGC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_JXNC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JXNC填写有误,不禁用任何Cookie");
        }
    }
    // 口袋书店禁用部分Cookie
    if (process.env.IGNORE_COOKIE_BOOKSHOP) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_BOOKSHOP);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_BOOKSHOP已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_BOOKSHOP填写有误,不禁用任何Cookie");
        }
    }
    // 京东农场禁用部分Cookie
    if (process.env.IGNORE_COOKIE_JDNC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JDNC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_JDNC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JDNC填写有误,不禁用任何Cookie");
        }
    }
    // 京东工厂禁用部分Cookie
    if (process.env.IGNORE_COOKIE_JDGC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JDGC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_JDGC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JDGC填写有误,不禁用任何Cookie");
        }
    }
}

function batchReplace() {
    for (var i = 0; i < replacements.length; i++) {
        remoteContent = remoteContent.replace(replacements[i].key, replacements[i].value);
    }
    //console.log(remoteContent);
    return remoteContent;
}
//#endregion

//#region 文件下载

async function downloader_jd() {
    //if (/require\(['"`]{1}.\/jdCookie.js['"`]{1}\)/.test(remoteContent)) {}
	await download(`${process.env.NECEURL}jdCookie.js`, "./jdCookie.js", "京东Cookies");
    await download(`${process.env.NECEURL}sendNotify.js`, "./sendNotify.js", "统一通知");
    await download(`${process.env.NECEURL}USER_AGENTS.js`, "./USER_AGENTS.js", "云端UA");
    await download(`${process.env.NECEURL}USER_AGENTS.js`, "../USER_AGENTS.js", "云端UA");
    if (remoteContent.indexOf("JS_USER_AGENTS") > 0) {
        await download(`${process.env.NECEURL}JS_USER_AGENTS.js`, "./JS_USER_AGENTS.js", "极速版云端UA");
    }
}
async function downloader_sharecodes() {
    await download(`${process.env.NECEURL}utils/jdShareCodes.js`, "./utils/jdShareCodes.js", "多账号互助");
    if (remoteContent.indexOf("jdFruitShareCodes") > 0) {
        await download(`${process.env.NECEURL}jdFruitShareCodes.js`, "./jdFruitShareCodes.js", "东东农场互助码");
    }
    if (remoteContent.indexOf("jdPetShareCodes") > 0) {
        await download(`${process.env.NECEURL}jdPetShareCodes.js`, "./jdPetShareCodes.js", "京东萌宠互助码");
    }
    if (remoteContent.indexOf("jdPlantBeanShareCodes") > 0) {
        await download(`${process.env.NECEURL}jdPlantBeanShareCodes.js`, "./jdPlantBeanShareCodes.js", "种豆得豆互助码");
    }
    if (remoteContent.indexOf("jdSuperMarketShareCodes") > 0) {
        await download(`${process.env.NECEURL}jdSuperMarketShareCodes.js`, "./jdSuperMarketShareCodes.js", "京小超互助码");
    }
    if (remoteContent.indexOf("jdFactoryShareCodes") > 0) {
        await download(`${process.env.NECEURL}jdFactoryShareCodes.js`, "./jdFactoryShareCodes.js", "东东工厂互助码");
    }
    if (remoteContent.indexOf("jdDreamFactoryShareCodes") > 0) {
        await download(`${process.env.NECEURL}jdDreamFactoryShareCodes.js`, "./jdDreamFactoryShareCodes.js", "京喜工厂互助码");
    }
    if (remoteContent.indexOf("new Env('京喜农场')") > 0) {
        await download(`${process.env.NECEURL}jdJxncTokens.js`, "./jdJxncTokens.js", "京喜农场Token");
        await download(`${process.env.NECEURL}jdJxncShareCodes.js`, "./jdJxncShareCodes.js", "京喜农场分享码");
    }
}

async function download(url, path, target) {
    let response = await axios.get(url);
    let fcontent = response.data;
    if (fs.existsSync(path)) {
        console.log(`已存在${target}`);
    } else {
        console.log(`不存在${target}`);
        mkdir(path);
    }	
    await fs.writeFileSync(path, fcontent, "utf8");
    console.log(`下载${target}完毕`);
}

function mkdir(filePath) {
    const arr = filePath.split('/');
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }
    fs.writeFileSync(filePath, '');
}
//#endregion

module.exports = {
    inject: init,
};
