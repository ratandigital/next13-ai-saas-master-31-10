import { useState, FormEvent } from 'react';

export default function Home() {
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setAudioUrl(data.audioUrl); // Set audioUrl if successful
      } else {
        console.error('Error:', data.message); // Handle errors
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <div>
      <h1>Text to Speech</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here"
          required
        />
        <button type="submit">Convert to Speech</button>
      </form>

      {audioUrl && (
        <div>
          <h2>Generated Speech</h2>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
