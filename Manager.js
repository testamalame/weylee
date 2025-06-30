//*-------- Show Interstitial --------*//
function ShowInter(complete) {
	try {
		if (window.ysdk && ysdk.adv && ysdk.adv.showFullscreenAdv) {
			ysdk.adv.showFullscreenAdv({
				callbacks: {
					onClose: function(wasShown) {
						if (complete) complete();
					},
					onError: function(error) {
						window.adShowing = false;
						if (complete) complete();
					}
				}
			});
		} else {
			if (complete) complete();
		}
	} catch (e) {
		if (complete) complete();
	}
}

//*-------- Show Rewarded --------*//
function ShowRewarded(success, failure) {
	try {
		if (window.ysdk && ysdk.adv && ysdk.adv.showRewardedVideo) {
			ysdk.adv.showRewardedVideo({
				callbacks: {
					onOpen: () => {
						window.rewardDone = false;
					},
					onRewarded: () => {
						window.rewardDone = true;
					},
					onClose: () => {
						if (window.rewardDone) {
							success && success();
						} else {
							failure && failure();
						}
					},
					onError: (e) => {
						failure && failure();
						Prompt("Ads not available, try again later");
					}
				}
			});
		} else {
			failure && failure();
		}
	} catch (e) {
		failure && failure();
	}
}

//*-------- SDK INIT DUMMY (Gerekirse) --------*//
if (typeof YaGames === "undefined") {
	window.YaGames = {
		init: () => Promise.resolve({ adv: {} })
	};
}

//*-------- Init SDK (Yoksa boş tanımlı) --------*//
YaGames
	.init()
	.then(ysdk => {
		console.log('Yandex SDK initialized (or dummy fallback)');
		window.ysdk = ysdk;
	})
	.catch(e => {
		console.warn('Yandex SDK not available:', e);
		window.ysdk = { adv: {} }; // fallback
	});

//*-------- Prompt (Ekran mesajı) --------*//
function Prompt(msg, duration = 3000) {
	if (!this.prompt_) {
		this.prompt_ = document.createElement('div');
		this.prompt_.style.cssText = "font-family:siyuan;max-width:80%;min-width:320px;padding:10px 10px;min-height:40px;color:white;line-height:20px;text-align:center;border-radius:4px;position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);z-index:999999;background:rgba(0,0,0,.7);font-size:16px;";
		document.body.appendChild(this.prompt_);
	}
	this.prompt_.innerHTML = msg;
	this.prompt_.style.display = "inline";
	this.prompt_.style.opacity = '1';
	setTimeout(() => {
		this.prompt_.style.opacity = '0';
		this.prompt_.style.display = "none";
	}, duration);
}
