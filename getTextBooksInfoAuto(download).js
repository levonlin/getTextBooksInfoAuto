javascript: (
    function() {
        var href = window.location.href,
            url = href.match(/http:\/\/.+\//)[0],
            sid = href.match(/xh=(.+)($|#|&|\/)/)[1],
            classes = document.getElementById('iframeautoheight').contentDocument.getElementsByTagName('tr'),
            cid = [],
            className = [];


        //获取没预定教材的课程号和课程名，并用内嵌框架将跨域的教材信息拉到同一页面下
        for (var j = 1; j < classes.length; j++) {
            if (classes[j].children[10].innerText == '0') {
                cid.push(classes[j].children[0].innerText.trim());
                className.push(classes[j].children[2].innerText.trim());
            }
        }

        var headDiv = document.getElementById('headDiv');
        var newIframe = document.createElement('iframe');
        newIframe.name = 'jcxx'; //没设置框架名会一直刷新
        newIframe.src = url + 'jcxx.aspx?xkkh=' + cid[0] + '&xh=' + sid;
        newIframe.style.display = 'none';
        headDiv.appendChild(newIframe);

        //获取抓取进度，并提供抓取结果的下载连接
        var times = 0;

        function hintInfo(times) {
            return '图书信息收集中，已完成：' + (times / cid.length * 100) + '%';
        }

        function downloadFile(aLink, fileName, content) {
            aLink.download = fileName;
            aLink.href = "data:text/plain," + encodeURIComponent(content); //注意URI要编码才能传输非显示字符
        }

        var downloadLink = document.createElement('a');
        downloadLink.innerText = hintInfo(times);
        downloadLink.style.color = '#f00';
        downloadLink.style.fontSize = '20px';
        downloadLink.style.fontWeight = '700';
        downloadLink.style.marginLeft = '500px';
        headDiv.appendChild(downloadLink);

        // 按预设周期抓取
        var catchCycle = 2000;
        var allResult = '';

        function catchData() {
            var result = '课程名称：' + className[times] + '\r\n'; //windows记事本下只有\r\n才能显示换行
            try {
                var bookInfos = newIframe.contentDocument.getElementsByTagName('tr');
                if (newIframe.contentDocument.getElementById('jcmc').innerText !== '无教材') {
                    for (var j = 0; j < bookInfos.length - 1; j++) {
                        var bookInfoItems = bookInfos[j].children;
                        for (var k = 0; k < bookInfoItems.length; k += 2) {
                            result += bookInfoItems[k].innerText + '\t';
                            result += bookInfoItems[k + 1].innerText + '\r\n';
                        }
                    }
                } else {
                    result += '无教材\r\n';
                }
            } catch (e) {
                result += '获取失败\r\n';
                console.log(e);
            }
            result += '-----------------\r\n';
            allResult += result;
            times++;
            if (times === cid.length) {
                clearInterval(int);
                downloadFile(downloadLink, 'bookInfos', allResult);
                downloadLink.innerText = '图书信息收集完毕，点击下载';
            } else {
                downloadLink.innerText = hintInfo(times);
                newIframe.src = url + 'jcxx.aspx?xkkh=' + cid[times] + '&xh=' + sid;
            }
        }

        var int = setInterval(catchData, catchCycle);
    }
)()
