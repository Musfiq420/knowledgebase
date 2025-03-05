class WebviewEmbedBlock {
    static get toolbox() {
      return {
        title: "Webview",
        icon: "🌐",
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
  
    render() {
      this.wrapper = document.createElement("div");
      this.wrapper.classList.add("webview-embed-block");
  
      // Title (text in read-only mode, input in edit mode)
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
        titleElement.classList.add("webview-title");
      }
      this.wrapper.appendChild(titleElement);
  
      // URL input (hidden in read-only mode)
      if (!this.readOnly) {
        const urlInput = document.createElement("input");
        urlInput.type = "text";
        urlInput.placeholder = "Enter webpage URL";
        urlInput.value = this.data.url;
        urlInput.addEventListener("input", (e) => {
          this.data.url = e.target.value;
          iframe.src = e.target.value;
        });
        this.wrapper.appendChild(urlInput);
      }
  
      // Iframe to display the embedded webview
      const iframe = document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "600px";
      iframe.style.border = "none";
      if (this.data.url) {
        iframe.src = this.data.url;
      }
      this.wrapper.appendChild(iframe);
  
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
  
  export default WebviewEmbedBlock;
  