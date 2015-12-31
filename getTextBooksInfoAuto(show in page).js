javascript: (
    function() {
        var href = window.location.href,
            url = href.match(/http:\/\/.+\//)[0],
            sid = href.match(/xh=(.+)($|#|&|\/)/)[1],
            showColumnNum = '5',
            classes = document.getElementById('iframeautoheight').contentDocument.getElementsByTagName('tr'),
            cid = [],
            className = [];

        for (var j = 1; j < classes.length; j++) {
            if (classes[j].children[10].innerText == '0') {
                cid.push(classes[j].children[0].innerText.trim());
                className.push(classes[j].children[2].innerText.trim());
            }
        }

        var headDiv = document.getElementById('headDiv');
        var newIframe = document.createElement('iframe');
        newIframe.name = 'jcxx';
        newIframe.src = url + 'jcxx.aspx?xkkh=' + cid[0] + '&xh=' + sid;
        newIframe.style.display = 'none';
        headDiv.appendChild(newIframe);
        
        var showArea = [];
        for (var j = 0; j < showColumnNum; j++) {
            var newShowArea = document.createElement('p');
            headDiv.appendChild(newShowArea);
            showArea.push(newShowArea);
            showArea[j].style.backgroundColor = '#ccc';
            showArea[j].style.width = (100 / showColumnNum) + '%';
            showArea[j].style.cssFloat = 'left';
        }

        function show() {
            var result = '课程名称：' + className[i] + '\n';
            try {
                var bookInfos = newIframe.contentDocument.getElementsByTagName('tr');
                if (newIframe.contentDocument.getElementById('jcmc').innerText !== '无教材') {
                    for (var j = 0; j < bookInfos.length - 1; j++) {
                        var bookInfoItems = bookInfos[j].children;
                        for (var k = 0; k < bookInfoItems.length; k += 2) {
                            result += bookInfoItems[k].innerText + '\t';
                            result += bookInfoItems[k + 1].innerText + '\n';
                        }
                    }
                } else {
                    result += '无教材\n';
                }
            } catch (e) {
                result += '获取失败\n';
                console.log(e);
            }
            result += '-----------------\n';
            showArea[Math.floor(i / 3)].innerText += result;
            i++;
            if (i === cid.length) {
                clearInterval(int);
            } else {
                newIframe.src = url + 'jcxx.aspx?xkkh=' + cid[i] + '&xh=' + sid;
            }
        }

        var i = 0;
        var int = setInterval(show, 4000);
    }
)()

//后加载时初期iframe里保持为空，得等一段时间后才加载，自定义的onload没法执行，而后面可以触发onload了因已执行一次show又导致错位
//而先加载时自定义的onload赶不上第一次触发，导致第一次错过。所以应该先加载并取消onload立即执行
//代码压缩一定要在该分行出有分隔符，分号最好别省略，禁止出现注释