// ==UserScript==
// @name         页面匹配工具箱
// @namespace    https://example.com
// @version      1.0
// @description  在页面匹配时弹出工具箱
// @match        https://openqa.oqa.prg2.suse.org/tests/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 定义要查找的文本
    const searchText = "Result: failed, finished";

    // 查找页面中的文本
    const pageText = document.body.textContent;

    // 如果页面中包含指定文本，创建工具箱浮窗
    if (pageText.includes(searchText)) {
        // 创建按钮元素
        const button = document.createElement("button");
        button.innerText = "显示工具箱";
        button.style.position = "fixed";
        button.style.top = "20%";
        button.style.right = "0";
        button.style.transform = "translateY(-50%)";
        button.style.zIndex = "9999";
        document.body.appendChild(button);

        button.addEventListener("click", toggleToolbox);
    }

    function toggleToolbox() {
        const toolbox = document.getElementById("toolbox");

        if (toolbox) {
            // 如果工具箱已存在，移除它
            toolbox.remove();
        } else {
            // 创建工具箱元素
            const toolbox = document.createElement("div");
            toolbox.id = "toolbox";
            toolbox.innerHTML = `
                <!-- 这里可以放置命令行界面和其他工具 -->
                <div id="command-line" contenteditable="true">openqa-clone-job --from http://openqa.suse.de --host  http://openqa.suse.de  12411245 --skip-download --skip-chained-deps  _GROUP_ID=0  BUILD=rfan1016 TEST=15sp4_all_mig_textmode HDD_1=autoyast-SLES-15-SP4-x86_64-textmode-GM-all-patterns-updated.qcow2 SCC_ADDONS=base,serverapp DESKTOP=textmode CASEDIR=https://github.com/rfan1/os-autoinst-distri-opensuse.git#sap_new_NW  --apikey xxx --apisecret xxx</div>
                <button id="copy-button">复制</button>
            `;
            document.body.appendChild(toolbox);

            // 添加样式和事件处理程序
            GM_addStyle(`
                #toolbox {
                    position: fixed;
                    top: 20%; /* 工具箱显示在右上方的 20% 处 */
                    right: 0;
                    height: 80%; /* 工具箱高度占据 80% 的屏幕高度 */
                    background: rgba(255, 255, 255, 0.8);
                    padding: 10px;
                    border: 1px solid #000;
                    transition: right 0.3s; /* 添加过渡动画 */
                }

                #command-line {
                    min-height: 100px; /* 设置文本框最小高度 */
                    border: 1px solid #ccc;
                    padding: 5px;
                }
            `);

            const copyButton = document.getElementById("copy-button");

            copyButton.addEventListener("click", function() {
                const commandLine = document.getElementById("command-line");
                const command = commandLine.textContent;
                // 在此处处理复制操作
                // 执行复制逻辑
                // ...
            });

            // 延迟触发过渡以确保浮窗已添加到DOM中
            setTimeout(() => {
                toolbox.style.right = "0"; // 显示工具箱
            }, 0);
        }
    }
})();
