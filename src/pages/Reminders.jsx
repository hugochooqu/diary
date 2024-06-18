import React, {useState, useEffect} from 'react'

const Reminders = () => {
  
  return (
    <div>
      
      <h1>COMING SOON!!!</h1>
    </div>
  )
}

export default Reminders

{/* <button onClick={startListening} disabled={listening}>Start</button>
      <button onClick={stopListening} disabled={!listening}>Stop</button>
      <p>Recognized Text: {recognizedText}</p> */}
// const [recognizedText, setRecognizedText] = useState('');
  // const [listening, setListening] = useState(false);
  // let recognition = null

  // useEffect(() => {
  //   recognition = new window.webkitSpeechRecognition() ||new window.SpeechRecognition()

  //   recognition.interimResults = true;

  //   recognition.onstart = () => {
  //     setListening(true);
  //   };

  //   recognition.onerror = (event) => {
  //     console.error('Speech recognition error:', event.error);
  //     setListening(false);
  //   };

  //   recognition.onend = () => {
  //     setListening(false);
  //   };

  //   recognition.onresult = (event) => {
  //     let interimTranscript = '';
  //     let finalTranscript = '';

  //     for (let i = event.resultIndex; i < event.results.length; ++i) {
  //       if (event.results[i].isFinal) {
  //         finalTranscript += event.results[i][0].transcript;
  //       } else {
  //         interimTranscript += event.results[i][0].transcript;
  //       }
  //     }

  //     setRecognizedText(finalTranscript);
  //   };

  //   return () => {
  //     recognition.abort();
  //   };
  // }, []);

  // const startListening = () => {
  //   setRecognizedText('');
  //   recognition.start();
  // };

  // const stopListening = () => {
  //   recognition.stop();
  // };