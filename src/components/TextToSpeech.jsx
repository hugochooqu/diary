import { useState, useContext } from "react";
import { stateContext } from "../App";
import { FaBullhorn, FaMicrophoneAltSlash} from "react-icons/fa";

const TextToSpeech = (entry) => {
    const [text, setText] = useState(entry)
    // const [speaking, setSpeaking] = useState(false)
    const {read, edit, speaking, setSpeaking, stopSpeaking} = useContext(stateContext)


    var entryText = entry
    if(!read) {
        console.log('not read')
    } else {console.log('read')}

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

    // if(!read && !edit) {
    //     window.speechSynthesis.cancel()
    //     setSpeaking(false)
    // }

    // const stopSpeaking = () => {
    //     window.speechSynthesis.cancel()
    //     setSpeaking(false)
    // };



    return (
        <div>
            {!speaking ?<FaBullhorn onClick={speak} /> :<FaMicrophoneAltSlash onClick={stopSpeaking}/> }
        </div>
    )
}

export default TextToSpeech;