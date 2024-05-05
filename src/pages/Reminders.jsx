import React, {useState, useEffect} from 'react'

const Reminders = () => {
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      };

      setRecognition(recognition)
    } else {
      console.error('Speech recognition not supported in this browser')
    }
  }, [])

  const startRecognition = () => {
    if(recognition) {
      recognition.start();
      console.log('Speech recognition started.')
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop()
      console.log('Speech recognition stopped')
    }
  }
  return (
    <div>
      <button onClick={startRecognition}>Start</button>
      <button onClick={stopRecognition}>Stop</button>
      <p>{transcript}</p>
    </div>
  )
}

export default Reminders