chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        switch (msg.type) {
            case 'GET_ACCESS_TOKEN':
                var inputWithToken = document.getElementById('ss_access_token');
                port.postMessage({
                    ssAccessToken: inputWithToken.value
                });
                break;
            case 'YOUTUBE':
                sendResponse(port, {
                    type: 'REQUEST_RECEIVED_YOUTUBE',
                    sent_object_timestamp: msg.data.timestamp
                });
                showYoutubeIframe(msg);
                break;
            case 'IMAGE':
                sendResponse(port, {
                    type: 'REQUEST_RECEIVED_IMAGE',
                    sent_object_timestamp: msg.data.timestamp
                });
                showImage(msg);
                break;
            default:
                break;
        }
    });
});

function sendResponse(port, params) {
    port.postMessage(params);
}

function showYoutubeIframe(message) {
    var interface_yt = {
        type: 'YOUTUBE',
        data: {
            data: {
                message_type: '',
                message_value: ''
            },
            from: {
                first_name: '',
                last_name: '',
                photo: '',
                social_id: ''
            },
            timestamp: ''
        },
        video_id: ''
    };
    function clearLayer() {
        var overlays = $('.__ext_snapshare_overlay'),
            numOverlays = overlays.length;
        if (numOverlays == 1) {
            $(document.body).removeClass('__ext_snapshare_layer');
            overlays.remove();
        } else if (numOverlays > 1) {
            $(overlays[numOverlays - 1]).remove();
        }
    }

    var overlay = '<div class="__ext_snapshare_overlay">\n    <div class="__ext_snapshare_content">\n        <div class="__ext_snapshare_content__inner">\n            <div class="__ext_snapshare_content__title-layer">\n                <img title="Snapshare" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRDg2QTkzQjEwNzMxMUU1QThBQkY0NEZCNTJFMDdENyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRDg2QTkzQzEwNzMxMUU1QThBQkY0NEZCNTJFMDdENyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBEODZBOTM5MTA3MzExRTVBOEFCRjQ0RkI1MkUwN0Q3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBEODZBOTNBMTA3MzExRTVBOEFCRjQ0RkI1MkUwN0Q3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZRNx5QAAAnZQTFRF/1dX////////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" />\n                <div class="__ext_snapshare__title__sender">\n                    <span class="__ext_snapshare__sender-header">Отправитель:</span>\n                    <span class="__ext_snapshare__author">Александр Белов</span>\n                    <br>\n                    <span class="__ext_snapshare__date">Отправлено в 14:56</span>\n                </div>\n            </div>\n            <div id="__ext_snapshare_object" class="__ext_snapshare_content__object"></div>\n            </div>\n        </div>\n    </div>\n</div>';
    var objectVideo = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + message.video_id + '" frameborder="0" allowfullscreen=""></iframe>';
    var noShowedLink = '<div class="__ext_snapshare__noshowed">Если видео не отобразилось, нажмите <a target="_blank" class="__ext_snapshare__link" title="Перейти на Youtube" onclick="window.open(\'' + message.data.data.message_value + '\')" href="' + message.data.data.message_value + '">здесь</a>.</div>';
    var jQueryOverlay = $(overlay);
    var objHtml = $('.__ext_snapshare_content__object:last', jQueryOverlay);
    objHtml.append(objectVideo);
    objHtml.append(noShowedLink);
    $('.__ext_snapshare__author', jQueryOverlay).text(message.data.from.first_name + ' ' + message.data.from.last_name);
    var sentTime = new Date(message.data.timestamp);
    var zF = function(num) { return num < 10 ? '0' + num.toString() : num.toString() };
    $('.__ext_snapshare__date', jQueryOverlay).text('Отправлено в ' + zF(sentTime.getHours()) + ':' + zF(sentTime.getMinutes()));

    $(document.body).append(jQueryOverlay[0]).addClass('__ext_snapshare_layer');
    $('.__ext_snapshare_overlay:last').on('click', function(e) {
        clearLayer();
    });
    $('.__ext_snapshare_content__inner:last').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
}

function showImage(message) {
    var interface_image = {
        type: 'IMAGE',
        data: {
            data: {
                message_type: '',
                message_value: ''
            },
            from: {
                first_name: '',
                last_name: '',
                photo: '',
                social_id: ''
            },
            timestamp: ''
        },
        image_url: ''
    };
    function clearLayer() {
        var overlays = $('.__ext_snapshare_overlay'),
            numOverlays = overlays.length;
        if (numOverlays == 1) {
            $(document.body).removeClass('__ext_snapshare_layer');
            overlays.remove();
        } else if (numOverlays > 1) {
            $(overlays[numOverlays - 1]).remove();
        }
    }

    var overlay = '<div class="__ext_snapshare_overlay">\n    <div class="__ext_snapshare_content">\n        <div class="__ext_snapshare_content__inner_img">\n            <div class="__ext_snapshare_content__title-layer">\n                <img title="Snapshare" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRDg2QTkzQjEwNzMxMUU1QThBQkY0NEZCNTJFMDdENyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRDg2QTkzQzEwNzMxMUU1QThBQkY0NEZCNTJFMDdENyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBEODZBOTM5MTA3MzExRTVBOEFCRjQ0RkI1MkUwN0Q3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBEODZBOTNBMTA3MzExRTVBOEFCRjQ0RkI1MkUwN0Q3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZRNx5QAAAnZQTFRF/1dX/////////////////5iY/5mZ/5iY/5mZ/5ub/5KS/5yc/5SU/5iY/5yc/5mZ/39//4KC/4OD/39//4iI/4mJ/3V1/3l5/3l5/3Fx/2xs/2lp/3Bw/3Fx/3V1/3Fx/29v/29v/2lp/25u/21t/21t/25u/21t/3Fx/1dX/1hY/1lZ/1pa/1tb/1xc/11d/15e/19f/2Bg/2Fh/2Ji/2Nj/2Rk/2Vl/2Zm/2dn/2ho/2lp/2pq/2tr/2xs/21t/25u/29v/3Bw/3Fx/3Jy/3Nz/3R0/3V1/3Z2/3d3/3h4/3l5/3p6/3t7/3x8/319/35+/39//4CA/4GB/4KC/4OD/4SE/4WF/4aG/4eH/4iI/4mJ/4qK/4uL/4yM/42N/46O/4+P/5CQ/5GR/5KS/5OT/5SU/5WV/5aW/5eX/5iY/5mZ/5qa/5ub/5yc/52d/56e/5+f/6Cg/6Gh/6Ki/6Oj/6Sk/6Wl/6am/6en/6io/6mp/6qq/6ur/6ys/62t/66u/6+v/7Cw/7Gx/7Ky/7Oz/7S0/7W1/7a2/7e3/7i4/7m5/7q6/7u7/7y8/729/76+/7+//8DA/8HB/8LC/8PD/8TE/8XF/8bG/8fH/8jI/8nJ/8rK/8vL/8zM/83N/87O/8/P/9DQ/9HR/9LS/9PT/9TU/9XV/9bW/9fX/9jY/9nZ/9ra/9vb/9zc/93d/97e/9/f/+Dg/+Hh/+Li/+Pj/+Tk/+Xl/+bm/+fn/+jo/+np/+rq/+vr/+zs/+3t/+7u/+/v//Dw//Hx//Ly//Pz//T0//X1//b2//f3//j4//n5//r6//v7//z8//39//7+////an4r4gAAACl0Uk5TAAADBgdRUlNUVFVVVltbXImJiYqTlKarrNfZ29/f3+Dj5PLz+Pn5+vpYRXMDAAARJElEQVR42u3d+18VZ37A8RB7227T3Xbb3bRpm91tu+1z4MDhahATJGAIGkRELV6ihLh4iYGIFdclatAoJBhQQ7JojBdELiIbFRVZRI0gIiIw/1FN2TXRIMJzzjPznZnP54f9YV8vz4vM983hPHOemXkminzdM9/7P8jTPQnArL/56b/+Zzr5oX//p5/+9azHAPz5C4r81At/8V0Az/59DIfEZ8X83bPfAvgxx8OH/fghgB8EORo+LPiDPwKY9XMOhi/7xawJAH/LofBpP5oA8DOOhE97fgLAixwJn/biBID/4Ej4tF9NAHiZI+HTXgYAAAAAAAAAgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAHYWN2/R2tIdhz75pkM7StcumhcHAL+UsLyioWPQerTBjoaK5QkA8P701x/tHrcmb7z76PoEAHi4pOUNt6ypu9WwPAkAHh1/eZc1nbrKkwDgvUKVV6zpdqUyBACPfeov77VmUm95HAA8VEG7NdPaCwDgleJrLJ1q4gHgifIuWXpdygOAByodsXQbKQWA24ups8KpLgYAri75pBVeJ5MB4OJSOqxw60gBgGtLu2yF3+U0ALh1/hetSHQxDQCuLHjOikznggBwYYFGK1I1BgDgvj60IteHAHBdRVYkKwKAy8rojyiA/gwAuOsDQKsV2VoDAHBT261Itx0AbvoDMBhxAIMZAHBPjVbkawSAa1pimWgJAFxSdIcRAB3RAHBH6y0zrQeAO+o0BKATAK6ocNwQgPFCALihI5apjgDABb1y3xiA+68AQH7vWeZ6DwD+/Qho+8dAAGiVPWoQwGg2AKS33TLZdgBI75RRAKcAILzkXqMAepMBILvl40YBjC8HgOxKLbOVAkB2BwwDOAAA2TUbBtAMANEldRkG0AUA0aUPGAYwAADRvT5mGMAYAERXYJkOAAAAgNzyAeDvCgHg71YDgD8BAOBDIAD82lIA+PxE0Ijh+Y8DQHTptw0DGAaA6BIuGAbQCwDRBY4ZBtACANlVGQbwKQBkt8EwgG0AkF32sFkAqwEguxV3jc7/1lwASC6jxuyucKtNAUBwW/tNnwesBoDc1po+B/CgpQAQ++nvc/Pjt64GACCzlA+GbZi/tU8BQOT5v41/sGwpFwASW9xiz/itziAA5JX+kWVXmxUApBVXccO2+V9PBIC0/ueCZV+/VQCQVU6jjeO3biQDQFRJVXfsnL+dXwQC4OnFrOu1dfxWVwgAgspttnf81vibCgBiSq0btXn+1u8UAKQUKr9h9/it/jQASGnZ7y37K1YAkFF2owPjt2oVAESUsGfQifmfCQBAROsvOTF+64YjQwDA4y056cj4rYE3FACcb079iDPztwoVAJxf+pV+7dD4rXcUABxvdYdT4x8sUQBwuvmaGz6vr8kN9+vigXwFAIdL2Tmkdyl/9Ryl0tvCmn9PrgKAw63r1pvdybyJDw91Ycz/xBwFAGdbfEZvdJfffvgSZdqrh10BBQBHS6u9p/fJbWfSd15lYbvWi1wqdPY/HgAxWzSXfo1Zj75QoGLmd5Ef3RevAOBoa/R+ca2OZZOsIxr0PkEAwLFe1XwI+Ndlk2/dym+fwZXjbSsCCgCOLv3e17vWb6T2pSe/oxyd5jai5iIRx8DPADZofut3YvGUL7tk7/Wnv4NUFwo5CP4FUHBa8+Ltp2/bmbPy05tT/Cm4feztuWIOg18BvLxP7zYvtx9Z+j25uFW1bdcm+ffX2j4uShR1IPwJoPym3q9/w0ye7J5a+O7uQ6fPd/bfG7rX33n+9KHd7xamivtN8COAVec1l34az/QNJManz8+cnx6fGJD5Vug/AJkNeu/+N7YEPXg0fAcg9FvNk/Y1aZ48Hn4DUKK59Due59ED4i8AC4/rjf9KSUABwPWlad7mZXB3rIfXw74BEL1V80rv+vmePiHiFwArNDd8dqz09nHxCYDXDuqNv3er138xfAEgdqfetX7jH81VAHB9gfWaGz6bcnzwydj7AHI1l34X1/tiZex1AGkf6Z33Hd4VUgBwfcEyvdu8jDVkKAUA11eoueHzq0KlAOD+pd9hzRs1bI5WAHD+3Tt1SWlVXVNra+u5jtbWpvqdm/KTZvJ1bPxuvQf8ju33194IkQBisovruoYe3107OthVVzzdHTlvXdH79T+drxQAnG3p7qnuz3ly1zRGlHdC81q/DUoBwNHm7Dg79rRd+S3lKVMv/Wr0rvW7t3O2AoCj5dRO7w/3wL55T3yN0KZbmrdpzVYKAE6WVz+D39a9WU9Y+p3VG397kVIAcLK0mplt1uuvnOTRClmad/i88b8xCgCOtnnmb9w9ax97jaT39ZZ+U13rBwBbyjyqNbmDj1xnUaS54bOpQCkAONo63ecxX/32pG1uk95LdJcoBQBHAcTs17/B0mjFxGukHLir9e/vVKUoADgLYPapsO6x1hD65jYvfXr/+ItMpQDgLICsbiu82mbn6y79VioFAIcBZPdZ4dand+LvZnkc83ccwLweh+7OO3JgLtN3HkBmn0Pzb8pn9gIAZF13ZvzdxQFGLwBAbLsj4x/Yk8TgJQAIHHFk/kfmM3YZACqcGH8nSz8pABaP2z/+r7fGMnMhABIu2z7+8VoejCEHQLXt8z+Zy7zlAMize/xXfx3NuAUBaLN3/EO7WfqJArDB3vl/msOoRQGIvWbn+C+w9JMG4D0bx3/9NzHMWRiAkI1LwPpXmLI4AG/ZNv4zi5ixQAAnbBp/zztMWCKAbHse0T66J4UBiwTwvi3zb3yN8coEEOiyYfwXVzNcqQDeMP814K1tQWYrFkCl8fl/nM5kBQM4Y3j8rQXMVTKAl24YHf9AKVOVDWC12Y8At1j7CQew3fBfgHVMVTaAWsMA9jJV2QBMfwZsZKqyAfzB9MbvEGMVDeCOYQA32forG8B9wwDuc+WPbADGzwNy4a/PASxlrP4GwJlgABAACADEh0BiGUicCCJJADgV7HMAfBnkcwB8HexzAGwI8TkAtoT5HACbQn0OgG3hPgfAhSF+B8ClYT4HwMWhPgfA5eE+B8ANIvwOgFvE+BwAN4nyOwBuE+dzANwo0ucAuFWs3wHYfLPoVQxaGAC7bxf/eQ6jlgXA9gdG7E1k2KIA2P/ImE08MkYSACceGsV+cUkAHHhsnPUJG4blAHDmwZHbeXCkGAAOPTr2TYYuBYBDD49uXMDYZQBw6vHxd/YkM3gRAFTWdUcEWNd+HWD0EgCozD5nBFhNy5i9BABqXo9DAsYPsCSUAEBlh/8e0Dus9c9ulycwf+cBqKzuMOffnrC4Re9f/p5HygoAoGafCmv+DXEPFpSlmu8jJ7IB4DgAFbM/jI2fFROvkVx9V+9bwqrZAHAagFLr+nW/4it8+Bq5xzWXhCUAcByAyjyqNbyDqd99kbWXNDeOLgWA80uizbdmvul77WOvkbRjQO+2Ug1pAHC8tJqZXS7SXznJCd2MBs1vCStDAHC8vPrpT+ze3qzJX6RQc0nYuQ4AzpdTe3t6v7BV8574GsFNN/UIHHsdAM43Z8fZsacMaqSlfOpr/mZX39MSMFb1EgAEtHR38xSf107tmsbOvrxjem8C3WUAkFBMdnFd19Do4+d8Br+qLc6a5ve4RRc0l4TLASCjYOqS0qq6ptaJmup3bspPmsklXqHdt7QEjNe+CgBv9OphzQ1D22IA4I0KWjVvL1MMAG8UU6b5LeHvXgeAN5r9kebtaPyyJPQ6AKVyNL8l7NkMAG8UeEvzIrSzBQDwRrGVet8SWrWZAPBGWQf1BPRvjwGAN1raqUfgUhEAvFF0Wa/mtYQ5APBGafv0BAzvSwGAN1qguSTs2xgEgDcq1tw42pYPAG8UqhjSI3AwAwDeKKNe7940/TviAeCNCjVvTHF+FQA8UqnmkvDLBQDwRnOqxrQEDFXPYEkYTFu2cdf+w83fdHj/ro3L0oIAEJPutYR9JdOaYuKiTQ09dx7d1zh6p6ehLC8VAEJad16PQMtTryVMLKl+8qbUvtqSFACIKKHytpaA8amvJVz48dO+f77asBwAMv7zPxvTXBI+6fYygWXN07ljzWhncQgAElqheS3h+cnvOLpq+p8szpUAQETvaj7M+vj3N47mN83s7karASCh2fs1by9T/egF6klVM70mcfzwbABIaGGT3pvA1e9eS1igs/WwpwgAIlpzUY9A84o/vYLu83APxwNAQkm/GdS7pvzQ3P//M6J5WulBF14HgIjSNW8vM7gtVuWE80D0vpUAELIk1LyWsH1nvxVOIxsAIKPYTQ7dvbwcAEJK/XjYEQEVAJBS7jFHBGwGgJiKuhwAMP4mAMQUt3PAfgH3cgAgp8xP7RfQmwIAQRXY/0SzRgCIWhK+a/sjzcoAIKqU6hF7Adx9DQCyWviFvQJaACBuSXjJVgHrACCtmO1f2wigLwEA4sqot1HAVgAITPe5hDqPLkkGgMTe67ZLwBYAyFwSfmjX+cA4AMgs+4g9AjYBQGrFF+wA0AoAscXu6DcPYGgBAOSWXjduXMD7AJBcQZvxvwHRABBd2VWzAO5nAUB2qXvuGhWwEQDil4SnTe4dPgwA+XUaBHAVAOJLMvkV4UgGAKSXN2pyh/hKAEiv1DPfCQNAqyqjAD4BgPSOGgVwAgDSO2MUQDsAhBc8bxTA5VgAyC7B7AahK/EAkF3ostl3gBAAAAAAAAAAAAAQWbzZD4HdfAgUXnSnUQCd0QAQXrNRAM2cCJJeg1EADQCQ3gdGAXwAAOm9YxTAOwCQ3hv3TW4LfgMA4teBJi8R6o8HgPhM3kSuXQFAfLsMAtgFAPnlGwSQDwD5JZt7sEBfMgBc0OfGAHyuAOCC3jYG4G0AuKHEa4bmfy0RAK7ogCEABxQAXFG2mXuFjGcDwCWdcP1FIQAIqzwjAPIA4Jq+NDD/LxUAXNMSAwCWAMBFfRbx+X+mAOCi0u9EeP530gHgqsoiDMCBp0YBIKxORXT+pxQAXFbGUCTvEpwBANe1JoIA1igAuK+9EZv/XgUANxapRwt+oQDgypLORmT+Z5MA4NLiIvFsyUtxCgBuLSv8i8W7sxQA3FtauFcJtKcpALi50PGw5n88pADg7gI1Ycy/JqAA4Po26j5CYnijoz83ACLVAr3bx55ZoADgjYKVM38TGK4MKgB4pryZvgmcyXP8ZwZARCuayYKwvUjATwyAyBZXcm6a4+8oilMA8GLFTU/fJDDUVCzkpwWAgXK2tUw5/pZtOWJ+VgCYWRFkbz7ePzLJ7Ef6j2/ODgr6SQFgrNhFW2pPf9UzODj4YPAP/rfnq9O1WxbFCvspAeDzAAAAAAAAAAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIATQ7glxwJn/arCQD/zJHwaS9OAPgZR8KnPT8B4DmOhE/70QSAWT/nUPiyX/zZBICoHwY5GD4s+MOoPwKI+glHw4f9JOohgGf/IYbj4bNi/vHZbwFERf3lCxwSX/XCX00M/k8AomY99/y//Fc6+aH//rfnn5sV9RiAhz1Dnu57844iXwcAn/d/8YP1Z9Un0XQAAAAASUVORK5CYII=" />\n                <div class="__ext_snapshare__title__sender">\n                    <span class="__ext_snapshare__sender-header">Отправитель:</span>\n                    <span class="__ext_snapshare__author">Александр Белов</span>\n                    <br>\n                    <span class="__ext_snapshare__date">Отправлено в 14:56</span>\n                </div>\n            </div>\n            <div id="__ext_snapshare_object" class="__ext_snapshare_content__object_img"></div>\n            </div>\n        <div style="height: 30px; width: 100%"></div></div>\n    </div>\n</div>';
    var objectImage = '<img class="__ext_snapshare__object__image" src="' + message.image_url + '" />';
    var noShowedLink = '<div class="__ext_snapshare__noshowed">Если изображение не отобразилось, нажмите <a target="_blank" class="__ext_snapshare__link" title="Перейти по ссылке" onclick="window.open(\'' + message.data.data.message_value + '\')" href="' + message.data.data.message_value + '">здесь</a>.</div>';
    var jQueryOverlay = $(overlay);
    var objHtml = $('.__ext_snapshare_content__object_img:last', jQueryOverlay);
    objHtml.append(objectImage);
    objHtml.append(noShowedLink);
    $('.__ext_snapshare__author', jQueryOverlay).text(message.data.from.first_name + ' ' + message.data.from.last_name);
    var sentTime = new Date(message.data.timestamp);
    var zF = function(num) { return num < 10 ? '0' + num.toString() : num.toString() };
    $('.__ext_snapshare__date', jQueryOverlay).text('Отправлено в ' + zF(sentTime.getHours()) + ':' + zF(sentTime.getMinutes()));

    $(document.body).append(jQueryOverlay[0]).addClass('__ext_snapshare_layer');
    $('.__ext_snapshare_overlay:last').on('click', function(e) {
        clearLayer();
    });
    $('.__ext_snapshare_content__inner_img:last').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
}