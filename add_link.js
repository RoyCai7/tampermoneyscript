// ==UserScript==
// @name         Show Hyperlink on Mouse Double Click or Selection
// @namespace    http://your-namespace.org
// @version      1.0
// @description  Add hyperlinks to text selected by mouse double click or selection and open the link on click
// @author       Roy Cai
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let selectedText = '';

    // Listen for mouse double click event
    document.addEventListener('dblclick', function(e) {
        selectedText = window.getSelection().toString().trim();

        if (selectedText) {
            addLinkToSelectedText(selectedText);
        }
    });

    // Listen for mouse selection event
    document.addEventListener('mouseup', function(e) {
        selectedText = window.getSelection().toString().trim();

        if (selectedText) {
            addLinkToSelectedText(selectedText);
        }
    });

    function addLinkToSelectedText(selectedText) {
        // Match 6-digit numbers starting with "1" (progress link)
        if (selectedText.match(/^1\d{5}$/)) {
            // Create a hyperlink
            const link = document.createElement('a');
            link.href = 'https://progress.opensuse.org/issues/' + selectedText;
            link.target = '_blank';
            link.innerText = selectedText;

            // Replace the selected text with the hyperlink
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(link);

            // Clear the selected text
            window.getSelection().removeAllRanges();
        }

        // Match 7-digit numbers starting with "12" (bug link)
        if (selectedText.match(/^12\d{5}$/)) {
            // Create a hyperlink
            const link = document.createElement('a');
            link.href = 'https://bugzilla.suse.com/show_bug.cgi?id=' + selectedText;
            link.target = '_blank';
            link.innerText = selectedText;

            // Replace the selected text with the hyperlink
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(link);

            // Clear the selected text
            window.getSelection().removeAllRanges();
        }
    }
})();
