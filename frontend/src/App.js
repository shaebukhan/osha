import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
function App() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using a try/catch block for better error handling
    const fetchLetters = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/letters/get-all-letters`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLetters(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) {
    return <div className="p-4">Loading letters...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const extractPlainText = (htmlContent) => {
    // Remove <style> and <script> content manually first
    const noStyleOrScript = htmlContent
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

    // Sanitize remaining HTML (optional for extra safety)
    const cleanHTML = DOMPurify.sanitize(noStyleOrScript, {
      USE_PROFILES: { html: false }, // removes all HTML tags
    });

    // Convert to plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanHTML;

    return tempDiv.textContent || tempDiv.innerText || "";
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">OSHA Letters</h1>

      {letters.length === 0 ? (
        <p>No letters available.</p>
      ) : (
        <div className="space-y-6">
          {letters.map((letter) => (
            <div
              key={letter._id}
              className="border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-800">
                {letter.title}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(letter.date).toLocaleDateString()}
              </p>

              {/* Add a specific class for styling the letter content */}
              <div className="card card-body mb-3" />
              {extractPlainText(letter.content)}
              {letter.url && (
                <a
                  href={letter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  View Full Letter
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
