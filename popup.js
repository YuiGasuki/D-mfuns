
let data

let downloadList = [];
let downloadUrl = [];
let videoNow, setAllIf = false
let downloadClarity = [];

chrome.tabs.query({ currentWindow: true, active: true }).then(tabs => {
    if (tabs[0].url.search(".mfuns.net/video/") !== -1) {
        getDataUrl()
    } else {
        document.body.innerHTML = `<p class='warn'>这不是我想要的页面(っ °Д °;)っ</p>`
    }
});

function getDataUrl() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, 'hi').then(res => {
            if (res === 'no') {
                document.body.innerHTML = `<p class='warn'>请登录账号使用￣へ￣</p>`
            } else {
                data = res
                const img = document.createElement('img');
                img.alt = data.title;
                img.id = 'cover';
                img.src = data.cover;
                document.body.appendChild(img);
                const p = document.createElement('P');
                p.innerText = data.title;
                p.id = 'title';
                document.body.appendChild(p);
                const div = document.createElement('div');
                div.id = 'clarityList';
                div.innerHTML = `<div class='clarityButton'>无</div>`
                document.body.appendChild(div)
                const videoList = document.createElement('div');
                videoList.id = 'videoList';
                document.body.appendChild(videoList)
                getVideoList(videoList, div);

                const buttonBox = document.createElement('div');
                const downButton = document.createElement('button');
                downButton.id = 'downButton';
                downButton.innerText = '下载'
                downButton.className = 'disabled'
                downButton.onclick = () => getDownloadUrl()
                buttonBox.appendChild(downButton)
                const cancelButton = document.createElement('button');
                cancelButton.id = 'cancelButton';
                cancelButton.innerText = '取消'
                cancelButton.className = "disabled"
                cancelButton.onclick = () => clickCancel()
                buttonBox.appendChild(cancelButton)
                const getallButton = document.createElement('button');
                getallButton.id = 'getallButton';
                getallButton.innerText = '全选'
                getallButton.className = "disabledTrue"
                getallButton.onclick = () => getAll()
                buttonBox.appendChild(getallButton)
                const setAllButton = document.createElement('button');
                setAllButton.id = 'setAllButton';
                setAllButton.innerText = '应用全部'
                setAllButton.className = "disabledTrue"
                setAllButton.onclick = () => setAll()
                buttonBox.appendChild(setAllButton)
                buttonBox.id = 'buttonBox'
                document.body.appendChild(buttonBox)
                videoList.style.marginBottom = `${buttonBox.offsetHeight + 8}px`
            }
        }).catch(error => {
            document.body.innerHTML = `<p class='warn'>等待网页加载，请重试</p>`
        })

        function getDownloadUrl() {
            downloadList = [];
            for (let i = 0; i < downloadUrl.length; i++) {
                if (downloadUrl[i] === 1) {
                    document.getElementById('video' + i).onclick = null;
                    document.getElementById('video' + i).style.borderColor = '#A78BFA'
                    document.getElementById('video' + i).style.color = '#A78BFA'
                    document.getElementById('video' + i).style.opacity = 0.5
                    downloadUrl[i] = 2
                    downloadList.push({
                        "url": data.videoUrl[i].list[downloadClarity[i]].url,
                        "title": data.videoUrl[i].title + ' ' + data.videoUrl[i].list[downloadClarity[i]].name + '.mp4'
                    })
                }
            }
            chrome.tabs.sendMessage(tabs[0].id, downloadList)
        }

    })
}
function getClarityList(el, id) {
    el.innerHTML = ''
    for (let i = 0; i < data.videoUrl[id].list.length; i++) {
        const clarityData = document.createElement('div');
        clarityData.className = 'clarityButton'
        clarityData.innerText = `${data.videoUrl[id].list[i].name} ${data.videoUrl[id].list[i].label}`
        clarityData.onclick = () => {
            if (setAllIf) {
                for (let li = 0; li < downloadUrl.length; li++) {
                    downloadClarity[li] = i;
                    document.getElementById('video' + li).innerHTML = (data.videoUrl[li].title.length > 20 ? data.videoUrl[li].title.substring(0, 19) + '...' : data.videoUrl[li].title) + ' ' + `${data.videoUrl[li].list[i].name} ${data.videoUrl[li].list[i].label}<br><span>${getSize(data.videoUrl[li].list[i].size)}</span>`;

                }
            } else {
                downloadClarity[videoNow] = i;
                document.getElementById('video' + videoNow).innerHTML = (data.videoUrl[videoNow].title.length > 20 ? data.videoUrl[videoNow].title.substring(0, 19) + '...' : data.videoUrl[videoNow].title) + ' ' + `${data.videoUrl[videoNow].list[i].name} ${data.videoUrl[videoNow].list[i].label}<br><span>${getSize(data.videoUrl[videoNow].list[i].size)}</span>`;
            }
            Array.from(el.children).forEach(element => {
                element.style.color = "#aaaaaa"
            });
            clarityData.style.color = '#A78BFA'
        }
        if (i === downloadClarity[videoNow]) {
            clarityData.onclick()
        }
        el.appendChild(clarityData)
    }
}

function setAll() {
    if (!setAllIf) {
        setAllIf = true
        setAllButton.className = "disabledFalse"
    } else {
        setAllIf = false
        setAllButton.className = "disabledTrue"
    }
}

function getVideoList(el, clarityList) {
    for (let i = 0; i < data.videoUrl.length; i++) {
        const videoData = document.createElement('div');
        videoData.className = 'videoButton'
        videoData.innerHTML = (data.videoUrl[i].title.length > 20 ? data.videoUrl[i].title.substring(0, 19) + '...' : data.videoUrl[i].title) + ' ' + `${data.videoUrl[i].list[data.videoUrl[i].list.length - 1].name} ${data.videoUrl[i].list[data.videoUrl[i].list.length - 1].label}<br><span>${getSize(data.videoUrl[i].list[data.videoUrl[i].list.length - 1].size)}</span>`;
        downloadUrl.push(0)
        downloadClarity.push(data.videoUrl[i].list.length - 1)
        videoData.id = 'video' + i
        videoData.onclick = () => {
            cancelButton.className = "disabledFalse"
            downButton.className = 'disabledFalse'
            downloadUrl[i] = 1;
            videoNow = i;
            getClarityList(clarityList, videoNow);
            Array.from(el.children).forEach(element => {
                element.style.borderColor = "#aaaaaa"
            });
            videoData.style.borderColor = '#A78BFA'
            videoData.style.color = '#A78BFA'
            for (let i = 0; i < downloadUrl.length; i++) {
                if (downloadUrl[i] === 0) {
                    return
                }
            }
            getallButton.className = 'disabledFalse'
            getallButton.innerText = "取消全选"
            getallButton.onclick = () => getAllCancel(getallButton)
        }
        el.appendChild(videoData)
    }
}

function getAll() {
    for (let i = downloadUrl.length - 1; i >= 0; i = i - 1) {
        if (downloadUrl[i] === 0) {
            document.getElementById('video' + i).onclick();
        }
    }
    getallButton.className = 'disabledFalse'
    getallButton.innerText = "取消全选"
    getallButton.onclick = () => getAllCancel(getallButton)
}

function getAllCancel(el) {
    for (let i = 0; i < downloadUrl.length; i++) {
        if (downloadUrl[i] === 1) {
            downloadUrl[i] = 0
            const videoData = document.getElementById('video' + i)
            videoData.style.borderColor = '#aaaaaa'
            videoData.style.color = '#aaaaaa'
        }
    }
    videoNow = null;
    document.getElementById('clarityList').innerHTML = `<div class='clarityButton'>无</div>`
    cancelButton.className = "disabled"
    downButton.className = 'disabled'
    el.className = "disabledTrue"
    el.innerText = "全选"
    el.onclick = () => getAll()
}


function clickCancel() {
    downloadUrl[videoNow] = 0;
    document.getElementById('clarityList').innerHTML = `<div class='clarityButton'>无</div>`
    const videoData = document.getElementById('video' + videoNow)
    videoData.style.borderColor = '#aaaaaa'
    videoData.style.color = '#aaaaaa'
    videoNow = null;
    for (let i = 0; i < downloadUrl.length; i++) {
        if (downloadUrl[i] === 1) {
            cancelButton.className = 'disabled'
            return
        }
    }
    cancelButton.className = "disabled"
    downButton.className = 'disabled'
    getallButton.className = 'disabledTrue'
    getallButton.innerText = "全选"
    getallButton.onclick = () => getAll()
}

function getSize(size) {
    size = size * 1
    if (size >= 1024 * 1024 * 1024) return (size / (1024 * 1024 * 1024)).toFixed(2) + 'G'
    if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + 'MB'
    if (size >= 1024) return (size / 1024).toFixed(2) + 'KB'
    return size + 'B'
}