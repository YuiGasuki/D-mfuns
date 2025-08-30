function DMgetCookie() {
    //return 'ok' //关闭登录验证
    let DMcookie = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < DMcookie.length; i++) {
        if (DMcookie[i].split('=')[0].trim() === "userInfo") {
            if (JSON.parse(DMcookie[i].split('=')[1]).login) {
                return 'ok'
            }
        }
    }
    return "no";
}



function DMgetVideoUrl(videoLocation, informationData) {
    let urlList = []
    for (let i = 0; i < informationData[videoLocation].length; i++) {
        let N = informationData[informationData[informationData[videoLocation][i]].video_url];
        let videoUrl = []
        for (let il = 0; il < N.length; il++) {
            let infor = informationData[N[il]]
            videoUrl.push({
                "name": informationData[infor.name],
                "label": informationData[infor.label],
                "url": informationData[infor.url],
                "size": informationData[infor.size]
            })
        }
        urlList.push({
            "title": informationData[informationData[informationData[videoLocation][i]].title],
            "list": videoUrl
        })

    }

    return urlList
}



document.body.innerHTML += `
<div id='Dmfuns' style='position: fixed;right: 16px;top: 90px;transform: translateY(25%);padding:6px 10px;border-radius: 4px;opacity: 0;z-index: 99999999;color: #A78BFA;background: white;box-shadow: 0px 0px 2px black;display:none'>
下载列表
</div>`
const Dmfuns = document.getElementById('Dmfuns');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === 'hi') {
        if (DMgetCookie() === "no") {
            sendResponse('no')
        } else {
            const informationData = JSON.parse(document.getElementById("__NUXT_DATA__").innerText);
            let videoLocationList = informationData[informationData[informationData[informationData[informationData[0][1]].data][1]]['video:' + window.location.href.split('video/')[1]]]
            const videoInfor = {
                "title": informationData[videoLocationList.title],
                "P": informationData[videoLocationList.videos],
                "videoUrl": DMgetVideoUrl(videoLocationList.videos, informationData),
                "danmaku": `https://api.mfuns.net/v1/danmaku/get_normal?id=${window.location.href.split('video/')[1]}&part=1`,
                "cover": `https://cdn.mfuns.net${informationData[videoLocationList.cover]}`
            }
            sendResponse(videoInfor)
        }
    } else {
        if(document.getElementsByClassName('m-video-side-action-item')[0].children[0].className==="m-icon vertical m-like-action icon"){
                document.getElementsByClassName('m-video-side-action-item')[0].children[0].click()
        }
        for (let i = 0; i < request.length; i++) {
            DMgetVideo(request[i].url, request[i].title, request.length)
        }
        Dmfuns.style.display = "grid"
        console.log(Dmfuns.offsetHeight)//不能删除
        Dmfuns.style.transition = '0.5s'
        Dmfuns.style.transform = 'translateY(0%)';
        Dmfuns.style.opacity = 1
        sendResponse('ok')
    }
})
async function DMgetVideo(url, title, max) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    const div = document.createElement('div')
    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            div.innerText = `${title.length > 6 ? title.substring(0, 5) + '...' : title} ${Math.round(percentComplete)}%`;
        }
    };
    xhr.onload = function () {
        if (this.status === 200) {
            const blob = this.response;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = title;
            document.body.appendChild(a);
            a.click();
            div.remove()
            if (Dmfuns.querySelector('div') <= 0) {
                Dmfuns.style.transition = '0.5s'
                Dmfuns.style.transform = 'translateY(25%)';
                Dmfuns.style.opacity = 0
                setTimeout(() => {
                    Dmfuns.style.display = 'none';
                }, 500)
            }
            window.URL.revokeObjectURL(url);
        }
    };
    Dmfuns.appendChild(div)
    xhr.send();
}
