import React,{useContext} from 'react'
import Modal from '../components/Modal'
import {AiFillCloseCircle} from 'react-icons/ai'
import { stateContext } from '../App'

const ViewProfile = () => {
    const {showProfileHandler} = useContext(stateContext)
  return (
    <Modal onClose={showProfileHandler}>
        <div>
            <AiFillCloseCircle onClick={showProfileHandler} />
        </div>
    </Modal>
  )
}

export default ViewProfile