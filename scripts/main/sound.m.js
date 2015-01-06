define(["core/manager", "conf/sound", "sound"], function(Manager, CfgSound, Sound) {
	var SoundManager = new Manager(Sound);

	SoundManager.conf = CfgSound;

	SoundManager._init = SoundManager.init;
	SoundManager.init = function(cE) {
		this._init(cE);
		for (x in SoundManager.conf.musics) {
			if (!isFunction(SoundManager.conf.musics[x])) {
				SoundManager.conf.musics[x].object = SoundManager.create();
				SoundManager.conf.musics[x].object.load(SoundManager.conf.musics[x].track, SoundManager.conf.musics[x].format);
			}
		}

		for (x in SoundManager.conf.sounds) {
			if (!isFunction(SoundManager.conf.sounds[x])) {
				SoundManager.conf.sounds[x].object = SoundManager.create();
				SoundManager.conf.sounds[x].object.load(SoundManager.conf.sounds[x].track, SoundManager.conf.sounds[x].format);
			}
		}
	}

	this.stopAll = function(fadeOut) {
		for (var i = this.entities.length - 1; i >= 0; i--) {
			this.entities[i].stop(fadeOut);
		};
	};

	return SoundManager;
});