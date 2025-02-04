import React from 'react';
import ReactDOM from 'react-dom';
import './link-preview.css'

const LinkPreview = ({ metadata }) => {
  return (
    <div className="link-preview-container">
      {metadata.image && (
        <img src={metadata.image.url} alt={metadata.title} />
      )}
      <div>
      <a href={metadata.url} target="_blank" rel="noopener noreferrer">{metadata.title}</a>
      {metadata.description && <p>{metadata.description}</p>}
      {/* <a href={metadata.url} target="_blank" rel="noopener noreferrer">
        Visit Website
      </a> */}
      </div>
    </div>
  );
};


class LinkPreviewTool {
  static get toolbox() {
    return {
      title: 'Link Preview',
      icon: '<svg>...</svg>', // Add an icon for the tool
    };
  }

  constructor({ data, api, readOnly }) {
    this.data = data;
    this.api = api;
    this.readOnly = readOnly; // Store the read-only flag
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('link-preview');

    if (this.data && this.data.url) {
      this._renderPreview(this.data);
    } else if (!this.readOnly) {
      // Only show the input field if not in read-only mode
      this._createInput();
    }

    return this.wrapper;
  }

  _createInput() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Paste a link to generate a preview...';
    input.addEventListener('paste', (event) => {
      const url = event.clipboardData.getData('text');
      this._fetchMetadata(url);
    });

    this.wrapper.appendChild(input);
  }

  async _fetchMetadata(url) {
    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const metadata = await response.json();

      if (metadata.data) {
        this._renderPreview(metadata.data);
        this.data = { url, ...metadata.data }; // Save the data
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
  }

  _renderPreview(metadata) {
    // Render the React component into the wrapper
    this.wrapper.innerHTML = '';
    ReactDOM.render(<LinkPreview metadata={metadata} />, this.wrapper);
  }

//   _renderPreview(metadata) {
//     this.wrapper.innerHTML = '';

//     const preview = document.createElement('div');
//     preview.classList.add('link-preview-container');

//     if (metadata.image) {
//       const image = document.createElement('img');
//       image.src = metadata.image.url;
//       image.alt = metadata.title;
//       preview.appendChild(image);
//     }

//     const title = document.createElement('h3');
//     title.textContent = metadata.title;
//     preview.appendChild(title);

//     if (metadata.description) {
//       const description = document.createElement('p');
//       description.textContent = metadata.description;
//       preview.appendChild(description);
//     }

//     const link = document.createElement('a');
//     link.href = metadata.url;
//     link.textContent = 'Visit Website';
//     link.target = '_blank';
//     preview.appendChild(link);

//     this.wrapper.appendChild(preview);
//   }

  save() {
    return {
        url: this.data.url,
        title: this.data.title,
        description: this.data.description,
        image: this.data.image,
    };
  }

  static get isReadOnlySupported() {
    return true; // Indicate that this tool supports read-only mode
  }
}

export default LinkPreviewTool;