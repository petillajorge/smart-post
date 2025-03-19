import { useState, useRef } from 'react';

export default function ImageDecoderBase64() {
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        try {
          // Check if it's a valid base64 data URL
          if (base64Data.startsWith('data:image/')) {
            setImageUrl(base64Data);
          } else {
            // Assume it's just the base64 string (without the data URL prefix)
            const mimeType = getMimeTypeFromBase64(base64Data); //try to determine mime type
            if(mimeType){
              setImageUrl(`data:${mimeType};base64,${base64Data}`);
            } else {
              console.error("Could not determine mime type, and the file did not start with a data url");
            }

          }
        } catch (error) {
          console.error('Error displaying base64 image:', error);
        }
      };
      reader.readAsText(file); // Read as text, as base64 is text
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const getMimeTypeFromBase64 = (base64String) => {
    const signatures = {
      '/9j/': 'image/jpeg',
      'iVBORw0KGgo': 'image/png',
      'R0lGODdh': 'image/gif',
      'UklGRi': 'image/webp'
    };
    for (const signature in signatures) {
      if (base64String.startsWith(signature)) {
        return signatures[signature];
      }
    }
    return null;
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/jpg, image/png" // Accept text files (base64)
        style={{ display: 'none' }}
      />
      <button onClick={handleClick}>Upload Base64 Image File</button>

      {imageUrl && (
        <div>
          <h3>Base64 Image:</h3>
          <img src={imageUrl} alt="Base64 Image" style={{ maxWidth: '500px' }} />
        </div>
      )}
    </div>
  );
}