import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const GOOGLE_GEMINI_API_KEY = 'AIzaSyCwh-FzKXogzYqADO6CKfuUm599iwRkyL4';

const SnakeIdentifier = () => {
  const [loading, setLoading] = useState(false);
  const [snakeData, setSnakeData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    setLoading(true);
    setError(null);
    setSnakeData(null);

    try {
      const file = e.target.files[0];
      setImageFile(file);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/identify-snake', {
        method: 'POST',
        body: formData,
        headers: {
          'X-API-Key': GOOGLE_GEMINI_API_KEY,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to identify snake: ${errorData.error}`);
      }

      const data = await response.json();
      setSnakeData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {snakeData ? (
          <div className="bg-white shadow-md rounded-md p-6 space-y-4">
            <h2 className="text-2xl font-bold">{snakeData.name}</h2>
            <p className="text-gray-500">{snakeData.scientificName}</p>
            <p>{snakeData.description}</p>
            <img src={URL.createObjectURL(imageFile)} alt={snakeData.name} className="rounded-md" />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-md p-6 flex flex-col items-center justify-center space-y-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Camera className="h-12 w-12 text-gray-500" />
              <p className="text-gray-500">Upload an image of a snake</p>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {loading && (
              <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeIdentifier;
