import React, { useState, useRef, useEffect } from 'react';
import { Loader, Image as ImageIcon, RefreshCw, Share, Wand2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'
import SignIn from './SignIn'; // Adjust path
import SignUp from './SignUp'; // Adjust path
import AuthStatus from './AuthStatus'; // Adjust path
import SignOut from './SignOut'; // Adjust path

const PostGeneratorAuth = () => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Normal');
  const [wordCount, setWordCount] = useState(50);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  //const [isGenerating, setIsGenerating] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [textGenerated, setTextGenerated] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  //Auth consts
  const [requestCount, setRequestCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  
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


  // Auth consts
  /*
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth State Change:', { event, session });
      setUser(session?.user || null);
  
      
    });
  
    fetchRequestCount();
  }, [user]);

  //const supabase = getSupabaseClient(user);

  const fetchRequestCount = async () => {
    let sessionId = localStorage.getItem('session_id');

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);
    }

    console.log("Fetch request count, session id:", sessionId);

    const { data, error } = await supabase // Use the directly imported supabase client
      .from('session_request')
      .select('request_count')
      .eq('session_id', sessionId)
      .single();

    if (data) {
      setRequestCount(data.request_count);
    } else {
      const { data: dataSearch, error: errorSearch } = await supabase
        .from('session_request')
        .select('session_id')
        .eq('session_id', sessionId)
        .single();

      if (dataSearch) {
        console.log("Session id already in the database");
      } else {
        const { error: insertError } = await supabase
          .from('session_request')
          .insert({ session_id: sessionId });

        if (insertError) {
          console.error('Error inserting session_id:', insertError);
        } else {
          setRequestCount(0);
        }
      }
    }
  };
  */

  const incrementRequestCount = async () => {
    const sessionId = localStorage.getItem('session_id');
    await supabase // Use the directly imported supabase client
      .from('session_request')
      .update({ request_count: requestCount + 1 })
      .eq('session_id', sessionId);
    setRequestCount(requestCount + 1);
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
    if (!user && requestCount >= 3) {
      setShowAuthModal(true);
      return;
    }
    
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
        - Word count: approximately ${wordCount} words
        - No quotes at start and end`;
        
        let requestParts = [geminiPrompt];
        
        // Add image if available
        let imageUrl = null;
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
          
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${mimeType.split('/')[1]}`;
          console.log(`Filename is: ${fileName}`);
          const { error: uploadError } = await supabase.storage
                .from('post-images')
                .upload(`images/${fileName}`, base64ToBinary(imagePreview), {
                    contentType: mimeType,
                    upsert: false,
                });

          if (uploadError) {
                  console.error('Image upload error:', uploadError);
                  setError('Failed to upload image. Please try again.');
                  alert('Failed to upload image. Please try again.');
                  setIsGenerating(false);
                  return; // Stop further processing
              }

            imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/images/${fileName}`;
        
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

          // Check if user is logged in
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession(); // use supabase imported directly

          if (sessionError || !sessionData?.session) {
            console.log('User session missing.');
            // Handle unauthenticated user case
            if(!user){
              await incrementRequestCount();
            }
            setIsGenerating(false);
            return; // Stop further processing
          }
    
          // Get the current user
          const { data: userData, error: userError } = await supabase.auth.getUser(); // use supabase imported directly
    
          if (userError || !userData?.user) {
            console.error('Error getting user:', userError);
            setError('Authentication error. Please log in again.');
            setIsGenerating(false);
            return;
          }

          const userId = userData.user.id;

          const insertData = {
              description: prompt,
              tone: tone,
              word_length: wordCount,
              image_url: imageUrl,
              generated_description: data.text,
              timestamp: new Date(),
              user_id: userId,
          };

          const { error: insertError } = await supabase.from('requests').insert(insertData);

          if (insertError) {
            console.error('Supabase database error:', insertError);
            setError('Failed to save post data.');
          }

          if(!user){
            await incrementRequestCount();
          }
          setIsGenerating(false);
        } else {
          console.error('Invalid API response:', data);
          setError('Invalid response from the server. Please try again.');
          setIsGenerating(false);
        }
        
      } catch (error) {
        console.error('Error generating post:', error);
        setError('Failed to generate post. Please try again.');
        alert('Failed to generate post. Please try again.');
        setIsGenerating(false);
      }

      if (!user) {
        setRequestCount((prevCount) => prevCount + 1);
      }
    };
  
  // CloseAuth
  const closeModal = () => {
    setShowAuthModal(false);
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
    <div className="w-full max-w-4xl mx-auto p-4 bg-gradient-to-br from-purple-400 to-yellow-100 rounded-lg shadow-2xl mb-16">
      {/*<h1 className="text-2xl font-bold text-center mb-6">Social Media Post Generator</h1>*/}
      {/* First Row - Input Form */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg select-none">
      {/*
      <AuthStatus />
      <SignIn />
      <SignUp />
      */}
      {user && <SignOut />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 flex justify-center sm:justify-start items-center">
              <label className="block text-xl md:ml-1 font-medium caret-color-black">
                What is your post about?
              </label>
            </div>
            <div className="col-span-1 flex justify-center sm:justify-end items-center">
              <button
                className={`
                  p-2 
                  rounded-lg
                  flex 
                  items-center 
                  justify-center 
                  hover:bg-purple-500 
                  bg-purple-400
                  transition-colors 
                  font-medium
                  text-white
                  shadow-md
                  ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={handleMagicWandClick}
                disabled={isGenerating}
                title="Get random prompt suggestion"
              >
                Generate Prompt
                <Wand2 className="h-5 w-5 ml-2 text-white" />
              </button>
            </div>
          </div>

  {/* Second Row - Textarea */}
  <div className="mt-4">
    <textarea
      className="w-full p-2 border rounded-md h-24 bg-white"
      placeholder="Write information for preparing your post..."
      maxLength={600}
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      disabled={isGenerating}
      style={{ resize: "vertical", minHeight: "42px" }}
    />
    <div className="text-right text-xs text-gray-500">
      {prompt.length}/600 characters
    </div>
  </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <label className="block text-lg font-medium mt-1 mb-1">Tone</label>
            <select 
              className="w-full p-2 border rounded-md bg-white text-grey bg-grey-300 "
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={isGenerating}
            >
              {toneOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full">
            <label className="block text-lg font-medium mt-1 mb-1">Word Count: {wordCount}</label>
            <input
              type="range"
              min="5"
              max="200"
              className="w-full h-3 mt-3 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-full appearance-none cursor-pointer"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              disabled={isGenerating}
              style={{
                '--thumb-size': '22px', // Adjust the size here
              }}
            />
            <style jsx>{`
              input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: var(--thumb-size);
                height: var(--thumb-size);
                background: #a0a0a0; /* Grey color */
                border-radius: 50%;
                cursor: pointer;
              }

              input[type='range']::-moz-range-thumb {
                width: var(--thumb-size);
                height: var(--thumb-size);
                background: #a0a0a0;
                border-radius: 50%;
                cursor: pointer;
              }
            `}</style>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-lg font-medium mb-1">Upload your post image (optional)</label>
            <div 
              className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-32 cursor-pointer bg-gray-100 ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
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
          {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              textAlign: 'center',
            }}
          >
            <h2>Please Authenticate</h2>
            <p>You have reached the limit of free requests. Please sign in or sign up to continue.</p>
            <SignIn />
            <SignUp />
            <button onClick={closeModal} style={{ marginTop: '10px' }}>
              Close
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
      
      {/* Second Row - Results */}
      <div className="p-4 bg-gray-50 rounded-lg min-h-40">
        <h2 className="text-lg font-semibold mb-2">Generated Post</h2>
        <div className="bg-white p-4 rounded-md border mb-4 min-h-16">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : displayText ? (
            <p className="whitespace-pre-wrap">{displayText}</p>
          ) : isGenerating ? (
            <div className="flex justify-center items-center h-16">
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

export default PostGeneratorAuth;