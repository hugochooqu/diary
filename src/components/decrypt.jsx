import React from 'react'
import forge from 'node-forge'

const Decrypt = (props) => {
    const encryptedData = props.encryptedData
    const key = props.decryptKey;
    const iv = props.iv

    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(encryptedData));
    decipher.finish()
    const decryptedData = decipher.output.toString('utf8')
  return (
    <div>{decryptedData}</div>
  )
}

export default Decrypt