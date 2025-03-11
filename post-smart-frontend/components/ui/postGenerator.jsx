import React, { useState, useRef, useEffect } from 'react';
import { Loader, Image as ImageIcon, RefreshCw, Share, Wand2 } from 'lucide-react';

const SocialMediaPostGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Normal');
  const [wordCount, setWordCount] = useState(50);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [textGenerated, setTextGenerated] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  
  const toneOptions = [
    'Polite',
    'Funny',
    'Informational',
    'Professional',
    'Casual',
    'Enthusiastic',
    'Serious',
    'Normal'
  ];
  
  // Random prompt suggestions
  const promptSuggestions = [
    "Write about a new product launch that will revolutionize our industry",
    "Share an exciting announcement about our upcoming event",
    "Tell a story about how our service helped a customer",
    "Highlight a recent achievement or milestone for our team",
    "Share an interesting tip or trick related to our field",
    "Discuss an industry trend that everyone should know about",
    "Introduce a special offer or promotion for our followers",
    "Share behind-the-scenes insights about our work process",
    "Ask for feedback on a new feature we're developing",
    "Share an inspiring customer testimonial or success story",
    "Write a post for Instagram where...",
    "Write an attractive post to get the attention of my followers",
    "Write an inspirational text to add on my photo"
  ];
  
  // Function to get a random prompt suggestion
  const getRandomPromptSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * promptSuggestions.length);
    return promptSuggestions[randomIndex];
  };
  
  // Handle magic wand click
  const handleMagicWandClick = () => {
    if (!isGenerating) {
      setPrompt(getRandomPromptSuggestion());
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 // Convert base64 data to binary for API request
 const base64ToBinary = (base64Data) => {
    // Remove data URL prefix if present
    const base64String = base64Data.includes(',') 
      ? base64Data.split(',')[1] 
      : base64Data;
    
    return base64String;
  };

  // Function to determine MIME type from data URL
  const getMimeTypeFromDataUrl = (dataUrl) => {
    if (!dataUrl || !dataUrl.includes(',')) return 'image/jpeg';
    return dataUrl.split(',')[0].split(':')[1].split(';')[0];
  };


  const generatePost = async () => {
    if (prompt.trim() === '') {
      alert('Please enter a prompt first');
      return;
    }
    if (isGenerating) {
        return; // Prevent multiple simultaneous requests
      }
    setIsGenerating(true);
    setTextGenerated(false);
    setDisplayText('');
    setError('');
    
    try {
        // Build the prompt for Gemini
        let geminiPrompt = `Generate an engaging social media post with the following requirements:
        - Topic: ${prompt}
        - Tone: ${tone}
        - Word count: approximately ${wordCount} words`;
        
        let requestParts = [geminiPrompt];
        
        // Add image if available
        if (imagePreview) {
          const imageData = base64ToBinary(imagePreview);
          const mimeType = getMimeTypeFromDataUrl(imagePreview);
          
          requestParts.push({
            inlineData: {
              data: imageData,
              mimeType: mimeType
            }
          });
          
          // Add context about the image to the prompt
          geminiPrompt += "\n- This post should reference the attached image in a relevant way.";
        }
        
        // API call to Next.js backend route that will handle Gemini API
        const response = await fetch('/api/generate-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: geminiPrompt,
            imagePart: imagePreview ? {
              data: base64ToBinary(imagePreview),
              mimeType: getMimeTypeFromDataUrl(imagePreview)
            } : null,
            tone,
            wordCount
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate post');
        }
        
        const data = await response.json();
        if (data && data.text) {
            setGeneratedText(data.text);
            setIsGenerating(false);
          } else {
            throw new Error('Invalid response format');
          }
        
      } catch (error) {
        console.error('Error generating post:', error);
        setError('Failed to generate post. Please try again.');
        alert('Failed to generate post. Please try again.');
        setIsGenerating(false);
      }
    };
  
  // Typewriter effect
  useEffect(() => {
    if (generatedText && !isGenerating) {
      let i = 0;
      const typing = setInterval(() => {
        setDisplayText(generatedText.substring(0, i));
        i++;
        if (i > generatedText.length) {
          clearInterval(typing);
          setTextGenerated(true);
        }
      }, 10);
      
      return () => clearInterval(typing);
    }
  }, [generatedText, isGenerating]);
  
  const sharePost = () => {
    // Placeholder for share functionality
    alert('Sharing post: ' + generatedText);
    // In a real app, this would integrate with social media APIs
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md mb-16">
      <h1 className="text-2xl font-bold text-center mb-6">Social Media Post Generator</h1>
      
      {/* First Row - Input Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg select-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1 caret-color-black">Post Prompt (max 600 characters)</label>
            <button 
                className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={handleMagicWandClick}
                disabled={isGenerating}
                title="Get random prompt suggestion"
            >
                <Wand2 className="h-4 w-4 text-purple-600" />
            </button>
            <textarea 
              className="w-full p-2 border rounded-md h-24"
              placeholder="Enter what you want to post about..."
              maxLength={600}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              style={{ resize: "vertical", minHeight: "42px" }}
            />
            <div className="text-right text-xs text-gray-500">{prompt.length}/600 characters</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tone</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={isGenerating}
            >
              {toneOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Word Count</label>
            <input 
              type="number" 
              min="10" 
              max="200"
              className="w-full p-2 border rounded-md"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              disabled={isGenerating}
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Image (optional)</label>
            <div 
              className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-40 cursor-pointer bg-gray-100 ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => !isGenerating && fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={!isGenerating ? handleDrop : null}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full max-w-full object-contain" />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click or drag and drop an image here</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={isGenerating}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            className="w-full text-white font-semibold py-2 rounded-lg shadow-md flex items-center justify-center bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50"
            onClick={generatePost}
            disabled={isGenerating || prompt.trim() === ''}
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Post
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Second Row - Results */}
      <div className="p-4 bg-gray-50 rounded-lg min-h-40">
        <h2 className="text-lg font-semibold mb-2">Generated Post</h2>
        <div className="bg-white p-4 rounded-md border mb-4 min-h-24">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : displayText ? (
            <p className="whitespace-pre-wrap">{displayText}</p>
          ) : isGenerating ? (
            <div className="flex justify-center items-center h-20">
              <Loader className="animate-spin h-6 w-6 text-gray-400" />
            </div>
          ) : (
            <p className="text-gray-400 italic">Your generated post will appear here</p>
          )}
        </div>
        
        {textGenerated && (
          <div className="flex justify-center">
            <button
              className="px-6 py-2 text-white font-semibold rounded-md shadow-md flex items-center bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50"
              onClick={sharePost}
            >
              <Share className="mr-2 h-4 w-4" />
              Share Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPostGenerator;