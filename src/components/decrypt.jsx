import React from 'react'
import forge from 'node-forge'
import { useContext } from 'react'
import { stateContext } from '../App'

const Decrypt = (props) => {
    const {expanded} = useContext(stateContext)

    const encryptedData = props.encryptedData
    const key = props.decryptKey;
    const iv = props.iv

    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(encryptedData));
    decipher.finish()
    const decryptedData = decipher.output.toString('utf8')
  return (
    <div>{!expanded? <i>{decryptedData.slice(0, 100)} </i> : <p>{decryptedData}</p>}</div>
  )
}

export default Decrypt