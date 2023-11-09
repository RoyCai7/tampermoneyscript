// ==UserScript==
// @name         页面匹配工具箱
// @namespace    https://example.com
// @version      1.2
// @description  在页面匹配时弹出工具箱
// @match        https://openqa.oqa.prg2.suse.org/tests/*
// @match        https://openqa.suse.de/tests/*
// @match        https://openqa.qam.suse.cz/tests/*
// @match        http://openqa.qam.suse.cz/tests/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    let toolboxVisible = false;

    // 获取JSON数据的URL（替换为实际的URL）
    const domain = window.location.hostname; // 获取当前域名
    const jobIdMatch = window.location.pathname.match(/tests\/(\d+)/); // 从路径中提取jobId

    if (jobIdMatch) {
        const jobId = jobIdMatch[1]; // 提取的数字job ID

        const jsonUrl = `${window.location.protocol}//${domain}/tests/${jobId}/file/vars.json`; // 构建新的JSON URL

        // 使用GM_xmlhttpRequest获取JSON数据
        GM_xmlhttpRequest({
            method: 'GET',
            url: jsonUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const jsonData = JSON.parse(response.responseText);

                    // 存储JSON数据（将数据保存在Tampermonkey的存储中）
                    GM_setValue('jsonData', JSON.stringify(jsonData));
                    console.log(jsonData);


                    // 定义要查找的文本
                    const searchText = "Result: failed, finished";

                    // 查找页面中的文本
                    const pageText = document.body.textContent;

                    // 如果页面中包含指定文本，创建工具箱浮窗
                    if (pageText.includes(searchText)) {
                        // 创建按钮元素
                        const button = document.createElement("button");
                        button.innerText = "Clone job"; // Updated name to "Tool"
                        button.style.position = "fixed";
                        button.style.top = "20%";
                        button.style.right = "0";
                        button.style.zIndex = "9999";
                        button.style.background = "#0076D6"; // SUSE blue color
                        button.style.color = "white";
                        button.style.padding = "5px 10px";
                        button.style.border = "none";
                        button.style.borderTopLeftRadius = "50% 50%";
                        button.style.borderBottomLeftRadius = "50% 50%";
                        button.style.cursor = "pointer";
                        document.body.appendChild(button);

                        button.addEventListener("click", toggleToolbox);

                        function toggleToolbox() {
                            if (toolboxVisible) {
                                const floatingToolbox = document.getElementById("floating-toolbox");
                                floatingToolbox.remove();
                                toolboxVisible = false;
                            } else {
                                // 创建工具箱元素
                                const floatingToolbox = document.createElement("div");
                                floatingToolbox.id = "floating-toolbox";
                                floatingToolbox.innerHTML = `
                                    <div id="openqa-clone-job-tab" class="tabcontent">
                                        <textarea id="command-textarea" style="width: 100%; height: 300px; background-color: rgba(255, 255, 255, 0.5);">
openqa-clone-custom-git-refspec \\
PR(https://github.com/vtrubovics/os-autoinst-distri-opensuse/tree/oscap_all_profiles) \\
https://${domain}/tests/${jobId}


openqa-clone-job \\
--from http://${domain} \\
--host http://${domain} \\
${jobId} \\
--skip-download \\
--skip-chained-deps \\
_GROUP_ID=0 \\
BUILD=${jsonData.BUILD} \\
TEST=${jsonData.TEST} \\
DESKTOP=${jsonData.DESKTOP} \\
CASEDIR=https://github.com/gitname/os-autoinst-distri-opensuse.git#yourbranch \\
</textarea>
                                    </div>
                                    <button id="copy-button">复制</button>
                                `;
                                document.body.appendChild(floatingToolbox);
                                makeElementDraggable(floatingToolbox);
                                document.getElementById("copy-button").addEventListener("click", copyToClipboard);

                                toolboxVisible = true;
                            }
                        }

                        function copyToClipboard() {
                            const commandTextarea = document.getElementById("command-textarea").value;
                            GM_setClipboard(commandTextarea, "text");
                            alert("Copied to clipboard!");
                        }
                    }
                }
            }
        });
    }

    // 拖拽功能函数
    function makeElementDraggable(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 添加样式
    GM_addStyle(`
    #floating-toolbox {
        position: fixed;
        top: 22%;
        right: 0;
        width: 500px; /* 设置浮窗的宽度 */
        max-width: 500px; /* 确保浮窗不会超过300px */
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid #0076D6;
        z-index: 9999;
        padding: 10px; /* 内边距会被包含在width内 */
        box-sizing: border-box; /* 确保padding和border不会增加额外的宽度 */
        overflow: hidden; /* 隐藏溢出的内容 */
       }

        #command-textarea {
            width: calc(100% - 20px);
            height: 300px;
            margin-bottom: 10px;
        }

        #copy-button {
            background: #0076D6;
            color: white;
            padding: 3px 5px;
            border-radius: 5px;
            margin: 10px;
            border: none;
            cursor: pointer;
        }
    `);
})();