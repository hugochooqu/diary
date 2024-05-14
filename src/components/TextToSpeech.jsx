import { useState } from "react";
import { FaBullhorn, FaMicrophoneAltSlash} from "react-icons/fa";

const TextToSpeech = (entry) => {
    const [text, setText] = useState(entry)
    const [speaking, setSpeaking] = useState(false)

    var entryText = entry

    console.log(entryText)

    const speak = () => {
        if (!speaking && entryText !== undefined) {
            console.log(entryText)
            const utterance = new SpeechSynthesisUtterance(entryText.entry)
            console.log(utterance)
            window.speechSynthesis.speak(utterance)
            setSpeaking(true)
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel()
        setSpeaking(false)
    };

    return (
        <div>
            {!speaking ?<FaBullhorn onClick={speak} /> :<FaMicrophoneAltSlash onClick={stopSpeaking}/> }
        </div>
    )
}

export default TextToSpeech;