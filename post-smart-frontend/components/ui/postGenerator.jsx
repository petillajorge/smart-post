import React, { useState, useRef, useEffect } from 'react';
import { Loader, Image as ImageIcon, RefreshCw, Share } from 'lucide-react';

const SocialMediaPostGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Polite');
  const [wordCount, setWordCount] = useState(50);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [textGenerated, setTextGenerated] = useState(false);
  
  const fileInputRef = useRef(null);
  
  const toneOptions = [
    'Polite',
    'Funny',
    'Informational',
    'Professional',
    'Casual',
    'Enthusiastic',
    'Serious'
  ];
  
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


  const generatePost = () => {
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
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Example generated texts based on tone
      const toneExamples = {
        'Polite': `Thank you for your interest in our product. We're excited to share that ${prompt}. We value your support and would love to hear your thoughts on this!`,
        'Funny': `OMG! You won't believe what just happened! ${prompt} 😂 I'm literally dying of laughter right now! Who else can relate?!`,
        'Informational': `Here's what you need to know: ${prompt}. Studies show this approach increases efficiency by 30%. For more details, check the link in bio.`,
        'Professional': `We're pleased to announce that ${prompt}. This strategic development aligns with our long-term objectives and creates substantial value for all stakeholders.`,
        'Casual': `Hey everyone! Just wanted to let you know that ${prompt}. Pretty cool, right? Drop a comment if you're excited about this too!`,
        'Enthusiastic': `AMAZING NEWS!!! ${prompt} and we couldn't be more THRILLED about it! This is a GAME-CHANGER! Who's with us?! 🔥🔥🔥`,
        'Serious': `Important announcement: ${prompt}. We ask for your attention on this matter as it may affect our community. Please read carefully.`
      };
      
      // Generate text based on prompt and selected tone
      let text = toneExamples[tone] || `${prompt} - This is a ${tone.toLowerCase()} post about the topic.`;
      
      // Adjust length to approximate word count
      const words = text.split(' ');
      if (words.length > wordCount) {
        text = words.slice(0, wordCount).join(' ');
      } else {
        // Pad with generic text if too short
        while (words.length < wordCount) {
          words.push('Lorem ipsum dolor sit amet.');
        }
        text = words.slice(0, wordCount).join(' ');
      }
      
      setGeneratedText(text);
      setIsGenerating(false);
    }, 1500);
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
      }, 30);
      
      return () => clearInterval(typing);
    }
  }, [generatedText, isGenerating]);
  
  const sharePost = () => {
    // Placeholder for share functionality
    alert('Sharing post: ' + generatedText);
    // In a real app, this would integrate with social media APIs
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Social Media Post Generator</h1>
      
      {/* First Row - Input Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Post Prompt (max 600 characters)</label>
            <textarea 
              className="w-full p-2 border rounded-md h-24"
              placeholder="Enter what you want to post about..."
              maxLength={600}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="text-right text-xs text-gray-500">{prompt.length}/600 characters</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tone</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
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
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Image (optional)</label>
            <div 
              className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-40 cursor-pointer bg-gray-100"
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
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
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            className="w-full text-white font-semibold py-2 rounded-lg shadow-md flex items-center justify-center bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50"
            onClick={generatePost}
            disabled={isGenerating}
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
          {displayText || (isGenerating ? 
            <div className="flex justify-center items-center h-20">
              <Loader className="animate-spin h-6 w-6 text-gray-400" />
            </div> : 
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