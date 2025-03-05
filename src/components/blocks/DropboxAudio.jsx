class DropboxAudioBlock {
  static get toolbox() {
    return {
      title: "Dropbox Audio",
      icon: "🎵",
    };
  }

  constructor({ data, api, config, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      title: data.title || "",
      url: data.url || "",
    };
    this.wrapper = null;
  }

  convertDropboxLink(url) {
    if (url.includes("dropbox.com")) {
      return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
    }
    return url;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("dropbox-audio-block");

    
    const titleElement = document.createElement(this.readOnly ? "p" : "input");
    if (!this.readOnly) {
      titleElement.type = "text";
      titleElement.placeholder = "Enter title";
      titleElement.value = this.data.title;
      titleElement.addEventListener("input", (e) => {
        this.data.title = e.target.value;
      });
    } else {
      titleElement.textContent = this.data.title;
      titleElement.classList.add("audio-title");
    }
    this.wrapper.appendChild(titleElement);

    if (!this.readOnly) {
      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.placeholder = "Enter Dropbox MP3 URL";
      urlInput.value = this.data.url;
      urlInput.addEventListener("input", (e) => {
        this.data.url = e.target.value;
        audioPlayer.src = this.convertDropboxLink(e.target.value);
      });
      this.wrapper.appendChild(urlInput);
    }

    const audioPlayer = document.createElement("audio");
    audioPlayer.controls = true;
    if (this.data.url) {
      audioPlayer.src = this.convertDropboxLink(this.data.url);
    }
    this.wrapper.appendChild(audioPlayer);

    return this.wrapper;
  }

  save() {
    return {
      title: this.data.title,
      url: this.data.url,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }
}

export default DropboxAudioBlock;
