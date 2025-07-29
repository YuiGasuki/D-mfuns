function getVideoUrl(videoLocation, informationData) {
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

document.body.innerHTML += `<div id='Dmfuns' style='position: fixed;right: 16px;top: 60px;padding:6px 10px;border-radius: 4px;opacity: 0;z-index: 99999999;color: #A78BFA;background: white;box-shadow: 0px 0px 2px black;display:none'>! 视频下载中</div>`
const Dmfuns = document.getElementById('Dmfuns');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request==='hi'){
        const informationData = JSON.parse(document.getElementById("__NUXT_DATA__").innerText);
        let videoLocationList = informationData[informationData[informationData[informationData[informationData[0][1]].data][1]]['video:' + window.location.href.split('video/')[1]]]
        const videoInfor = {
            "title": informationData[videoLocationList.title],
            "P": informationData[videoLocationList.videos],
            "videoUrl": getVideoUrl(videoLocationList.videos, informationData),
            "danmaku": `https://api.mfuns.net/v1/danmaku/get_normal?id=${window.location.href.split('video/')[1]}&part=1`,
            "cover": `https://cdn.mfuns.net${informationData[videoLocationList.cover]}`
        }
        console.log(videoInfor.cover)
        sendResponse(videoInfor)
    }else{
         for (let i = 0; i < request.length; i++) {
            getVideo(request[i].url, request[i].title,request.length)
         }
          Dmfuns.style.display = "flex"
          console.log(Dmfuns.offsetHeight)
          Dmfuns.style.transition = 'opacity 0.5s'
          Dmfuns.style.opacity = 1
         sendResponse('ok')
    }
})
let videolength = 0;
async function getVideo(url, title,max) {
    await fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = title;
            a.click();
            videolength++
            if(videolength>=max){
                Dmfuns.style.transition = 'opacity 0.5s'
                Dmfuns.style.opacity = 0
                setTimeout(() => {
                Dmfuns.style.display='none';
                },500)
            }
            URL.revokeObjectURL(objectUrl);
        })
}
